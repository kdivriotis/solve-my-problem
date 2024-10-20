import mongoose from "mongoose";
import {
  Model,
  MetadataTemplate,
  InputDataTemplate,
} from "../database/index.js";

/**
 * Get detailed info for a model based on its ID.
 *
 * Name, Description, Price, Metadata Template, Input Data Template
 *
 * @param {string} req.params.id Model's unique ID
 * @returns Model's detailed info
 */
export const getModelInfo = async (req, res) => {
  try {
    // Validate inputs
    if (!req.params.id || req.params.id === "") {
      return res.status(400).json({ message: "No model ID was selected" });
    }

    // Get model's info from DB
    const modelId = mongoose.Types.ObjectId.createFromHexString(req.params.id);
    const model = await Model.findById(modelId).select(
      "id name description price"
    );
    if (!model)
      return res
        .status(404)
        .json({ message: "The requested model does not exist" });

    // Metadata Template
    let metadata = await MetadataTemplate.find({ modelId }).select(
      "name description type uom"
    );
    if (!metadata) metadata = [];
    metadata = metadata.map((m) => {
      return {
        name: m.name,
        description: m.description,
        type: m.type,
        uom: m.uom,
      };
    });

    // Input Data Template
    let inputData = await InputDataTemplate.find({ modelId }).select(
      "name type uom"
    );
    if (!inputData) inputData = [];
    inputData = inputData.map((i) => {
      return {
        name: i.name,
        type: i.type,
        uom: i.uom,
      };
    });

    const response = {
      id: model.id,
      name: model.name,
      description: model.description,
      price: model.price,
      metadata,
      inputData,
    };

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: `Something went wrong. Please try again later. (${e})`,
    });
  }
};
