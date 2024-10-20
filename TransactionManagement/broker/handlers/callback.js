import { addTransaction } from "./addTransaction.js";

/**
 * Callback function for messages received from the broker.
 * @param {string} topic The topic where the message was received
 * @param {object} message The received message object
 */
export const callback = async (topic, message) => {
  switch (topic) {
    case "transaction-created":
      addTransaction(
        message.id,
        message.amount,
        message.type,
        message.description,
        message.problemId
      );
      break;
    default:
      console.log(topic, message);
  }
};
