// Create a new user for the database
db.createUser({
  user: "user",
  pwd: "password",
  roles: [
    {
      role: "readWrite",
      db: "solveMyProblem",
    },
  ],
});

// Add default user to the DB
db = db.getSiblingDB("solveMyProblem");

// Define the default user
const defaultUser = {
  _id: ObjectId("669fe46e6e6724d752149f48"),
  name: "admin",
  credits: 0.0,
};
db.createCollection("users");
db.users.insertOne(defaultUser);

// Add available models to the DB
const availableModels = [
  {
    id: "VRP",
    name: "Vehicle Routing",
    description:
      "The Vehicle Routing Problem (VRP) is a combinatorial optimization and integer programming problem that seeks the most efficient way to deliver goods to various locations using a fleet of vehicles. The objective is to minimize the total delivery cost, which can include factors such as distance traveled, time, and the number of vehicles used.",
    price: 1,
    inputs: [
      {
        name: "maxDistance",
        type: "number",
        uom: "meters (0=infinite)",
      },
      {
        name: "depot",
        type: "number",
        uom: "index of starting point",
      },
      {
        name: "vehicles",
        type: "number",
        uom: "# of vehicles",
      },
      {
        name: "locations",
        type: "array",
        uom: "{ latitude: number, longitude: number }",
      },
    ],
  },
  {
    id: "LP",
    name: "Linear Programming",
    description:
      "Linear Programming (LP) is a mathematical method for determining a way to achieve the best outcome (such as maximum profit or lowest cost) in a given mathematical model whose requirements are represented by linear relationships. It is widely used in various fields such as economics, business, engineering, and military applications.",
    price: 1,
    inputs: [
      {
        name: "constraints",
        type: "array",
        uom: "expr. <= | < | >= | > | = bound",
      },
      {
        name: "objective",
        type: "string",
        uom: "objective function expr.",
      },
      {
        name: "type",
        type: "string",
        uom: "max | min",
      },
    ],
  },
];

const modelMetadata = [
  {
    name: "Time Limit",
    description:
      "Maximum execution time (in seconds) before aborting the execution (set to 0 to ignore)",
    type: "number",
    uom: "seconds",
  },
  {
    name: "Description",
    description: "Brief description of your intended usage for this solver",
    type: "string",
    uom: "",
  },
];

db.createCollection("models");
db.createCollection("metadataTemplates");
db.createCollection("inputDataTemplates");

for (let model of availableModels) {
  const { id, name, description, price, inputs } = model;
  const insertedModel = db.models.insertOne({ id, name, description, price });

  for (let metadata of modelMetadata)
    db.metadataTemplates.insertOne({
      modelId: insertedModel.insertedId,
      ...metadata,
    });

  for (let inputData of inputs)
    db.inputDataTemplates.insertOne({
      modelId: insertedModel.insertedId,
      ...inputData,
    });
}
