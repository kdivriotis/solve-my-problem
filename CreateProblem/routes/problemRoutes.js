import { Router } from "express";

import { authorizeUser } from "../middleware/index.js";

import {
  healthcheck,
  addProblem,
  uploadProblemInputData,
} from "../controllers/index.js";

import multer from "multer";

const upload = multer();

const router = Router();

router.get("/healthcheck", authorizeUser, healthcheck);

router.post(
  "/add",
  authorizeUser,
  upload.fields([
    { name: "inputData", maxCount: 1 },
    { name: "modelId", maxCount: 1 },
    { name: "name", maxCount: 1 },
    { name: "metadata", maxCount: 1 },
  ]),
  addProblem
);

router.post(
  "/upload-input/:id",
  authorizeUser,
  upload.fields([{ name: "inputData", maxCount: 1 }]),
  uploadProblemInputData
);

export default router;
