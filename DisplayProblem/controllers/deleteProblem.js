import mongoose from "mongoose";
import { Problem, ProblemMetadata } from "../database/index.js";
import { sendMessage } from "../broker/index.js";

/**
 * Delete a problem submission.
 * @param {string} req.params.id Problem's unique ID
 *
 * @returns Message about success or failure
 */
export const deleteProblem = async (req, res) => {
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
    let problem = await Problem.findById(problemId);
    if (!problem) {
      return res
        .status(404)
        .json({ message: "The requested problem does not exist" });
    }

    if (!req.user.isAdmin && !problem.userId.equals(userId)) {
      return res
        .status(401)
        .json({ message: "You are not authorized to access this problem" });
    }

    // Try to delete document from DB
    const deletedProblem = await Problem.findByIdAndDelete(problemId);
    if (!deletedProblem) throw new Error("MongoDB: Unsuccessful deletion");

    // Notify other services that the problem was deleted=
    const messageOk = await sendMessage("problem-deleted", {
      problemId: problemId.toHexString(),
    });

    // If message failed, undo DB change and return error message
    if (!messageOk) {
      await Problem.create(problem);
      throw new Error("No communication with the broker");
    }

    // Delete problem's metadata
    await ProblemMetadata.deleteMany({ problemId });

    return res.status(200).json({ message: "Problem was deleted" });
  } catch (e) {
    return res.status(500).json({
      message: `Something went wrong. Please try again later. (${e})`,
    });
  }
};
