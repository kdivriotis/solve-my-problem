import mongoose from "mongoose";
import { Model } from "../database/index.js";

/**
 * Get all available models.
 *
 * @returns Array with available models' basic info - id, name, description
 */
export const getModels = async (req, res) => {
  try {
    // Get all models from DB in alphabetical order
    const models = await Model.find()
      .select("id name description")
      .sort({ name: 1 });
    const response = { models };

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: `Something went wrong. Please try again later. (${e})`,
    });
  }
};
