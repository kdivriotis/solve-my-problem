import mongoose from "mongoose";
import { Transaction } from "../database/index.js";

import { validateDate } from "../utils/index.js";

/**
 * Get a user's transaction history.
 * @param {string?} req.params.id User's unique ID
 * @param {string?} req.query.dateFrom Optional: Filter minimum date of transactions fetched
 * @param {string?} req.query.dateUntil Optional: Filter maximum date of transactions fetched
 *
 * @returns User's transactions or message in case of failure
 */
export const getTransactions = async (req, res) => {
  try {
    // If a /:userId parameter is provided, use this instead of value from cookie
    const requestedId = req.params.userId ? req.params.userId : req.user.id;

    // Validate input - If defined, has to be the same ID that made the request (unless request is made by an administrator)
    if (requestedId !== req.user.id && !req.user?.isAdmin) {
      return res.status(401).json({
        message: "You are not authorized to access this user's transactions",
      });
    }

    // Get authorized user's ID from request
    const userId = mongoose.Types.ObjectId.createFromHexString(requestedId);

    let { dateFrom, dateUntil } = req.query;

    // Validate inputs

    // If a date from is defined, check if it's valid
    if (dateFrom) {
      const hasError = validateDate(dateFrom);
      if (hasError)
        return res.status(400).json({
          message: `Date from (${dateFrom}) ${hasError}`,
        });

      dateFrom = new Date(dateFrom).toISOString().split("T")[0];
    }

    // If a date until is defined, check if it's valid
    if (dateUntil) {
      const hasError = validateDate(dateUntil);
      if (hasError)
        return res.status(400).json({
          message: `Date until (${dateUntil}) ${hasError}`,
        });

      dateUntil = new Date(dateUntil).toISOString().split("T")[0];
    }

    // Get user's transactions from DB
    let query = { userId };
    if (!!dateFrom && !!dateUntil)
      query.date = { $gte: dateFrom, $lte: dateUntil };
    else if (!!dateFrom) query.date = { $gte: dateFrom };
    else if (!!dateUntil) query.date = { $lte: dateUntil };

    const transactions = await Transaction.find(query).sort({ date: -1 });
    const response = {
      transactions: transactions.map((t) => {
        return {
          id: t._id.toHexString(),
          date: t.date,
          type: t.type,
          typeStr: t.type === 0 ? "Credits Added" : "Credits Charged",
          amount: t.amount,
          problemId:
            t.problemId && t.problemId.trim() !== "" ? t.problemId : null,
          description: t.description,
        };
      }),
    };

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: `Something went wrong. Please try again later. (${e})`,
    });
  }
};
