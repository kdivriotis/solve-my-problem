import mongoose from "mongoose";

import { Problem, Result } from "../database/index.js";

/**
 * Get info for a problem submission.
 * @param {string} req.params.id Problem's unique ID
 *
 * @returns Problem's results or message in case of failure
 */
export const getProblemResults = async (req, res) => {
  try {
    // Validate inputs
    if (!req.params.id || req.params.id === "") {
      return res.status(400).json({ message: "No problem ID was selected" });
    }

    // Get authorized user's ID & problem ID from request
    const userId = mongoose.Types.ObjectId.createFromHexString(req.user.id);
    const problemId = mongoose.Types.ObjectId.createFromHexString(
      req.params.id
    );

    // Get problem's info from the DB and validate it belongs to this user (unless user is admin)
    let problem = await Problem.findById(problemId).populate("modelId");
    if (!problem) {
      return res
        .status(404)
        .json({ message: "The requested problem does not exist" });
    }

    if (!req.user.isAdmin && !problem.userId._id.equals(userId)) {
      return res.status(401).json({
        message: "You are not authorized to access this submission's results",
      });
    }

    // Problem was found and belongs to this user - Get results from DB
    let result = await Result.findOne({ problemId });
    if (!result) {
      return res
        .status(404)
        .json({ message: "No results found for this submission" });
    }

    // Return the result object
    result = {
      problemId,
      model: { id: problem.modelId.id, name: problem.modelId.name },
      executedOn: result.executedOn,
      executionTime: result.executionTime,
      cost: result.cost,
      isAvailable: result.isAvailable,
      data: result.isAvailable ? result.data : null,
    };

    return res.status(200).json({ result });
  } catch (e) {
    return res.status(500).json({
      message: `Something went wrong. Please try again later. (${e})`,
    });
  }
};
