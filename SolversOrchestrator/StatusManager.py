import redis


class StatusManager:
    """
    Manages the status of available solvers
    """

    def __init__(self, name, host, port, compare=lambda x, y: x == y):
        """
        Keyword arguments:
        - name -- the name of the buffer
        - host -- host name or IP of Redis
        - port -- connection port of Redis
        - compare -- function to be used when comparing a value to an entry - returns True if equal otherwise false,
        e.g. lambda entry, value : entry["id"] == value
        """
        self._name = name
        self._compare = compare

        # Initialize Redis connection
        self._redis = redis.Redis(host=host, port=port, decode_responses=True)

    def update_status(self, solver_id, status):
        """
        Update the status of a solver

        Keyword arguments:
        - solver_id -- the unique identifier of the solver
        - status -- new status value to be updated
        """
        self._redis.hset(self._name, solver_id, status)

    def get_status(self, solver_id):
        """
        Get the current status of a solver

        Keyword arguments:
        - solver_id -- the unique identifier of the solver
        """
        return self._redis.hget(self._name, solver_id)

    def get_solvers(self):
        """
        Get all solvers along with their status
        """
        return self._redis.hgetall(self._name)

    def is_equal(self, solver_id, value):
        """
        Check if the stored status for a solver is equal to a value

        Keyword arguments:
        - solver_id -- the unique identifier of the solver
        - value -- the value to be checked if is equal to the current status
        """
        current_status = self.get_status(solver_id)
        return self._compare(current_status, value)
