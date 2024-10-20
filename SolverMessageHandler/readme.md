# MICROSERVICE

## Solver Message Handler

The **Solver Message Handler** is a `Node.js` backend service that manages communication with the *Solvers' Orchestrator* and the *OR-Tools* services. 

### Purpose

The Solver Message Handler service is responsible for:

1. **Managing problem execution requests**
2. **Assigning problem executions to the solvers (through the solvers' orchestrator)**
3. **Listening to events from the solvers and updating the problem's status accordingly**
4. **Saving the results of finished problem executions to the database**
5. **Provide the results to authenticated users**
6. **Blocking users with unpaid problem executions**
7. **Locking results until their pending dues are cleared**
8. **Handling delayed payments for problem executions and unlocking the corresponding results**