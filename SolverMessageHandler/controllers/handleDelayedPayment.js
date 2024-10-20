// controllers/handleDelayedPayment.js
import { Problem, Result, ProblemStatus, User } from "../database/index.js";
import { sendMessage } from "../broker/index.js";
import mongoose from "mongoose";

export const delayedPayment = async (req, res) => {
  try {
    // Extract the problem ID from the request parameters
    const { problemId } = req.params;

    // Extract the user ID from the token in cookies
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    // Find the problem in the database
    const problem = await Problem.findById(
      mongoose.Types.ObjectId.createFromHexString(problemId)
    ).populate("userId");

    if (!problem) {
      return res
        .status(404)
        .json({ message: `Problem with ID ${problemId} not found` });
    }

    // Check if the problem is already executed
    if (problem.status !== ProblemStatus.EXECUTED) {
      console.log("here");
      return res
        .status(400)
        .json({ message: "Problem is not yet executed or already processed" });
    }

    // Find the result record
    const result = await Result.findOne({ problemId });
    const cost = result.cost;

    // Check if the user has sufficient credits
    const sufficientCredits = problem.userId.credits >= cost;

    if (!sufficientCredits) {
      return res.status(403).json({ message: "Insufficient credits" });
    }

    // If the user has sufficient credits, mark the result as available
    result.isAvailable = true;
    await result.save();

    // Send message to charge user credits
    const chargeMessage = {
      id: problem.userId?._id ? problem.userId._id.toHexString() : null,
      amount: cost,
      problemId,
    };

    const sent = await sendMessage("credits-charge-user", chargeMessage);
    if (!sent) {
      return res.status(500).json({ message: "Failed to charge user credits" });
    }

    // Send message to block user 
    //this could be a function 
    const block = false;
    const user = await User.findById(problem.userId._id);
    if (!user) {
     console.log(`User with ID ${problem.userId._id} not found`);
     return;
   }

   user.isBlocked = block; // block is true to block, false to unblock
   await user.save();

   console.log(`Unblocking User with ID ${problem.userId._id}`);
  
    console.log(`User with ID ${problem.userId._id} charged for problem with ID ${problem._id}`);

    const blockMessage = {
      userId: problem.userId._id.toHexString(),
      block: block,
    };
     const sentblock = await sendMessage("block-user", blockMessage);
    if (sentblock) {
      console.log(
        `User with ID ${problem.userId._id} can now execute problem submissions`
      );
    } else {
      console.error(
        `Failed to unblock user ${problem.userId._id}`
      );
    }
    res.status(200).json({ message: "Payment processed successfully" });
  } catch (err) {
    console.error("Failed to process delayed payment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
