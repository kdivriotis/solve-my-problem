import mongoose from "mongoose";
import { User, TransactionType } from "../database/index.js";

import { sendMessage } from "../broker/sendMessage.js";
import { validateInteger } from "../utils/validateInteger.js";

/**
 * Add credits to a user's account.
 * @param {string?} req.params.id User's unique ID
 * @param {string} req.body.amount Amount of credits to be added
 *
 * @returns User's new credit balance or message in case of failure
 */
export const addCredits = async (req, res) => {
  try {
    // If a /:userId parameter is provided, use this instead of value from cookie
    const requestedId = req.params.userId ? req.params.userId : req.user.id;

    // Validate input - If defined, has to be the same ID that made the request (unless request is made by an administrator)
    if (requestedId !== req.user.id && !req.user?.isAdmin) {
      return res.status(401).json({
        message: "You are not authorized to access this user's credits",
      });
    }

    // Get authorized user's ID from request
    const userId = mongoose.Types.ObjectId.createFromHexString(requestedId);

    // Amount has to be a valid, positive integer
    const validateAmountResult = req.user.isAdmin
      ? validateInteger(req.body.amount)
      : validateInteger(req.body.amount, 0);
    if (validateAmountResult) {
      return res
        .status(400)
        .json({ message: `Invalid credits amount ${validateAmountResult}` });
    }
    const amount = parseInt(req.body.amount);

    // Get user's credits from DB
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "The requested user does not exist" });
    }
    const oldCredits = user.credits;
    const credits = oldCredits + amount;

    // Update user's credits in DB
    user.credits = credits;
    await user.save();
   
    // Notify other services about the transaction and change on user's credits
    const transactionMessage = {
      id: userId.toHexString(),
      amount,
      type: TransactionType.ADD_CREDITS,
      description:
        requestedId !== req.user.id ? `by administrator ${req.user.id}` : "",
      problemId: null,
    };
    const creditsChangedMessage = {
      id: userId.toHexString(),
      name: user.name,
      credits: user.credits,
    };
    const [transactionMessageOk, creditsMessageOk] = await Promise.all([
      sendMessage("transaction-created", transactionMessage),
      sendMessage("credits-changed", creditsChangedMessage),
    ]);
    
    // If message failed, undo DB change and return error message
    if (!transactionMessageOk || !creditsMessageOk) {
      user.credits = oldCredits;
      await user.save();
      throw new Error("No communication with the broker");
    }

    return res.status(200).json({ credits });
  } catch (e) {
    return res.status(500).json({
      message: `Something went wrong. Please try again later. (${e})`,
    });
  }
};
