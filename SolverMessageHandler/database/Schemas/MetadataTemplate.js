import mongoose from "mongoose";
import { Model } from "./Model.js";

const MetadataTemplateSchema = new mongoose.Schema(
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
    description: {
      type: String,
      required: true,
      default: "",
    },
    type: {
      type: String,
      required: true,
      enum: ["number", "string"],
    },
    uom: {
      type: String,
      required: true,
    },
  },
  {
    collection: "metadataTemplates",
  }
);

MetadataTemplateSchema.index({ modelId: 1, name: 1 }, { unique: true });

export const MetadataTemplate = mongoose.model(
  "MetadataTemplate",
  MetadataTemplateSchema
);
