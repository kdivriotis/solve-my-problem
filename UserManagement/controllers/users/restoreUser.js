const mongoose = require("mongoose");
const User = require("../../models/User");
const { sendMessage } = require("../../broker/index");

/**
 * Restore a deleted user account (unmark deleted field in the database).
 * 
 * @param {string} req.params.userId User's unique ID
 *
 * @returns Message about success or failure
 */
exports.restoreUser = async (req, res) => {
  try {
    // Validate input - Administrator access only
    if (!req.user?.isAdmin) {
      return res.status(401).json({
        message: "You are not authorized to restore this user's account",
      });
    }

    // Get user's ID from request
    const userId = mongoose.Types.ObjectId.createFromHexString(
      req.params.userId
    );
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({
        message: "Invalid user",
      });
    user.isDeleted = false;
    await user.save();

    await sendMessage("user-created", {
      id: req.params.userId,
      name: user.name,
      credits: user.credits,
    });
    return res.status(200).json({ message: "User account was restored" });
  } catch (e) {
    console.error(`restoreUser: Error occured: ${e}`);
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};
