# MICROSERVICE

## Solvers' Orchestrator

The **Orchestrator** service is a key component in the microservices architecture that manages the distribution and execution of problem-solving tasks across multiple solver instances, using a persistent cache storage with **Redis**. 

It acts as a coordinator between the Node.js **Solver Message Handler** service (which receives the requests to execute a problem submission) and the Python-based **OR-Tools solver** instances, ensuring efficient load balancing, task assignment, and monitoring of solver availability.

### Purpose

The Orchestrator service is responsible for:

1. **Handling Problem Execution Requests**
   - Listens to messages on the **Kafka** broker regarding problem-solving requests from the backend
2. **Manage Available Solver Instances**
   - Tracks the status of each solver instance (free/busy)
   - Keeps the last assignment request made to each solver instance in order to handle unexpected termination of the solver, preventing data loss
   - Distributes problems to the first available solver instance by publishing the problem to the corresponding Kafka topic
   - Updates instance status dynamically based on task completion notifications received via Kafka
3. **Buffering & Prioritization**
   - Maintains a FIFO Queue that holds incoming problem execution requests when all solvers are busy
   - Ensures that problems are assigned to solver instances in the order they were received when they become available
