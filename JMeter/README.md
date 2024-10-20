# Stress Test

Stress test for **Solve my Problem** SaaS.

*Developed using `Apache JMeter Version 5.6.3`*

## How it works

The stress test emulates the concurrent usage of many users interacting with all the microservices, with heavy load on the problem creation & execution process, in order to test the throughput of the entire application.

Each user executes the following sequence:

1. Register (create account)
2. Login
3. Get profile info
4. Get available models
5. Add credits to the account
6. Get credits balance
7. Loop:
    - Select one of the available models
    - Select one of the available inputs for the selected model
    - Create a new problem submission
    - Get created submission's info
    - Execute the problem
8. Get transactions history

## Configuration

The following parameters (*User Defined Variables*) can be altered in order to change the load of the test:

- **NUMBER_OF_USERS** : number of concurrent users that will execute the sequence
- **SUBMISSIONS_PER_USER** : number of submissions that each user will create & execute (loop limit)
- **nameX, inputX, metadataX, modelX** : submission name, input data file name, metadata and model - one of the possible options will be randomly selected on each iteration (based on the randomly selected model)
