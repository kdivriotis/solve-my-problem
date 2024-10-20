import mongoose from "mongoose";
import {
  Problem,
  ProblemStatus,
  InputData,
  Result,
  User
} from "../../database/index.js";

import { sendMessage } from "../sendMessage.js";

/**
 * Message received from broker: Result is ready from a solver (problem execution finished)
 *
 * Either notification about error on a problem's input data,
 * or problem's execution result.
 *
 * @param {string} id The unique ID of the problem
 * @param {string?} error If defined, describes the error that occured on submission's input data
 * @param {number?} executionTime Execution time (in seconds)
 * @param {string} result The result object, as a JSON string
 */
export const problemExecutionResult = async (
  id,
  error,
  executionTime,
  result
) => {
  try {
    // Validate inputs
    if (!id || id === "") return;

    // Get submission's ID from request
    const problemId = mongoose.Types.ObjectId.createFromHexString(id);

    // Find the problem in the database
    const problem = await Problem.findById(problemId)
      .populate("modelId")
      .populate("userId");
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
      console.error(`Problem ID ${problemId} failed: ${error}`);

      return;
    }

    // No error: Check if the executionTime & result are valid
    if (!executionTime || !result || result === "") return;

    const price = problem.modelId.price;
    const cost = Math.max(Math.round(price * executionTime), 1);

    // Check if the user has sufficient credits
    const suffiecent = problem.userId.credits >= cost;

    // Save the result and update status to EXECUTED
    const problemResult = new Result({
      problemId,
      executionTime,
      data: result,
      cost,
    });

    let isPaid = "but NOT PAID";
    if (suffiecent) {
      problemResult.isAvailable = true;
      isPaid = "and PAID";

      // Send message to charge user credits
      const chargeMessage = {
        id: problem.userId._id.toHexString(),
        amount: cost,
        problemId,
      };

      const sent = await sendMessage("credits-charge-user", chargeMessage);
      if (sent) {
        console.log(
          `User ${problem.userId._id} charged for problem ${problemId}`
        );
      } else {
        console.error(
          `Failed to charge user ${problem.userId._id} for problem ${problemId}`
        );
      }
    }
    else {
       // Send message to block user and also update the local database copy
       //this could be a function 
       const block = true;
       const user = await User.findById(problem.userId._id);
       if (!user) {
        console.log(`User with ID ${problem.userId._id} not found`);
        return;
      }
  
      user.isBlocked = block; // block is true to block, false to unblock
      await user.save(); //save the local copy
  
      console.log(`Blocking user with ID ${problem.userId._id}`);
     
       const blockMessage = {
        userId: problem.userId._id.toHexString(),
        block: block,
      };
      const sent = await sendMessage("block-user", blockMessage);
      if (sent) {
        console.log(
          `User with ID ${problem.userId._id} is now blocked from running new problems, awaiting payment for problem with ID ${problemId}`
        );
      } else {
        console.error(
          `Failed to block user ${problem.userId._id}`
        );
      }
    }
    await problemResult.save();
    problem.status = ProblemStatus.EXECUTED;
    await problem.save();
    console.log(`Problem ID ${problemId} is now EXECUTED ` + isPaid);
  } catch (e) {
    console.error(`Failed to process solver result for ${id}: ${e}`);
  }
};
