# NTUA ECE SAAS 2024 PROJECT
  
## TEAM 1
  

## Solve my Problem

**Solve my Problem** is a SaaS aimed at users who wish to solve problems with significant demands on computing resources.

The available Models can be used in order to solve various categories of problems.

### Available Models

1. **Vehicle Routing**
   
   The Vehicle Routing Problem (VRP) is a combinatorial optimization and integer programming problem that seeks the most efficient way to deliver goods to various locations using a fleet of vehicles. The objective is to minimize the total delivery cost, which can include factors such as distance traveled, time, and the number of vehicles used.

2. **Linear Programming**
   
   Linear Programming (LP) is a mathematical method for determining a way to achieve the best outcome (such as maximum profit or lowest cost) in a given mathematical model whose requirements are represented by linear relationships. It is widely used in various fields such as economics, business, engineering, and military applications.

### Configuration

#### Adjusting the Number of Solvers

The number of OR-Tools solver instances can be modified by adjusting the replicas in the `docker-compose.yaml` file. By default, there are three solver instances defined:

```yaml
# OR-Tools Microservice (Python) (3 replicas)
or-tools-1:
  <<: *or-tools-base
  container_name: or-tools-1
  environment:
    SOLVER_ID: 1
or-tools-2:
  <<: *or-tools-base
  container_name: or-tools-2
  environment:
    SOLVER_ID: 2
or-tools-3:
  <<: *or-tools-base
  container_name: or-tools-3
  environment:
    SOLVER_ID: 3
```

To change the number of available solvers, you can add or remove instances of this configuration block. For example, to add a fourth solver, you can add the following:

```yaml
or-tools-4:
  <<: *or-tools-base
  container_name: or-tools-4
  environment:
    SOLVER_ID: 4
```

Similarly, you can remove any of the existing instances to reduce the number of solvers. Each solver should have a unique `SOLVER_ID` and `container_name`.

#### Setting Up HTTPS

For HTTPS, you will need a self-signed certificate.

Detailed instructions on how to generate this certificate are available in the [Nginx directory](Nginx/README.md).

#### Authentication with Google OAuth Credentials

To enable **Google OAuth**, you need to update the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in the `.env` configuration files for the **Frontend** and **UserManagement** microservices. 

1. Navigate to the `Frontend` directory and open the `.env` file. Update the following variables with your Google OAuth credentials:

    ```ini
    GOOGLE_CLIENT_ID=your-google-client-id
    GOOGLE_CLIENT_SECRET=your-google-client-secret
    NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
    ```

2. Navigate to the `UserManagement` directory and open the `.env` file. Update the same variables with your Google OAuth credentials:

    ```ini
    GOOGLE_CLIENT_ID=your-google-client-id
    GOOGLE_CLIENT_SECRET=your-google-client-secret
    ```

You can follow [Google's guide](https://developers.google.com/identity/protocols/oauth2/web-server#creatingcred) to generate your OAuth 2.0 credentials.

Ensure that both files have the correct credentials to enable seamless Google OAuth integration.

### How to Run

To start all services using Docker Compose, simply run the following command in your terminal:

```bash
docker compose up -d
```

After all services are started, the application will be available on `https://localhost`.