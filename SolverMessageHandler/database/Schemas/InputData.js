import mongoose from "mongoose";
import { Problem } from "./Problem.js";

const InputDataSchema = new mongoose.Schema(
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
    submittedOn: {
      type: Date,
      required: true,
      default: Date.now,
    },
    // If there is an error after parsing the input from the solver, it will be written here to inform the user
    error: {
      type: String,
      default: null,
    },
  },
  {
    collection: "inputData",
  }
);

InputDataSchema.index({ problemId: 1, fileName: 1 }, { unique: true });

export const InputData = mongoose.model("InputData", InputDataSchema);
