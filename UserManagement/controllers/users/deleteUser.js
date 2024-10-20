const mongoose = require("mongoose");
const User = require("../../models/User");
const { sendMessage } = require("../../broker/index");

/**
 * Delete a user account (mark as deleted in the database).
 * @param {string?} req.params.userId User's unique ID
 *
 * @returns Message about success or failure
 */
exports.deleteUser = async (req, res) => {
  try {
    // If a /:userId parameter is provided, use this instead of value from cookie
    const requestedId = req.params.userId ? req.params.userId : req.user.id;

    // Validate input - If defined, has to be the same ID that made the request (unless request is made by an administrator)
    if (requestedId !== req.user.id && !req.user?.isAdmin) {
      return res.status(401).json({
        message: "You are not authorized to delete this user's account",
      });
    }

    if (requestedId === req.user.id && req.user?.isAdmin) {
      return res.status(400).json({
        message:
          "You cannot delete your account because it's an administrator account",
      });
    }

    // Get user's ID from request
    const userId = mongoose.Types.ObjectId.createFromHexString(requestedId);
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({
        message: "Invalid user",
      });
    user.isDeleted = true;
    await user.save();

    // If a user deleted his account, reset the "token" cookie
    if (requestedId === req.user.id)
      // Set the cookie in the response
      res.cookie("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 0,
      });

    await sendMessage("user-deleted", { id: requestedId });
    return res.status(200).json({ message: "User account was deleted" });
  } catch (e) {
    console.error(`deleteUser: Error occured: ${e}`);
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};
