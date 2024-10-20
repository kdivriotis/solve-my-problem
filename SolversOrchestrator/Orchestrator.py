import os
import signal
import json
import logging
import logging.config
from logging.handlers import TimedRotatingFileHandler
from datetime import datetime
from functools import wraps

from dotenv import load_dotenv
from confluent_kafka import Consumer, Producer, KafkaError, KafkaException
import redis
from flask import Flask, jsonify, request
import jwt

from BufferFIFO import BufferFIFO
from StatusManager import StatusManager
from RequestManager import RequestManager

LOG_DIRECTORY = "./logs"
EMPTY = ""


class Orchestrator:
    def __init__(self):
        self._start_time = datetime.now()

        # Read environment variables
        load_dotenv()
        self._app_id = os.getenv("APP_ID")

        self._flask_port = os.getenv("PORT")
        self._secret = os.getenv("JWT_SECRET", "secret")

        self._broker_uri = os.getenv("BROKER_URI")

        self._redis_host = os.getenv("REDIS_HOST")
        self._redis_port = int(os.getenv("REDIS_PORT"))

        self._solvers = int(os.getenv("SOLVERS"))
        # Retention time for deleted & executed problems in seconds
        self._deletions_retention_time = int(os.getenv("RETAIN_DELETED_PROBLEMS"))
        self._executed_retention_time = int(os.getenv("RETAIN_EXECUTED_PROBLEMS"))

        # Initialize logger
        if not os.path.exists(LOG_DIRECTORY):
            os.makedirs(LOG_DIRECTORY)
        logging.config.fileConfig("logger.ini")
        self._logger = logging.getLogger("root")
        for handler in self._logger.handlers:
            if isinstance(handler, TimedRotatingFileHandler):
                handler.suffix = "%Y-%m-%d"
                handler.extMatch = handler.extMatch
        self._logger.info("OR-Tools Solver Orchestrator started")

        # Initialize Redis connection
        self._redis = redis.Redis(
            host=self._redis_host, port=self._redis_port, decode_responses=True
        )

        def problem_equals_id(problem_json, problem_id):
            """
            Helper methood: Compares the JSON of a problem submission
            with a given ID, and returns True if the submission object's
            ID is equal to the given ID.

            Intended to be used as comparator callback on generic objects

            Keyword arguments:
            - problem_json -- the problem submission in JSON format, including the problem's ID,
            solver's ID, model, metadata & input data
            - problem_id -- the ID of the problem to check for equality with the problem above
            """
            try:
                problem = json.loads(problem_json)
                return problem["problemId"] == problem_id
            except:
                return False

        self._problems_buffer = BufferFIFO(
            "problems_buffer", self._redis_host, self._redis_port, problem_equals_id
        )
        self._solver_manager = StatusManager(
            "solver_status", self._redis_host, self._redis_port
        )
        self._request_manager = RequestManager(
            "active_requests", self._redis_host, self._redis_port, problem_equals_id
        )

        # Send messages to all solvers to find their status
        for solver_id in range(self._solvers):
            self._send_message(
                f"problem-execute-req-{solver_id+1}",
                {"problemId": None},
            )

        self._consumers = []

        # Initialize flask app
        self._app = Flask(__name__)
        self._setup_routes()

    def _get_available_solver(self):
        """
        Find the first available OR-Tools solver.

        A solver is considered to be available if it's status is EMPTY (no assigned problem)
        and there is no pending request towards the solver.

        Return the solver's ID, or None if all solvers are busy
        """
        solvers = self._solver_manager.get_solvers()
        for solver_id, problem_id in solvers.items():
            # Solver without assigned problem ID was found
            if problem_id == EMPTY:
                # Check if there is a pending request for this solver
                current_request = self._request_manager.get_request(solver_id)
                if current_request is None or current_request == EMPTY:
                    return solver_id
        return None

    def _assign_problem_to_solver(self, problem):
        """
        Try to assign a problem read from the broker to an
        available solver.

        If all solvers are busy, add to buffer (queue)

        Keyword arguments:
        - problem -- the problem submission as a dict, including the problem's ID,
        solver's ID, model, metadata & input data
        """
        solver_id = self._get_available_solver()
        if solver_id is not None:
            topic = f"problem-execute-req-{solver_id}"
            self._request_manager.update_request(solver_id, json.dumps(problem))
            self._logger.info(
                f"Assigned problem {problem['problemId']} to solver {solver_id}"
            )
            self._send_message(topic, problem)
        else:
            self._problems_buffer.enqueue(json.dumps(problem))
            self._logger.info(
                f"No available solvers - Add {problem['problemId']} to queue"
            )

    def _process_buffer(self):
        """
        Check if there are available solvers, and assign problems from the FIFO buffer
        """
        while (self._get_available_solver() is not None) and (
            not self._problems_buffer.is_empty()
        ):
            buffered_problem = self._problems_buffer.dequeue()
            problem = json.loads(buffered_problem)
            self._logger.info(
                f"Dequeued problem {problem['problemId']} from the buffer"
            )
            self._assign_problem_to_solver(problem)

    def run(self):
        """
        Start the consumer in order to subscribe to messages
        in the broker, and handle execution of requested problems and updating status
        of executed problems.

        Start Flask in a separate thread in order to listen to healthcheck endpoint
        """

        # Start Flask app in a separate thread
        from threading import Thread

        flask_thread = Thread(
            target=self._app.run, kwargs={"host": "0.0.0.0", "port": self._flask_port}
        )
        flask_thread.daemon = True
        flask_thread.start()

        # Initialize Kafka broker configuration
        topics = [
            "problem-execute-req",
            "problem-execute-res",
            "problem-result",
            "problem-deleted",
        ]
        broker_config = {
            "bootstrap.servers": self._broker_uri,
            "group.id": self._app_id,
            "auto.offset.reset": "earliest",
            "enable.auto.commit": False,
        }

        self._consumers = [Consumer(broker_config) for _ in topics]
        for index in range(len(topics)):
            self._consumers[index].subscribe([topics[index]])

        while True:
            for consumer in self._consumers:
                try:
                    msg = consumer.poll(0.2)
                    if msg is None:
                        continue
                    if msg.error():
                        self._logger.error(f"run: Kafka Error: {msg}")
                        if msg.error().code() == KafkaError._PARTITION_EOF:
                            # End of partition, exit consumer loop
                            self._logger.critical(
                                "run: Kafka end of partition - Exiting loop"
                            )
                            break
                        else:
                            continue

                    # Get message's topic to decide next action
                    topic = msg.topic()
                    self._logger.debug(f"Received message on topic {topic}")

                    # Decode the incoming JSON message - In case of erroneous values, ignore
                    problem_data = None
                    try:
                        problem_data = json.loads(msg.value().decode("utf-8"))
                        if problem_data is None:
                            consumer.commit(msg)
                            continue
                    except Exception as e:
                        consumer.commit(msg)
                        self._logger.error(
                            f"run: Error occured on received problem: {e}"
                        )
                        continue

                    # Handle the received message depending on the topic value
                    if topic == "problem-execute-req":
                        self._handle_incoming_request(problem_data)
                    elif topic == "problem-execute-res":
                        self._handle_solver_response(problem_data)
                    elif topic == "problem-result":
                        self._handle_solver_result(problem_data)
                    elif topic == "problem-deleted":
                        self._handle_problem_deletion(problem_data)

                    consumer.commit(msg)
                    self._process_buffer()
                except Exception as e:
                    self._logger.error(f"run: Exception occured on consumer: {str(e)}")
                    continue

    def _send_message(self, topic: str, message: any):
        """
        Produce a message to Kafka broker

        Keyword arguments:
        - topic -- the topic name where the message should be sent
        - message -- any object (dict, array etc.) that will be sent to the broker (will be turned to JSON before sending)
        """
        # Initialize Kafka broker configuration
        broker_config = {"bootstrap.servers": self._broker_uri}
        producer = Producer(broker_config)
        data = json.dumps(message)

        producer.produce(
            topic,
            data,
            callback=lambda err, msg: (
                self._logger.error(
                    f"_send_message: Producer Error: {err} (Topic: {topic}, Data: {data})"
                )
                if err is not None
                else self._logger.debug(f"Message Delivered (Topic: {topic})")
            ),
        )
        producer.poll(0)
        producer.flush()

    def _handle_incoming_request(self, problem):
        """
        Handle an incoming problem execution request received from the broker.

        First, check if there are already problems waiting in the queue.

        Then try to assign the received problem to a solver, or add it to the
        queue if all solvers are busy.

        Keyword arguments:
        - problem -- the problem submission as a dict, including the problem's ID,
        solver's ID, model, metadata & input data
        """
        problem_id = problem.get("problemId")
        if problem_id is None:
            return

        # Ignore the incoming request if problem is marked as deleted
        if self._redis.get(f"problem:{problem_id}:deleted") is not None:
            self._logger.warning(
                f"Received request for problem {problem_id} which is marked as deleted"
            )
            return

        # Ignore the incoming request if problem already exists in the queue
        if self._problems_buffer.find(problem_id) is not None:
            self._logger.warning(
                f"Received request for problem {problem_id} which already exists in the queue"
            )
            return

        # Ignore the incoming request if problem already exists in a request
        solvers = self._request_manager.get_solvers()
        for solver_id, _ in solvers.items():
            if self._request_manager.is_equal(solver_id, problem_id):
                self._logger.warning(
                    f"Received request for problem {problem_id} which is already sent towards solver {solver_id}"
                )
                return

        # Ignore the incoming request if problem is already running on a solver
        solvers = self._solver_manager.get_solvers()
        for solver_id, _ in solvers.items():
            if self._solver_manager.is_equal(solver_id, problem_id):
                self._logger.warning(
                    f"Received request for problem {problem_id} which is already running on solver {solver_id}"
                )
                return

        # Give priority to problems in the queue
        if not self._problems_buffer.is_empty():
            self._process_buffer()

        self._assign_problem_to_solver(problem)

    def _handle_solver_response(self, problem):
        """
        Handle an incoming problem execution response received from a solver instance.

        Solver can send 3 types of responses:
        - Ready to accept a new submission (not busy)
        - Error occured on given problem_id
        - Notify that it's running problem with ID = problem_id

        Keyword arguments:
        - problem -- the problem submission as a dict, including the problem's ID,
        solver's ID, model, metadata & input data
        """
        # Try to parse solver's problem & instance ID from the request object
        problem_id = problem.get("problemId")
        solver_id = problem.get("solverId")

        if solver_id is None:
            return

        # Response 1 - Ready to accept a new submission (not busy)
        if problem_id is None:
            # Discard previously known status
            solver_status = self._solver_manager.get_status(solver_id)
            if solver_status is not None and solver_status != EMPTY:
                if self._redis.get(f"problem:{solver_status}:deleted") is not None:
                    self._logger.info(
                        f"Deleted problem {solver_status} was removed from solver {solver_id}"
                    )
                else:
                    self._logger.warning(
                        f"Discarded problem {solver_status} from solver {solver_id}"
                    )
                    self._send_message(
                        "problem-execute-resend", {"problemId": solver_status}
                    )
            self._solver_manager.update_status(solver_id, EMPTY)

            # Move pending submissions towards this solver back to the buffer
            solver_request = self._request_manager.get_request(solver_id)
            if solver_request is not None and solver_request != EMPTY:
                self._request_manager.update_request(solver_id, EMPTY)
                self._problems_buffer.enqueue(solver_request, True)

            return

        error_msg = problem.get("error")
        if error_msg is not None:
            # Response 2 - Error occured on given problem_id : Set status of the solver to available

            self._solver_manager.update_status(solver_id, EMPTY)
        else:
            # Response 3 - Notify that it's running problem with ID = problem_id

            # Discard previously known status
            solver_status = self._solver_manager.get_status(solver_id)
            if (
                not self._solver_manager.is_equal(solver_id, problem_id)
                and solver_status is not None
                and solver_status != EMPTY
            ):
                if self._redis.get(f"problem:{solver_status}:deleted") is not None:
                    self._logger.info(
                        f"Deleted problem {solver_status} was removed from solver {solver_id}"
                    )
                else:
                    self._send_message(
                        "problem-execute-resend", {"problemId": solver_status}
                    )
                    self._logger.warning(
                        f"Discarded problem {solver_status} from solver {solver_id}"
                    )
            if self._redis.get(f"problem:{solver_status}:executed") is not None:
                self._logger.warning(
                    f"Received 'running' status for executed problem {problem_id} from solver {solver_id}"
                )
            else:
                self._logger.info(
                    f"Problem {problem_id} is running on solver {solver_id}"
                )
                self._solver_manager.update_status(solver_id, problem_id)

        # Common logic for Response 2 & Response 3

        # Delete the problem from the buffer (if it exists)
        if self._problems_buffer.find(problem_id) is not None:
            self._problems_buffer.delete(problem_id)

        # Clean-up the request - If the request doesn't match the response, move it back to the queue
        solver_request = self._request_manager.get_request(solver_id)
        if (
            solver_request is not None
            and solver_request != EMPTY
            and not self._request_manager.is_equal(solver_id, problem_id)
        ):
            self._problems_buffer.enqueue(solver_request, True)
        self._request_manager.update_request(solver_id, EMPTY)

    def _handle_solver_result(self, problem):
        """
        Handle an incoming message received from the broker that the problem execution is finished.
        (Result is available)

        Check if the executed problem matches the one held in status.

        Cleanup the request & status for this solver

        Keyword arguments:
        - problem -- the problem submission as a dict, including the problem's ID,
        solver's ID, model, metadata & input data
        """
        # Try to parse solver's problem & instance ID from the request object
        problem_id = problem.get("problemId")
        solver_id = problem.get("solverId")

        if problem_id is None or solver_id is None:
            return

        # Delete the problem from the buffer (if it exists)
        if self._problems_buffer.find(problem_id) is not None:
            self._problems_buffer.delete(problem_id)

        # Discard previously known status
        solver_status = self._solver_manager.get_status(solver_id)
        if (
            not self._solver_manager.is_equal(solver_id, problem_id)
            and solver_status is not None
            and solver_status != EMPTY
        ):
            if self._redis.get(f"problem:{solver_status}:deleted") is not None:
                self._logger.info(
                    f"Deleted problem {solver_status} was removed from solver {solver_id}"
                )
            else:
                self._send_message(
                    "problem-execute-resend", {"problemId": solver_status}
                )
                self._logger.warning(
                    f"Discarded problem {solver_status} from solver {solver_id}"
                )

        self._logger.info(
            f"Problem {problem_id} execution finished on solver {solver_id}"
        )
        self._solver_manager.update_status(solver_id, EMPTY)
        self._redis.set(
            f"problem:{problem_id}:executed", 1, ex=self._executed_retention_time
        )

        # Clean-up the request - If the request doesn't match the response, move it back to the queue
        solver_request = self._request_manager.get_request(solver_id)
        if (
            solver_request is not None
            and solver_request != EMPTY
            and not self._request_manager.is_equal(solver_id, problem_id)
        ):
            self._problems_buffer.enqueue(solver_request, True)

        self._request_manager.update_request(solver_id, EMPTY)

    def _handle_problem_deletion(self, problem):
        """
        Handle an incoming message received from the broker that a problem needs to be deleted.

        Delete the problem from the buffer and any submission requests.

        Keyword arguments:
        - problem -- the problem submission as a dict, including the problem's ID
        """
        # Try to parse problem ID from the request object
        problem_id = problem.get("problemId")

        if problem_id is None:
            return

        self._logger.debug(f"Received request to delete problem {problem_id}")
        self._redis.set(
            f"problem:{problem_id}:deleted", 1, ex=self._deletions_retention_time
        )

        # Delete problem from the queue
        if self._problems_buffer.find(problem_id):
            self._problems_buffer.delete(problem_id)
            self._logger.info(f"Deleted problem {problem_id} from the queue")

        # Delete problem from any pending submission requests
        solvers = self._request_manager.get_solvers()
        for solver_id, _ in solvers.items():
            # Request found that matches the problem to be deleted
            if self._request_manager.is_equal(solver_id, problem_id):
                self._request_manager.update_request(solver_id, EMPTY)
                self._logger.info(
                    f"Deleted request for problem {problem_id} towards solver {solver_id}"
                )

    def _check_kafka_status(self):
        """
        Check connection status to Kafka broker.

        Returns True if connection is ok, otherwise False
        """
        try:
            broker_config = {"bootstrap.servers": self._broker_uri}
            producer = Producer(broker_config)

            # Try listing topics
            metadata = producer.list_topics(timeout=5)
            if metadata.topics:
                return True
            else:
                return False
        except KafkaException as e:
            self._logger.error(f"Kafka status check failed: {str(e)}")
            return False
        except Exception as e:
            self._logger.error(f"Unexpected error during Kafka status check: {str(e)}")
            return False

    def _check_redis_status(self):
        """
        Check connection status to Redis database.

        Returns True if connection is ok, otherwise False
        """
        try:
            # Check Redis connectivity
            if self._redis.ping():
                return True
            else:
                return False
        except redis.RedisError as e:
            self._logger.error(f"Redis status check failed: {str(e)}")
            return False
        except Exception as e:
            self._logger.error(f"Unexpected error during Redis status check: {str(e)}")
            return False

    def _setup_routes(self):
        """
        Set up the REST API routes.

        - /api/healthcheck
        """

        def authorize_user(f):
            @wraps(f)
            def decorated_function(*args, **kwargs):
                # Extract the JWT from the "token" cookie
                token = request.cookies.get("token")

                if not token:
                    return (
                        jsonify(
                            {"message": "You are not authorized to access this page"}
                        ),
                        401,
                    )

                try:
                    # Decode the JWT using the secret key
                    decoded = jwt.decode(token, self._secret, algorithms=["HS256"])
                    # Attach the user information to the request
                    request.user = decoded["user"]
                except jwt.ExpiredSignatureError:
                    return jsonify({"message": "Token has expired"}), 401
                except:
                    return (
                        jsonify(
                            {"message": "You are not authorized to access this page"}
                        ),
                        401,
                    )

                # Continue to the endpoint
                return f(*args, **kwargs)

            return decorated_function

        @self._app.route("/api/healthcheck", methods=["GET"])
        @authorize_user
        def healthcheck():
            """
            Health check endpoint.
            """
            try:
                kafka_ok = self._check_kafka_status()
                redis_ok = self._check_redis_status()

                status = "Healthy" if kafka_ok and redis_ok else "Unhealthy"
                response = { "status": status }
                if not request.user["isAdmin"]:
                    return jsonify(response), 200

                components = []

                redis_status = "Connected" if redis_ok else "Disconnected"
                components.append({"name": "Redis", "status": redis_status})
                kafka_status = "Connected" if kafka_ok else "Disconnected"
                components.append({"name": "Kafka", "status": kafka_status})

                current_time = datetime.now()
                uptime = current_time - self._start_time
                uptime = int(uptime.total_seconds())

                solvers = self._solver_manager.get_solvers()
                solvers_status = []
                for solver_id, problem_id in solvers.items():
                    if problem_id == EMPTY:
                        solvers_status.append(
                            {"name": f"Solver {solver_id}", "status": "IDLE"}
                        )
                    else:
                        solvers_status.append(
                            {
                                "name": f"Solver {solver_id}",
                                "status": problem_id,
                            }
                        )
                solvers_status = sorted(solvers_status, key=lambda x: x["name"])
                components.extend(solvers_status)

                response["uptime"] = uptime
                response["components"] = components

                return jsonify(response), 200
            except Exception as e:
                self._logger.error(f"Health check failed: {str(e)}")
                return jsonify({"status": "Unhealthy"}), 500

    def __del__(self):
        """
        Destructor: Close the consumer
        """
        self._logger.critical("Shutting down...")
        for consumer in self._consumers:
            consumer.close()


if __name__ == "__main__":
    orchestrator = Orchestrator()

    def handle_interrupt(sig, frame):
        """
        Handle Ctrl+C or other interrupts to terminate the process properly
        """
        global orchestrator
        del orchestrator
        exit(0)

    signal.signal(signal.SIGINT, handle_interrupt)
    signal.signal(signal.SIGTERM, handle_interrupt)

    orchestrator.run()
