// routes/statsRoutes.js

import { Router } from "express";
import { getSubmissionTrends } from "../controllers/index.js";
import {authorizeUser} from "../middleware/index.js";

const router = Router();

// @route   GET /api/stats/submission-trends
// @desc    Get problem submission trends
// @access  Private
router.get("/submission-trends", authorizeUser, getSubmissionTrends);

export default router;
