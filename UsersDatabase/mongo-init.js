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
const password = "$2a$10$Wwon7GgJStgiLdfU8nft0OiFgFiTHCU5jKdEmXA3ah056bqT33ImW"; // pre-hashed password "1234saas!"
const defaultUser = {
  _id: ObjectId("669fe46e6e6724d752149f48"),
  name: "admin",
  email: "admin@solvemyproblem.com",
  password,
  credits: 0.0,
  isAdmin: true,
  date: new Date(),
};
db.createCollection("users");
db.users.insertOne(defaultUser);
