# CONTAINER

## MongoDB Container for Problems Database

The **Problems Database** is a `MongoDB instance` that stores all user-submitted problems. 

Each problem includes basic info such as the user ID, model ID, submission date, and status, as well as model-dependent metadata & input data. 

This database is crucial for managing and retrieving problem data for processing by the OR-Tools solvers.

### Collections

- models
- metadataTemplates
- inputDataTemplates
- users
- problems
- problemsMetadata
- inputData
- results

### Related Services

- Model Management
- Display Problem
- Create Problem
- Solver Message Handler
