# MICROSERVICE

## OR-Tools

**OR-Tools** is a `Python`-based container running the OR-Tools library developed by Google. 

### Purpose

This container is responsible for solving the computational problems submitted by users.

New problem execution requests are received asynchronously, through the **Kafka Broker**.

### Available Solvers

The available solvers offer solutions for the following problem categories:

1. **Vehicle Routing**
   
   The Vehicle Routing Problem (VRP) is a combinatorial optimization and integer programming problem that seeks the most efficient way to deliver goods to various locations using a fleet of vehicles. The objective is to minimize the total delivery cost, which can include factors such as distance traveled, time, and the number of vehicles used.

2. **Linear Programming**
   
   Linear Programming (LP) is a mathematical method for determining a way to achieve the best outcome (such as maximum profit or lowest cost) in a given mathematical model whose requirements are represented by linear relationships. It is widely used in various fields such as economics, business, engineering, and military applications.