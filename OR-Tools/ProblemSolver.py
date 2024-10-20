import os
import sys
import signal
import json
import threading
import logging
import logging.config
from logging.handlers import TimedRotatingFileHandler

from dotenv import load_dotenv
from confluent_kafka import Consumer, Producer, KafkaError

from LPSolver import LPSolver
from VRPSolver import VRPSolver

LOG_DIRECTORY = "./logs"


class ProblemSolver:
    def __init__(self):
        # Read environment variables
        load_dotenv()
        self._app_id = os.getenv("APP_ID")
        self._solver_id = int(os.getenv("SOLVER_ID"))
        self._broker_uri = os.getenv("BROKER_URI")
        self._max_execution_time = int(os.getenv("EXECUTION_TIME_LIMIT"))

        # Initialize logger
        if not os.path.exists(LOG_DIRECTORY):
            os.makedirs(LOG_DIRECTORY)
        config_file = "logger.ini"
        with open(config_file, "r") as file:
            config = file.read()
        log_filename = os.path.join(LOG_DIRECTORY, f"log-{self._solver_id}")
        config = config.replace("PLACEHOLDER", log_filename)
        with open("temp_logger.ini", "w") as file:
            file.write(config)

        logging.config.fileConfig("temp_logger.ini")
        self._logger = logging.getLogger("root")
        for handler in self._logger.handlers:
            if isinstance(handler, TimedRotatingFileHandler):
                handler.suffix = "%Y-%m-%d"
                handler.extMatch = handler.extMatch
        self._logger.info(f"OR-Tools Solver instance {self._solver_id} started")

        self._consumers = []
        self._solver_thread = None
        self._problem_id = None
        self._stop_event = threading.Event()

        # Service started - Send a message to notify that it's free
        self._send_message(
            "problem-execute-res",
            {"problemId": None, "solverId": self._solver_id},
        )

    def _solve_problem(
        self, problem_id: str, model_id: str, metadata: any, input_data: str
    ):
        """
        Execute the solver specified by model with the given parameters.

        Keyword arguments:
        - problem_id -- the unique identifier of the problem to be executed (used for reporting)
        - model_id -- the ID of the model to be executed
        - metadata -- the metadata needed by the model (in JSON format)
        - input_data -- input data with execution variables of the solver (in JSON format)
        """

        self._logger.info(f"Received problem (id={problem_id}, model={model_id})")
        self._problem_id = problem_id

        try:
            # Linear Programming Solver
            if model_id == LPSolver.get_id():
                solver = LPSolver(metadata, input_data)
            # Vehicle Routing Solver
            elif model_id == VRPSolver.get_id():
                solver = VRPSolver(metadata, input_data)
            # Invalid Model - Notify and return
            else:
                self._problem_id = None
                self._solver_thread = None
                self._logger.warning(f"Invalid model with ID {model_id})")
                self._send_message(
                    "problem-execute-res",
                    {
                        "problemId": problem_id,
                        "solverId": self._solver_id,
                        "error": f"Unknown model ID {model_id}",
                    },
                )
                return

            # Send ACK message - Execution started
            self._logger.info(
                f"Execution started for problem {problem_id} (model={model_id})"
            )
            self._send_message(
                "problem-execute-res",
                {
                    "problemId": problem_id,
                    "solverId": self._solver_id,
                },
            )

            # Solve the problem
            execution_time, result = solver.solve(self._max_execution_time)

        except Exception as e:
            self._logger.error(
                f"_solve_problem: Exception occured for {problem_id}: {str(e)}"
            )
            self._problem_id = None
            self._solver_thread = None
            self._send_message(
                "problem-execute-res",
                {
                    "problemId": problem_id,
                    "solverId": self._solver_id,
                    "error": str(e),
                },
            )
            return

        # Notify about the available result
        self._logger.info(f"Execution finished for {problem_id}")
        self._problem_id = None
        self._solver_thread = None
        self._send_message(
            "problem-result",
            {
                "problemId": problem_id,
                "executionTime": execution_time,
                "result": json.dumps(result),
                "solverId": self._solver_id,
            },
        )

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

    def run(self):
        """
        Start the consumer in order to subscribe to messages
        in the broker, and handle execution of requested problems.

        If a problem is already being executed, ignore the request.
        """
        # Initialize Kafka broker configuration
        self._requests_topic = f"problem-execute-req-{self._solver_id}"
        topics = [self._requests_topic, "problem-deleted"]
        broker_config = {
            "bootstrap.servers": self._broker_uri,
            "group.id": f"{self._app_id}-{self._solver_id}",
            "auto.offset.reset": "earliest",
            "enable.auto.commit": False,
        }

        self._consumers = [Consumer(broker_config) for _ in topics]
        for index in range(len(topics)):
            self._consumers[index].subscribe([topics[index]])

        while True:
            for consumer in self._consumers:
                try:
                    msg = consumer.poll(0.2)  # Poll for messages
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
                    if topic == self._requests_topic:
                        self._handle_incoming_request(problem_data)
                    elif topic == "problem-deleted":
                        consumer.commit(msg)
                        self._handle_problem_deletion(problem_data)
                        continue

                    consumer.commit(msg)
                except Exception as e:
                    self._logger.error(f"run: Exception occured on consumer: {str(e)}")
                    continue

    def _handle_incoming_request(self, problem):
        """
        Handle an incoming problem execution request received from the broker.

        If there is already an execution in progress, notify with the ID of the problem
        being executed.

        Otherwise, start the solver thread.

        Keyword arguments:
        - problem -- the problem submission as a dict, including the problem's ID,
        solver's ID, model, metadata & input data
        """
        problem_id = problem.get("problemId")
        model_id = problem.get("modelId")
        metadata = problem.get("metadata")
        input_data = problem.get("inputData")
        self._logger.debug(
            f"Received request for problem {problem_id}, model {model_id}"
        )

        # Already executing a problem - Notify that solver is busy
        if self._problem_id is not None:
            self._logger.warning(f"Received request while busy ({self._problem_id})")
            self._send_message(
                "problem-execute-res",
                {
                    "problemId": self._problem_id,
                    "solverId": self._solver_id,
                },
            )
            return

        if problem_id is None:
            self._logger.warning("Invalid data - Missing required input 'problemId'")
            self._send_message(
                "problem-execute-res",
                {
                    "problemId": problem_id,
                    "solverId": self._solver_id,
                    "error": "Invalid data - Missing required input 'problemId'",
                },
            )
            return

        if model_id is None:
            self._logger.warning("Invalid data - Missing required input 'modelId'")
            self._send_message(
                "problem-execute-res",
                {
                    "problemId": problem_id,
                    "solverId": self._solver_id,
                    "error": "Invalid data - Missing required input 'modelId'",
                },
            )
            return

        if metadata is None:
            self._logger.warning("Invalid data - Missing required input 'metadata'")
            self._send_message(
                "problem-execute-res",
                {
                    "problemId": problem_id,
                    "solverId": self._solver_id,
                    "error": "Invalid data - Missing required input 'metadata'",
                },
            )
            return

        if input_data is None:
            self._logger.warning("Invalid data - Missing required input 'inputData'")
            self._send_message(
                "problem-execute-res",
                {
                    "problemId": problem_id,
                    "solverId": self._solver_id,
                    "error": "Invalid data - Missing required input 'inputData'",
                },
            )
            return

        # Start the solver on a separate thread
        self._solver_thread = threading.Thread(
            target=self._solve_problem,
            args=(problem_id, model_id, metadata, input_data),
        )
        self._solver_thread.daemon = True
        self._solver_thread.start()

    def _handle_problem_deletion(self, problem):
        """
        Handle an incoming message received from the broker that a problem needs to be deleted.

        If the problem is currently being executed on the solver, restart to stop the running thread.

        Keyword arguments:
        - problem -- the problem submission as a dict, including the problem's ID
        """
        # Try to parse problem ID from the request object
        problem_id = problem.get("problemId")

        if problem_id is None:
            return

        self._logger.debug(f"Received request to delete problem {problem_id}")

        if self._problem_id == problem_id:
            self._logger.warning(
                f"Restarting the solver in order to stop execution of {problem_id}"
            )
            sys.exit(-1)
        else:
            self._logger.debug(
                f"Ignore request for deleting unknown problem {problem_id}"
            )

    def __del__(self):
        """
        Destructor: Close the consumer and stop the execution (if active)
        """
        self._logger.critical("Shutting down...")
        for consumer in self._consumers:
            consumer.close()


if __name__ == "__main__":
    solver = ProblemSolver()

    def handle_interrupt(sig, frame):
        """
        Handle Ctrl+C or other interrupts to terminate the process properly
        """
        global solver
        del solver
        exit(0)

    signal.signal(signal.SIGINT, handle_interrupt)
    signal.signal(signal.SIGTERM, handle_interrupt)

    solver.run()
