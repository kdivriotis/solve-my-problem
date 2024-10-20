import mongoose from "mongoose";
import { Problem, ProblemMetadata, InputData } from "../database/index.js";

/**
 * Get info for a problem submission.
 * @param {string} req.params.id Problem's unique ID
 *
 * @returns Problem's info or message in case of failure
 */
export const getProblemInfo = async (req, res) => {
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
    let problem = await Problem.findOne({ _id: problemId })
      .populate("userId")
      .populate("modelId");
    if (!problem) {
      return res
        .status(404)
        .json({ message: "The requested problem does not exist" });
    }

    if (!req.user.isAdmin && !problem.userId._id.equals(userId)) {
      return res
        .status(401)
        .json({ message: "You are not authorized to access this problem" });
    }

    // Problem was found and belongs to this user - Fetch metadata
    const problemMetadata = await ProblemMetadata.find({ problemId }).populate(
      "metadataId"
    );

    const metadata = problemMetadata.map((m) => {
      return {
        name: m.metadataId.name,
        description: m.metadataId.description,
        type: m.metadataId.type,
        uom: m.metadataId.uom,
        value: m.value,
      };
    });

    // Fetch Input Data
    const problemInputFile = await InputData.findOne({ problemId });
    const inputData = problemInputFile
      ? {
          submittedOn: problemInputFile.submittedOn,
          data: problemInputFile.data,
          error: problemInputFile.error,
        }
      : null;

    // Transform the fetched data to the desired format
    problem = {
      id: problem._id.toHexString(),
      name: problem.name,
      status: problem.status,
      creator: {
        id: problem.userId._id.toHexString(),
        name: problem.userId.name,
      },
      submittedOn: problem.submittedOn,
      model: {
        id: problem.modelId.id,
        name: problem.modelId.name,
      },
      metadata,
      inputData,
    };

    return res.status(200).json({ problem });
  } catch (e) {
    return res.status(500).json({
      message: `Something went wrong. Please try again later. (${e})`,
    });
  }
};
