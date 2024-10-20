// routes/sendProblemRoutes.js
import express from "express";

import { authorizeUser } from "../middleware/index.js";

import {
  healthcheck,
  sendProblemToSolver,
  getProblemResults,
} from "../controllers/index.js";

const router = express.Router();

router.get("/healthcheck", authorizeUser, healthcheck);

router.get("/results/:id", authorizeUser, getProblemResults);

router.post("/:problemId", authorizeUser, sendProblemToSolver);

export default router;
