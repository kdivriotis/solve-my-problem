import mongoose from "mongoose";
import { User } from "../database/index.js";

/**
 * Get a user's credits.
 * @param {string?} req.params.id User's unique ID
 *
 * @returns User's credits or message in case of failure (for administrators, all other users' credits will be returned as well)
 */
export const getCredits = async (req, res) => {
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

    // Get user's credits from DB
    const user = await User.findById(userId).select("credits");
    if (!user) {
      return res
        .status(404)
        .json({ message: "The requested user does not exist" });
    }

    const credits = user.credits;
    const response = { credits };

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: `Something went wrong. Please try again later. (${e})`,
    });
  }
};
