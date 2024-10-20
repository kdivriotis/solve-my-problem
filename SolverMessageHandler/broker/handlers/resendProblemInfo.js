import mongoose from "mongoose";

import {
  Problem,
  ProblemStatus,
  ProblemMetadata,
  InputData,
} from "../../database/index.js";
import { sendMessage } from "../sendMessage.js";

/**
 * Message received from broker: Request to resend problem info
 *
 * Check if the problem exists and is not already executed
 *
 * @param {string} id The unique ID of the problem that data was requested for
 */
export const resendProblemInfo = async (id) => {
  try {
    // Validate inputs
    if (!id || id === "") return;

    // Get submission's ID from request
    const problemId = mongoose.Types.ObjectId.createFromHexString(id);

    // Find the problem in the database
    const problem = await Problem.findById(problemId).populate("modelId");
    if (!problem) {
      console.error(`Problem with ID ${problemId} not found`);
      return;
    }

    // Do not re-send data for non-Pending and non-Running problems
    if (
      problem.status !== ProblemStatus.PENDING &&
      problem.status !== ProblemStatus.RUNNING
    )
      return;

    // Fetch input data
    const inputData = await InputData.findOne({ problemId: problem._id });
    if (!inputData) {
      return res.status(404).json({ error: "Input data not found" });
    }

    // Fetch metadata
    const problemMetadata = await ProblemMetadata.find({
      problemId: problem._id,
    }).populate("metadataId");

    let metadata = {};
    for (const md of problemMetadata) {
      const name = md.metadataId.name;
      const value = md.value;
      metadata[name] = value;
    }

    // Prepare the problem data
    const problemData = {
      problemId: problem._id,
      modelId: problem.modelId.id,
      inputData: inputData.data,
      metadata: JSON.stringify(metadata),
    };

    // Send the problem data to the solver
    const success = await sendMessage("problem-execute-req", problemData);
    if (success) {
      // Changing problem status to PEDNING
      problem.status = ProblemStatus.PENDING;
      await problem.save();
    } else {
      console.error("Failed to send problem to solver:", problemData);
    }

    await Result.deleteMany({ problemId });
  } catch (e) {
    console.error(`Error when resending problem info for ${id}: ${e}`);
  }
};
