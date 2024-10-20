# MICROSERVICE

## Solvers' Orchestrator Cache - Redis

The **Redis** service is a high-performance in-memory data store used as a cache and a data structure server for managing the state and coordination of the solvers in the microservices architecture.

### Purpose

The Redis key/value store is used by the Solvers' Orchestrator service, in order to keep persistent information about the status of the available solver services.

1. **Problem Buffer**:
   - **Key**: `problems_buffer`
   - **Type**: List
   - **Description**: A FIFO (First-In-First-Out) list where incoming problems are queued for processing. Problems are pushed to the end of the list and are processed from the front, ensuring they are handled in the order they were received.

2. **Solver Status**:
   - **Key**: `solver_status`
   - **Type**: Hash
   - **Description**: Stores the latest known status of each solver instance. Each key in this hash corresponds to a `solver_id` (the unique incremental ID of the solver) and the value is the ID of the problem that is currently being executed on the solver (or "" if solver is not busy)

3. **Active Requests**:
   - **Key**: `active_requests`
   - **Type**: Hash
   - **Description**: Stores the most recent problem assigned to each solver instance. Each key in this hash corresponds to an `instance_id`, and the value is a JSON string representing the problem details. This acts as an intermediate step between dequeueing a problem from the buffer and setting the solver status to the problem ID, which happens only after receiving the response from the solver.
