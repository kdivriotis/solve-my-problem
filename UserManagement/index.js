const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const { listen } = require("./broker/index.js");
const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Define Routes
app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/user", require("./routes/userRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Listen to Kafka topics
const topics = ["block-user"]; // Add other topics if necessary
listen(topics);
