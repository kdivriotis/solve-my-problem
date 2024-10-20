import { Router } from "express";

import { authorizeUser } from "../middleware/index.js";

import { healthcheck, getTransactions } from "../controllers/index.js";

const router = Router();

router.get("/healthcheck", authorizeUser, healthcheck);

router.get("/:userId?", authorizeUser, getTransactions);

export default router;
