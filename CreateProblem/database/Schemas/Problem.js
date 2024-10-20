import mongoose from "mongoose";
import { User } from "./User.js";
import { Model } from "./Model.js";

export const ProblemStatus = {
  NOT_READY: 0, // No input data has been submitted yet
  READY: 1, // Problem is ready to be executed
  PENDING: 2, // Problem is waiting in queue to be executed
  RUNNING: 3, // Problem is currently being executed
  EXECUTED: 4, // Problem has been executed
};

/**
 * Transform a Problem's Status from int to String
 * @param {int} status The problem's status code (as integer)
 *
 * @returns {String} The given status code transformed to the corresponding
 */
export const problemStatusString = (status) => {
  switch (status) {
    case ProblemStatus.NOT_READY:
      return "Not Ready";
    case ProblemStatus.READY:
      return "Ready";
    case ProblemStatus.PENDING:
      return "Pending";
    case ProblemStatus.RUNNING:
      return "Running";
    case ProblemStatus.EXECUTED:
      return "Executed";
    default:
      return "Unknown";
  }
};

const ProblemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: User,
      required: true,
    },
    modelId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: Model,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    submittedOn: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: Number,
      required: true,
      enum: Object.values(ProblemStatus),
      default: ProblemStatus.NOT_READY,
    },
    executedOn: {
      type: Date,
      required: false,
    },
  },
  {
    collection: "problems",
  }
);

ProblemSchema.index({ userId: 1, name: 1 }, { unique: true });

export const Problem = mongoose.model("Problem", ProblemSchema);
