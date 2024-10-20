import mongoose from "mongoose";
import { InputData } from "../../database/index.js";

/**
 * Message received from broker: Problem submission was deleted
 *
 * Delete the input data for the deleted problem
 *
 * @param {string} id The unique ID of the problem that was deleted
 */
export const deleteProblemInputData = async (id) => {
  try {
    // Validate inputs
    if (!id || id === "") return;

    // Get submission's ID from request
    const problemId = mongoose.Types.ObjectId.createFromHexString(id);

    await InputData.deleteMany({ problemId });
  } catch (e) {
    console.error(`Error when deleting InputData for ${id}: ${e}`);
  }
};
