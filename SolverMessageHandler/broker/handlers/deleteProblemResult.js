import mongoose from "mongoose";
import { Result } from "../../database/index.js";

/**
 * Message received from broker: Problem submission was deleted
 *
 * Delete the results for the deleted problem
 *
 * @param {string} id The unique ID of the problem that was deleted
 */
export const deleteProblem = async (id) => {
  try {
    // Validate inputs
    if (!id || id === "") return;

    // Get submission's ID from request
    const problemId = mongoose.Types.ObjectId.createFromHexString(id);

    await Result.deleteMany({ problemId });
  } catch (e) {
    console.error(`Error when deleting Result for ${id}: ${e}`);
  }
};
