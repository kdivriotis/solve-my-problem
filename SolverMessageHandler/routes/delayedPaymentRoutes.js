// routes/delayedPaymentRoutes.js
import express from "express";

import { delayedPayment } from "../controllers/index.js";

import { authorizeUser } from "../middleware/index.js";

const router = express.Router();

router.put("/delayedpayment/:problemId", authorizeUser, delayedPayment);

export default router;
