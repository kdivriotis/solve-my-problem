import { Router } from "express";

import { authorizeUser } from "../middleware/index.js";

import { healthcheck, getModels, getModelInfo } from "../controllers/index.js";

const router = Router();

router.get("/healthcheck", authorizeUser, healthcheck);

router.get("/:id", getModelInfo);
router.get("/", getModels);

export default router;
