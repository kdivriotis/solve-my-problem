import mongoose from "mongoose";
import { Model } from "./Model.js";

const InputDataTemplateSchema = new mongoose.Schema(
  {
    modelId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: Model,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["number", "string", "array"],
    },
    uom: {
      type: String,
      required: true,
    },
  },
  {
    collection: "inputDataTemplates",
  }
);

InputDataTemplateSchema.index({ modelId: 1, name: 1 }, { unique: true });

export const InputDataTemplate = mongoose.model(
  "InputDataTemplate",
  InputDataTemplateSchema
);
