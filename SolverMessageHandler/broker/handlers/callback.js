import { problemExecutionResponse } from "./problemExecutionResponse.js";
import { problemExecutionResult } from "./problemExecutionResult.js";
import { resendProblemInfo } from "./resendProblemInfo.js";
import { deleteProblem } from "./deleteProblemResult.js";

/**
 * Callback function for messages received from the broker.
 * @param {string} topic The topic where the message was received
 * @param {object} message The received message object
 */
export const callback = async (topic, message) => {
  switch (topic) {
    case "problem-execute-res":
      problemExecutionResponse(message.problemId, message.error);
      break;
    case "problem-result":
      problemExecutionResult(
        message.problemId,
        message.error,
        message.executionTime,
        message.result
      );
      break;
    case "problem-execute-resend":
      resendProblemInfo(message.problemId);
      break;
    case "problem-deleted":
      deleteProblem(message.problemId);
      break;
    default:
      console.log(topic, message);
  }
};
