# MICROSERVICE

## Kafka Broker

The Kafka Broker is a critical component in the microservices architecture, serving as both the communication backbone and the **Choreographer** for the entire system. 

As a distributed messaging system, Kafka enables reliable, high-throughput and low-latency communication between producers (services that send messages) and consumers (services that receive and process messages), ensuring that the various microservices operate in a coordinated and decoupled manner.

### Purpose

The Kafka Broker is used for:

1. **Message Queuing**:
   - Facilitates the decoupling of microservices by allowing them to communicate asynchronously through topics
   - Handles message storage, ensuring that messages are delivered even if the consumers are temporarily unavailable
2. **Choreography**:
   - Acts as the Choreographer for the microservices, coordinating the interactions between services by defining the flow of communication through topics
   - Manages the orchestration of tasks without requiring a central controller, allowing services to respond to events as they occur
3. **Topic Management**
   - Organizes messages into topics, allowing services to subscribe to specific topics based on their needs
4. **Reliable Communication**
   - Εnsures that messages are delivered in a reliable manner, with options for at-least-once or exactly-once delivery semantics

### Topics

The topics that are used by the connected services are:

- `user-created` : a new user has been created, or a deleted account has been restored
- `user-deleted` : a user's account has been deleted
- `block-user` : user's account needs to be blocked due to unpaid problem executions (or unblocked after payment)
- `credits-changed` : user's credit balance has been changed
- `credits-charge-user` : user's account has to be charged credits (for problem execution fees)
- `transaction-created` : a new transaction has been created (either user added credits or was charged credits)
- `problem-deleted` : a problem submission has been deleted
- `problem-execute-req` : problem execution request towards the solvers' orchestrator
- `problem-execute-req-1` : problem execution request towards the solver instance 1
- ...
- `problem-execute-req-X` : problem execution request towards the solver instance X
- `problem-execute-res` : response from solver about problem execution (status)
- `problem-execute-resend` : request to resend a problem's info (after a problem was unexpectedly discarded from a solver)
- `problem-result` : result is ready from solver (execution finished)
