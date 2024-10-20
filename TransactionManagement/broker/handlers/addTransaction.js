import mongoose from "mongoose";
import { Transaction, TransactionType } from "../../database/index.js";

/**
 * Add a new transaction to the database
 * @param {string} id The unique ID of the user that created the transaction
 * @param {number} amount The amount of the transaction
 * @param {TransactionType} type The type of the transaction
 * @param {string} description Short description for the transaction
 * @param {string?} problemId Unique ID of the problem (if user was charged for a problem execution)
 */
export const addTransaction = async (
  id,
  amount,
  type,
  description,
  problemId
) => {
  // Validate inputs
  if (!id || id === "") return;

  // Get user's ID from message
  const userId = mongoose.Types.ObjectId.createFromHexString(id);

  // Add transaction to history
  const transaction = new Transaction({
    userId,
    amount,
    type,
    description,
    problemId,
  });
  try {
    await transaction.save();
  } catch (e) {
    console.log(
      `Couldn't insert transaction ${amount} (of type ${type}) for user ${id} on ${new Date().toISOString()}.\nDescription: ${description}`
    );
  }
};
