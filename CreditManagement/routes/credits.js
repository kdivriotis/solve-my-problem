import { Router } from "express";

import { authorizeUser } from "../middleware/index.js";

import { healthcheck, getCredits, addCredits } from "../controllers/index.js";

const router = Router();

router.get("/healthcheck", authorizeUser, healthcheck);

router.get("/:userId?", authorizeUser, getCredits);

router.put("/:userId?", authorizeUser, addCredits);

export default router;
