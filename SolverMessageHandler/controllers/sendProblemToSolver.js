// controllers/sendProblemToSolver.js
import { sendMessage } from "../broker/index.js";
import {
  Problem,
  ProblemMetadata,
  InputData,
  ProblemStatus,
  User,
} from "../database/index.js";
import mongoose from "mongoose";

/**
 * Sends the problem to the solver via Kafka.
 *
 * @param {Object} req The request object
 * @param {Object} res The response object
 */
export const sendProblemToSolver = async (req, res) => {
  try {
    // Get authorized user's ID & problem ID from request
    const userId = mongoose.Types.ObjectId.createFromHexString(req.user.id);

    const { problemId } = req.params;

    if (!problemId || !mongoose.Types.ObjectId.isValid(problemId)) {
      return res.status(400).json({ error: "Invalid problem ID" });
    }

    
    // Find the user and check if he is blocked
    const user = await User.findById(userId);
    if (user.isBlocked) {
      return res.status(401).json({
        message: "You are blocked from executing a new submission, because of a pending payment",
      });
    }
    // Find the problem and validate it belongs to this user (unless user is admin)
    const problem = await Problem.findById(problemId).populate("modelId");
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    if (!req.user.isAdmin && !problem.userId._id.equals(userId)) {
      return res.status(401).json({
        message: "You are not authorized to execute this submission",
      });
    }

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
      console.log("Problem sent to solver successfully, ID:", problem._id);
      // Changing problem status to PEDNING
      problem.status = ProblemStatus.PENDING;
      await problem.save();

      res.status(200).json({ message: "Problem sent to solver successfully" });
    } else {
      console.error("Failed to send problem to solver:", problemData);
      res.status(500).json({ error: "Failed to send problem to solver" });
    }
  } catch (error) {
    console.error("Error sending problem to solver:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
