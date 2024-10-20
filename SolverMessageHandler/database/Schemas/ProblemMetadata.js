import mongoose from "mongoose";
import { Problem } from "./Problem.js";
import { MetadataTemplate } from "./MetadataTemplate.js";

const ProblemMetadataSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: Problem,
      required: true,
    },
    metadataId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: MetadataTemplate,
      required: true,
    },
    value: {
      type: mongoose.SchemaTypes.Mixed,
      required: true,
    },
  },
  {
    collection: "problemsMetadata",
  }
);

ProblemMetadataSchema.index({ problemId: 1, metadataId: 1 }, { unique: true });

export const ProblemMetadata = mongoose.model(
  "ProblemMetadata",
  ProblemMetadataSchema
);
