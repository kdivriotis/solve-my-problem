from os import path
import json
import re
from enum import Enum
from typing import Tuple

from ortools.linear_solver import pywraplp

from AbstractSolver import AbstractSolver, InvalidInputError


class ObjectiveType(Enum):
    MAXIMIZE = "maximize"
    MINIMIZE = "minimize"

    @classmethod
    def from_string(cls, value):
        # Define mappings for different string representations
        value_map = {
            "maximize": cls.MAXIMIZE,
            "max": cls.MAXIMIZE,
            "min": cls.MINIMIZE,
            "minimize": cls.MINIMIZE,
        }

        # Normalize the input value
        normalized_value = value.lower().strip()

        if normalized_value in value_map:
            return value_map[normalized_value]
        else:
            raise ValueError(f"Invalid value: {value}")


class LPSolver(AbstractSolver):
    """
    Implementation of a Linear Programming solver
    using Google's OR-Tools, with GLOP (Google Linear Optimization Package)
    """

    def __init__(self, metadata: str, input_data: str):
        """
        Creates a new Linear Programming Solver.

        Raises InvalidInputExpression in case of non-existent or invalid metadata or input data

        Keyword arguments:
        - metadata -- solver's metadata in JSON format, which contains 'Description' & 'Time Limit' (in seconds)
        - input_data -- input in JSON format, which contains the problem's objective function,
        the objective's type (maximize/minimize) and the constraints to be taken under consideration
        for the given problem description
        """
        self._setup(metadata, input_data)

    @classmethod
    def get_id(self) -> str:
        """
        Getter - Returns the solver's ID
        """
        return "LP"

    @classmethod
    def get_name(self) -> str:
        """
        Getter - Returns the solver's name
        """
        return "Linear Programming"

    def solve(self, max_time_limit: int = 0) -> Tuple[float, dict]:
        """
        Solve the defined problem, with the solver object defined
        by the input data.

        Returns a tuple with the execution time in seconds and the result object (dict)

        Keyword arguments:
        - max_time_limit -- maximum time limit in seconds for the solver's execution before aborting (default = 0)
        """
        if not self._solver:
            raise InvalidInputError("Something went wrong, please try again later")

        # Adjust according to maximum time limit
        if max_time_limit > 0:
            if self._time_limit == 0:
                self._time_limit = max_time_limit
            else:
                self._time_limit = min(max_time_limit, self._time_limit)

        # Solve the problem
        if self._time_limit > 0:
            self._solver.SetTimeLimit(self._time_limit * 1000)
        status = self._solver.Solve()

        # Return the execution time & results
        try:
            self._execution_time = self._solver.WallTime() / 1000.0
        except:
            self._execution_time = 0.0

        if status == pywraplp.Solver.OPTIMAL:
            self._solution = {
                "objective": self._solver.Objective().Value(),
            }
            for name, value in self._variables.items():
                self._solution[name] = value.solution_value()
        else:
            self._solution = {
                "objective": "No solution found for the provided parameters"
            }

        return self._execution_time, self._solution

    def _setup(self, metadata: str, input_data):
        """
        Sets up the solver, by defining the GLOP solver, setting
        the appropriate variables, objective function and constraints.

        The defined solver is saved in class-wide _solver variable.

        Raises InvalidInputExpression in case of non-existent or invalid input data

        Keyword arguments:
        - metadata -- solver's metadata in JSON format, which contains 'Description' & 'Time Limit' (in seconds)
        - input_data -- input in JSON format, which contains the problem's objective function,
        the objective's type (maximize/minimize) and the constraints to be taken under consideration
        for the given problem description
        """
        # Define the solver
        solver = pywraplp.Solver.CreateSolver("GLOP")
        if not solver:
            raise InvalidInputError(f"Something went wrong, please try again later")
        self._solver = solver

        # Load the metadata from JSON
        self._parse_metadata(metadata)

        # Try to load the data from the JSON input
        try:
            input = json.loads(input_data)
        except Exception as e:
            raise InvalidInputError("Invalid JSON formatting on given input data")

        # Create variables
        self._variables = {}
        objective_coeffs = self._parse_expression(input["objective"])

        # Add constraints
        self._add_constraints(input["constraints"])

        # Set objective
        objective = self._solver.Objective()

        try:
            objective_type = ObjectiveType.from_string(input["type"])
        except Exception as e:
            raise InvalidInputError(
                f"Invalid value {input['type']} for objective's type - Allowed values are 'maximize' or 'minimize'"
            )

        for var_name, coeff in objective_coeffs.items():
            objective.SetCoefficient(self._variables[var_name], coeff)

        if objective_type == ObjectiveType.MAXIMIZE:
            objective.SetMaximization()
        else:
            objective.SetMinimization()

    def _parse_metadata(self, metadata):
        """
        Parse & validate the given metadata JSON
        """
        # Try to load the data from the JSON input
        try:
            metadata = json.loads(metadata)
        except Exception as e:
            raise InvalidInputError("Invalid JSON formatting on given metadata")

        if "Description" not in metadata:
            raise InvalidInputError("Description metadata is missing")
        self._description = metadata["Description"]

        if "Time Limit" not in metadata:
            raise InvalidInputError("Time Limit metadata is missing")
        try:
            self._time_limit = int(metadata["Time Limit"])
            if self._time_limit < 0:
                raise InvalidInputError(
                    f"Invalid value {self._time_limit} for Time Limit metadata (provide a non-negative integer)"
                )
        except:
            raise InvalidInputError(
                f"Invalid value {metadata['Time Limit']} for Time Limit metadata (provide a non-negative integer)"
            )

    def _parse_expression(self, expression):
        """
        Parse the given expression & return the parsed terms
        as an object with keys the variable names and values
        the corresponding coefficients.

        Raises InvalidInputExpression in case of unknown variable
        or invalid (non-float) coefficient

        Keyword arguments:
        - expression -- the expression to be parsed
        """
        terms = re.findall(
            r"(\s*[+-]?)(\s*\d*\.?\d*)?\s*\*?\s*([A-Za-z_]\w*)", expression
        )
        parsed_terms = {}
        for sign, coeff, var in terms:
            try:
                coeff = float(coeff.replace(" ", "")) if coeff.strip() else 1.0
                sign = sign.replace(" ", "") if sign.strip() else "+"
                if sign == "-":
                    coeff = -coeff
            except:
                raise InvalidInputError(
                    f"Invalid coefficient '{coeff}' for variable '{var}' in expression '{expression}"
                )
            if var in self._variables:
                parsed_terms[var] = coeff
            else:
                self._variables[var] = self._solver.NumVar(
                    -self._solver.infinity(), self._solver.infinity(), var
                )
                parsed_terms[var] = coeff

        return parsed_terms

    def _parse_constraint(self, constraint):
        """
        Parse the given constraint that should be in format:
        expression "symbol" bound, where:
        - expression = float * var + float * var + ...
        - symbol = <= | < | >= | > | =
        - bound = float

        Returns the expression, comparison symbol & bound

        Raises InvalidInputExpression in case of erroneous constraint

        Keyword arguments:
        - constraint -- the constraint to be parsed
        """
        expr, symbol, bound = None, None, None

        # Check if the comparison symbol is valid (<=, <, >=, >, =)
        if "<=" in constraint:
            expr, bound = constraint.split("<=")
            symbol = "<="
        elif "<" in constraint:
            expr, bound = constraint.split("<")
            symbol = "<"
        elif ">=" in constraint:
            expr, bound = constraint.split(">=")
            symbol = ">="
        elif ">" in constraint:
            expr, bound = constraint.split(">")
            symbol = ">"
        elif "=" in constraint:
            expr, bound = constraint.split("=")
            symbol = "="
        else:
            raise InvalidInputError(
                f"Invalid or no comparison symbol (<=, <, >=, >, =) found in constraint '{constraint}'"
            )

        # Check if the expressions & bounds are valid
        if (
            "<=" in expr
            or "<=" in bound
            or "<" in expr
            or "<" in bound
            or ">=" in expr
            or ">=" in bound
            or ">" in expr
            or ">" in bound
            or "=" in expr
            or "=" in bound
        ):
            raise InvalidInputError(f"Invalid constraint '{constraint}'")

        try:
            bound = float(bound.strip())
        except:
            raise InvalidInputError(f"Invalid constraint '{constraint}'")

        expr_coeffs = self._parse_expression(expr)
        expression = sum(
            float(coeff) * self._variables[name] for name, coeff in expr_coeffs.items()
        )

        return (expression, symbol, bound)

    def _add_constraints(self, constraints):
        """
        Add all given constraints to the solver

        Raises InvalidInputExpression in case of erroneous constraint

        Keyword arguments:
        - constraints -- the list of constraints to be added
        """
        for constraint in constraints:
            expression, symbol, bound = self._parse_constraint(constraint)

            if symbol == "<=":
                self._solver.Add(expression <= bound)
            elif symbol == "<":
                self._solver.Add(expression < bound)
            elif symbol == ">=":
                self._solver.Add(expression >= bound)
            elif symbol == ">":
                self._solver.Add(expression > bound)
            elif symbol == "=":
                self._solver.Add(expression == bound)
            else:
                raise InvalidInputError(f"Invalid constraint '{constraint}'")


if __name__ == "__main__":
    metadata_file = path.join("sample-data", "metadata.json")
    input_file = path.join("sample-data", "LP-maximize_problem01.json")
    # input_file = path.join("sample-data", "LP-maximize_problem02.json")
    # input_file = path.join("sample-data", "LP-minimize_problem01.json")

    # Check if the metadata file exists
    if not path.exists(metadata_file):
        raise InvalidInputError(f"No access to file '{metadata_file}'")

    # Check if the input file exists
    if not path.exists(input_file):
        raise InvalidInputError(f"No access to file '{input_file}'")

    try:
        with open(metadata_file, "r") as json_metadata, open(
            input_file, "r"
        ) as json_input_data:
            metadata = json_metadata.read()
            input_data = json_input_data.read()
            solver = LPSolver(metadata, input_data)
            execution_time, result = solver.solve()
            print(f"Executed in {execution_time} seconds\nResult:")
            print(result)
    except Exception as e:
        print(f"Error occured: {str(e)}")
