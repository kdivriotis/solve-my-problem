import { Router } from "express";

import { authorizeUser } from "../middleware/index.js";

import {
  healthcheck,
  getAllProblems,
  getProblemInfo,
  deleteProblem,
} from "../controllers/index.js";

const router = Router();

router.get("/healthcheck", authorizeUser, healthcheck);

router.get("/info/:id", authorizeUser, getProblemInfo);
router.get("/:userId?", authorizeUser, getAllProblems);

router.delete("/delete/:id", authorizeUser, deleteProblem);

export default router;
