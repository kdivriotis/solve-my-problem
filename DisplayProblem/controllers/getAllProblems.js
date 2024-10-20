import mongoose from "mongoose";
import { Problem } from "../database/index.js";

/**
 * Get all problems from the database.
 * @param {string?} req.params.userId User's unique ID
 *
 * @returns List of problems or message in case of failure
 */
export const getAllProblems = async (req, res) => {
  try {
    // If a /:userId parameter is provided, use this instead of value from cookie
    const requestedId = req.params.userId ? req.params.userId : req.user.id;

    // Validate input - If defined, has to be the same ID that made the request (unless request is made by an administrator)
    if (requestedId !== req.user.id && !req.user?.isAdmin) {
      return res.status(401).json({
        message: "You are not authorized to access this user's submissions",
      });
    }

    // Get authorized user's ID from request
    const userId = mongoose.Types.ObjectId.createFromHexString(requestedId);
    // Pagination parameters
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not provided
    const pageSize = parseInt(req.query.pageSize, 10) || 10; // Default to 10 items per page if not provided
    const skip = (page - 1) * pageSize;
   
    // Get all problems from the DB that belong to this user
    let problems = await Problem.find({ userId })
      .select("userId name status submittedOn modelId")
      .sort({ submittedOn: -1 })
      .skip(skip)
      .limit(pageSize);
      
      
    if (!problems) {
        return res
          .status(404)
          .json({ message: "No problems found for this user" });
      }
    const totalProblems = await Problem.countDocuments({ userId });
 
    let allProblems = await Problem.find({ userId })
      .select("userId name status submittedOn modelId")
      .sort({ submittedOn: -1 })

    // Transform the fetched data to the desired format
    allProblems = allProblems.map((problem) => ({
      id: problem._id.toHexString(),
      userId: problem.userId.toHexString(),
      name: problem.name,
      status: problem.status,
      submittedOn: problem.submittedOn,
      modelId: problem.modelId._id,
    }));



    // Transform the fetched data to the desired format
    problems = problems.map((problem) => ({
      id: problem._id.toHexString(),
      userId: problem.userId.toHexString(),
      name: problem.name,
      status: problem.status,
      submittedOn: problem.submittedOn,
      modelId: problem.modelId._id,
    }));

    return res.status(200).json({ problems, allProblems, totalPages: Math.ceil(totalProblems / pageSize)});
  } catch (e) {
    return res.status(500).json({
      message: `Something went wrong. Please try again later. (${e})`,
    });
  }
};
