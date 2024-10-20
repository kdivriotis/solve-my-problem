import redis


class RequestManager:
    """
    Manages the active requests towards available solvers
    """

    def __init__(self, name, host, port, compare=lambda x, y: x == y):
        """
        Keyword arguments:
        - name -- the name of the buffer
        - host -- host name or IP of Redis
        - port -- connection port of Redis
        - compare -- function to be used when comparing a value to an entry of the buffer - returns True if equal otherwise false,
        e.g. lambda entry, value : entry["id"] == value
        """
        self._name = name
        self._compare = compare

        # Initialize Redis connection
        self._redis = redis.Redis(host=host, port=port, decode_responses=True)

    def update_request(self, solver_id, request):
        """
        Update the request of a solver

        Keyword arguments:
        - solver_id -- the unique identifier of the solver
        - request -- new request value to be updated
        """
        self._redis.hset(self._name, solver_id, request)

    def get_request(self, solver_id):
        """
        Get the current request of a solver

        Keyword arguments:
        - solver_id -- the unique identifier of the solver
        """
        return self._redis.hget(self._name, solver_id)

    def get_solvers(self):
        """
        Get all solvers along with their requests
        """
        return self._redis.hgetall(self._name)

    def is_equal(self, solver_id, value):
        """
        Check if the stored request for a solver is equal to a value

        Keyword arguments:
        - solver_id -- the unique identifier of the solver
        - value -- the value to be checked if is equal to the current request
        """
        current_request = self.get_request(solver_id)
        return self._compare(current_request, value)
