from abc import ABC, abstractmethod
from typing import Tuple


class InvalidInputError(Exception):
    pass


class AbstractSolver(ABC):
    @classmethod
    @abstractmethod
    def get_id(self):
        """
        Getter - Returns the solver's ID
        """
        pass

    @classmethod
    @abstractmethod
    def get_name(self):
        """
        Getter - Returns the solver's name
        """
        pass

    @abstractmethod
    def solve(self) -> Tuple[float, dict]:
        """
        Solve the defined problem, with the solver object defined
        by the input data.

        Returns a tuple with the execution time in seconds and the result object (dict)
        """
        pass

    @abstractmethod
    def _parse_metadata(self, metadata):
        """
        Parse & validate the given metadata JSON
        """
        pass
