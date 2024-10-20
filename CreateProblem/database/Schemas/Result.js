import mongoose from "mongoose";
import { Problem } from "./Problem.js";

const ResultSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: Problem,
      required: true,
    },
    data: {
      type: String,
      required: true,
    },
    executedOn: {
      type: Date,
      required: true,
      default: Date.now,
    },
    executionTime: {
      type: Number,
      required: true,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      required: true,
      default: false,
    },
    cost: {
      type: Number,
      required: true,
      default: 0.0,
    },
  },
  {
    collection: "results",
  }
);

export const Result = mongoose.model("Result", ResultSchema);
