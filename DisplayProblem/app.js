import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

import { connect as connectToDB } from "./database/index.js";
import { listen as listenToEvents } from "./broker/listen.js";
import { problemRouter, statsRouter  } from "./routes/index.js";

dotenv.config();

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Connect to MongoDB
let dbConnectionOk = await connectToDB();
console.log(`Connection to DB: ${dbConnectionOk ? "OK" : "Failed"}`);

// Create a listener on the broker
const topics = ["user-created", "user-deleted", "credits-changed"];
listenToEvents(topics);

// Public API Routes
app.use("/api", problemRouter);
app.use("/api/stats", statsRouter);

// Not found
app.use((req, res, next) => {
  const error = new Error("not found");
  return res.status(404).json({
    message: error.message,
  });
});

app.listen(port, () =>
  console.log(`[server]: Server is running at http://localhost:${port}`)
);
