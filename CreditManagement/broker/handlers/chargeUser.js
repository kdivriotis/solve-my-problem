import mongoose from "mongoose";
import { User, TransactionType } from "../../database/index.js";

import { sendMessage } from "../sendMessage.js";
import { validateInteger } from "../../utils/validateInteger.js";

/**
 * Handle message received from broker to charge user
 * credits for executing a problem submission
 * @param {string} id The unique ID of the user to be charged
 * @param {number} amount The amount (credits) to be charged
 * @param {string?} problemId Unique ID of the problem (if user was charged for a problem execution)
 */
export const chargeUser = async (id, amount, problemId = null) => {
  try {
    // Validate inputs
    if (!id || id === "") return;

    const validateAmountResult = validateInteger(amount, 0);
    if (validateAmountResult) return;

    // Get user's ID from request
    const userId = mongoose.Types.ObjectId.createFromHexString(id);

    // Get user's credits from DB
    const user = await User.findById(userId);
    if (!user) return;

    user.credits -= parseInt(amount);

    // Update user's credits in DB
    await user.save();

    // Notify other services about the transaction and change on user's credits
    const transactionMessage = {
      id,
      amount: parseInt(amount),
      type: TransactionType.CHARGE,
      description:
        problemId && problemId.toString().trim() !== ""
          ? "Problem execution fees"
          : "",
      problemId,
    };

    const creditsChangedMessage = {
      id,
      name: user.name,
      credits: user.credits,
    };

    const [transactionMessageOk, creditsMessageOk] = await Promise.all([
      sendMessage("transaction-created", transactionMessage),
      sendMessage("credits-changed", creditsChangedMessage),
    ]);
    if (!transactionMessageOk)
      console.error(
        `Failed to send transaction created message ${transactionMessage}`
      );

    if (!creditsMessageOk)
      console.error(
        `Failed to send credits changed message ${creditsChangedMessage}`
      );
  } catch (e) {
    console.error(`Error when charging user: ${e}`);
  }
};
