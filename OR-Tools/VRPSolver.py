from os import path
import sys
import json
from typing import Tuple

from math import radians, sin, cos, sqrt, atan2

from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp

from AbstractSolver import AbstractSolver, InvalidInputError


class VRPSolver(AbstractSolver):
    """
    Implementation of a Vehicle Routing Problem solver
    using Google's OR-Tools
    """

    def __init__(self, metadata: str, input_data: str):
        """
        Creates a new Vehicle Routing Problem Solver.

        Raises InvalidInputExpression in case of non-existent or invalid input data

        Keyword arguments:
        - metadata -- solver's metadata in JSON format, which contains 'Description' & 'Time Limit' (in seconds)
        - input_data -- input in JSON format, which contains the problem's number of vehicles,
        depot, maximum distance and locations
        """
        self._setup(metadata, input_data)

    @classmethod
    def get_id(self) -> str:
        """
        Getter - Returns the solver's ID
        """
        return "VRP"

    @classmethod
    def get_name(self) -> str:
        """
        Getter - Returns the solver's name
        """
        return "Vehicle Routing Problem"

    def solve(self, max_time_limit: int = 0) -> Tuple[float, dict]:
        """
        Solve the defined problem, with the solver object defined
        by the input data.

        Returns a tuple with the execution time in seconds and the result object (dict)

        Keyword arguments:
        - max_time_limit -- maximum time limit in seconds for the solver's execution before aborting (default = 0)
        """
        if not self._routing:
            raise InvalidInputError("Something went wrong, please try again later")

        # Adjust according to maximum time limit
        if max_time_limit > 0:
            if self._time_limit == 0:
                self._time_limit = max_time_limit
            else:
                self._time_limit = min(max_time_limit, self._time_limit)

        # Setting first solution heuristic.
        search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        search_parameters.first_solution_strategy = (
            routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
        )
        if self._time_limit > 0:
            search_parameters.time_limit.seconds = self._time_limit

        # Solve the problem.
        solution = self._routing.SolveWithParameters(search_parameters)

        # Return the execution time & results
        try:
            self._execution_time = self._routing.solver().WallTime() / 1000.0
        except:
            self._execution_time = 0.0

        if solution:
            self._solution = {
                "objective": solution.ObjectiveValue(),
            }
            max_route_distance = 0
            routes = []
            for vehicle_id in range(self._vehicles):
                index = self._routing.Start(vehicle_id)
                vehicleRoute = {
                    "vehicle": vehicle_id + 1,
                    "distance": 0.0,
                    "locations": [],
                }

                route_distance = 0
                while not self._routing.IsEnd(index):
                    vehicleRoute["locations"].append(self._manager.IndexToNode(index))
                    previous_index = index
                    index = solution.Value(self._routing.NextVar(index))
                    route_distance += self._routing.GetArcCostForVehicle(
                        previous_index, index, vehicle_id
                    )
                vehicleRoute["locations"].append(self._manager.IndexToNode(index))

                max_route_distance = max(route_distance, max_route_distance)
                vehicleRoute["distance"] = route_distance

                routes.append(vehicleRoute)

            self._solution["maxDistance"] = max_route_distance
            self._solution["routes"] = routes
        else:
            self._solution = {
                "objective": "No solution found for the provided parameters"
            }

        return self._execution_time, self._solution

    def _setup(self, metadata: str, input_data):
        """
        Sets up the solver, by defining the routing model solver, setting
        the appropriate variables, vehicles and locations.

        The defined solver is saved in class-wide _routing variable.

        Raises InvalidInputExpression in case of non-existent or invalid input data

        Keyword arguments:
        - metadata -- solver's metadata in JSON format, which contains 'Description' & 'Time Limit' (in seconds)
        - input_data -- input in JSON format, which contains the problem's number of vehicles,
        depot, maximum distance and locations
        """
        # Try to load the data from the JSON input
        try:
            input = json.loads(input_data)
        except Exception as e:
            raise InvalidInputError("Invalid JSON formatting on given input data")

        # Load the metadata from JSON
        self._parse_metadata(metadata)

        # Read & Validate parameters from input
        if "locations" not in input:
            raise InvalidInputError("Locations array ('locations') is missing")
        self._get_locations(input["locations"])

        if "vehicles" not in input:
            raise InvalidInputError(
                "Number of vehicles parameter ('vehicles') is missing"
            )
        self._get_number_of_vehicles(input["vehicles"])

        if "depot" not in input:
            raise InvalidInputError("Index of depot parameter ('depot') is missing")
        self._get_depot(input["depot"])

        if "maxDistance" not in input:
            raise InvalidInputError(
                "Maximum distance parameter ('maxDistance') is missing"
            )
        self._get_max_distance(input["maxDistance"])

        # Calculate distance matrix based on read locations
        self._calculate_distance_matrix()

        # Create the routing index manager.
        self._manager = pywrapcp.RoutingIndexManager(
            len(self._distance_matrix), self._vehicles, self._depot
        )

        # Create Routing Model.
        routing = pywrapcp.RoutingModel(self._manager)

        # Create and register a transit callback.
        def distance_callback(from_index, to_index):
            """Returns the distance between the two nodes."""
            # Convert from routing variable Index to distance matrix NodeIndex.
            from_node = self._manager.IndexToNode(from_index)
            to_node = self._manager.IndexToNode(to_index)
            return self._distance_matrix[from_node][to_node]

        transit_callback_index = routing.RegisterTransitCallback(distance_callback)

        # Define cost of each arc.
        routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

        # Add Distance constraint. (if given value is set to 0, set to infinite)
        max_distance = self._max_distance
        if self._max_distance == 0:
            max_distance = sys.maxsize

        dimension_name = "Distance"
        routing.AddDimension(
            transit_callback_index,
            0,  # no slack
            max_distance,  # vehicle maximum travel distance
            True,  # start cumul to zero
            dimension_name,
        )
        distance_dimension = routing.GetDimensionOrDie(dimension_name)
        distance_dimension.SetGlobalSpanCostCoefficient(100)

        self._routing = routing

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

    def _get_locations(self, locations):
        """
        Parse and validate the given array of locations

        Raises InvalidInputExpression in case of missing
        or invalid locations array

        Keyword arguments:
        - locations -- the array specified for locations
        """
        if locations is None:
            raise InvalidInputError("Locations array ('locations') is missing")

        if not isinstance(locations, list):
            raise InvalidInputError("'locations' should be a list")

        self._locations = []

        for index, location in enumerate(locations):
            # Check that each value of the array is a dict with 'latitude' & 'longitude' as keys
            if not isinstance(location, dict):
                raise InvalidInputError(f"Location at index {index} is not an object")

            if "latitude" not in location or "longitude" not in location:
                raise InvalidInputError(
                    f"Location at index {index} should have 'latitude' and 'longitude'"
                )

            # Check that latitude & longitude are both number - save as floats
            latitude = location["latitude"]
            longitude = location["longitude"]

            if not isinstance(latitude, (int, float)):
                raise InvalidInputError(f"Latitude at index {index} should be a number")

            if not isinstance(longitude, (int, float)):
                raise InvalidInputError(
                    f"Longitude at index {index} should be a number"
                )
            self._locations.append((float(latitude), float(longitude)))

    def _get_number_of_vehicles(self, vehicles):
        """
        Parse and validate the given number of vehicles.

        Raises InvalidInputExpression in case of missing
        or invalid (non-positive or non-number) number

        Keyword arguments:
        - vehicles -- the value specified for number of vehicles
        """
        if vehicles is None:
            raise InvalidInputError(
                "Number of vehicles parameter ('vehicles') is missing"
            )

        try:
            vehicles = int(vehicles)
        except Exception as e:
            raise InvalidInputError(
                f"Invalid value {vehicles} for parameter 'vehicles'"
            )

        if vehicles <= 0:
            raise InvalidInputError(
                f"Parameter 'vehicles' has to be a positive integer ({vehicles})"
            )

        self._vehicles = vehicles

    def _get_depot(self, depot):
        """
        Parse and validate the given index of depot.

        Raises InvalidInputExpression in case of missing
        or invalid (non-positive, non-number or larger than available locations) number

        Keyword arguments:
        - depot -- the value specified for index of depot
        """
        if depot is None:
            raise InvalidInputError("Index of depot parameter ('depot') is missing")

        try:
            depot = int(depot)
        except Exception as e:
            raise InvalidInputError(f"Invalid value {depot} for parameter 'depot'")

        if depot < 0:
            raise InvalidInputError(
                f"Parameter 'depot' has to be a non-negative integer ({depot})"
            )

        locations_length = len(self._locations)
        if depot >= locations_length:
            raise InvalidInputError(
                f"Parameter 'depot' has to be a valid index of the 'locations' array [0,{locations_length}) (provided value {depot})"
            )

        self._depot = depot

    def _get_max_distance(self, max_distance):
        """
        Parse and validate the given value for maximum distance (in meters).

        Raises InvalidInputExpression in case of missing
        or invalid (negative or non-number) value

        Keyword arguments:
        - max_distance -- the value specified for maximum distance
        """
        if max_distance is None:
            raise InvalidInputError(
                "Maximum distance parameter ('maxDistance') is missing"
            )

        try:
            max_distance = int(max_distance)
        except Exception as e:
            raise InvalidInputError(
                f"Invalid value {max_distance} for parameter 'maxDistance'"
            )

        if max_distance < 0:
            raise InvalidInputError(
                f"Parameter 'maxDistance' has to be a non-negative integer ({max_distance})"
            )

        self._max_distance = int(max_distance)

    def _haversine_distance(self, lat1, lon1, lat2, lon2):
        """
        Calculate the great-circle distance between two points on the Earth's surface.

        Keyword arguments:
        - lat1 -- latitude of the first point
        - lon1 -- longitude of the first point
        - lat2 -- latitude of the second point
        - lon2 -- longitude of the second point
        """
        # Convert latitude and longitude from degrees to radians
        lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])

        # Haversine formula
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
        c = 2 * atan2(sqrt(a), sqrt(1 - a))
        distance = 6371 * c  # Earth radius in kilometers
        return int(round(1000 * distance))

    def _calculate_distance_matrix(self):
        """
        Calculate distance matrix between all defined locations,
        based on Manhattan distance.
        """
        num_locations = len(self._locations)
        distance_matrix = [[0] * num_locations for _ in range(num_locations)]

        for i in range(num_locations):
            for j in range(num_locations):
                lat1, lon1 = self._locations[i]
                lat2, lon2 = self._locations[j]

                distance_matrix[i][j] = self._haversine_distance(lat1, lon1, lat2, lon2)
        self._distance_matrix = distance_matrix


if __name__ == "__main__":
    metadata_file = path.join("sample-data", "metadata.json")
    # input_file = path.join("sample-data", "VRP-locations_20.json")
    # input_file = path.join("sample-data", "VRP-locations_200.json")
    input_file = path.join("sample-data", "VRP-locations_1000.json")

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
            solver = VRPSolver(metadata, input_data)
            execution_time, result = solver.solve()
            print(f"Executed in {execution_time} seconds\nResult:")
            print(result)
    except Exception as e:
        print(f"Error occured: {str(e)}")
