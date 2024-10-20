import mongoose from "mongoose";
import { Problem, ProblemStatus, InputData } from "../../database/index.js";

/**
 * Message received from broker: Response from a solver about problem execution
 *
 * Either notification about error on a problem's input data,
 * or about problem's execution status.
 *
 * @param {string} id The unique ID of the problem
 * @param {string? | undefined} error If defined, describes the error that occured on submission's input data
 */
export const problemExecutionResponse = async (id, error) => {
  try {
    // Validate inputs
    if (!id || id === "") return;

    // Get submission's ID from request
    const problemId = mongoose.Types.ObjectId.createFromHexString(id);

    // Find the problem in the database
    const problem = await Problem.findById(problemId);
    if (!problem) {
      console.error(`Problem with ID ${problemId} not found`);
      return;
    }

    // Problem response has an error
    if (error) {
      // Update input data "error" field
      const inputData = await InputData.findOne({ problemId });
      if (!inputData) {
        console.error(`No input data found for problem with ID ${problemId}`);
        return;
      }
      inputData.error = error;
      await inputData.save();

      // Update problem status to NOT_READY
      problem.status = ProblemStatus.NOT_READY;
      await problem.save();
      console.error(`Problem with ID ${problemId} failed: ${error}`);

      return;
    }

    // No error: Update the problem's status to RUNNING
    problem.status = ProblemStatus.RUNNING;
    await problem.save();
    console.log(`Problem with ID ${problemId} is now RUNNING`);
  } catch (e) {
    console.error(`Failed to process solver response for ${id}: ${e}`);
  }
};
