const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");

/**
 * Change user's password.
 * @param {string?} req.params.userId User's unique ID
 *
 * @returns Message about success or failure
 */
exports.changePassword = async (req, res) => {
  const { password } = req.body;

  // Validate input
  if (!password) {
    return res
      .status(400)
      .json({ message: "Please provide a valid new password" });
  }

  try {
    // If a /:userId parameter is provided, use this instead of value from cookie
    const requestedId = req.params.userId ? req.params.userId : req.user.id;

    // Validate input - If defined, has to be the same ID that made the request (unless request is made by an administrator)
    if (requestedId !== req.user.id && !req.user?.isAdmin) {
      return res.status(401).json({
        message: "You are not authorized to change this user's password",
      });
    }

    // Get user's ID from request
    const userId = mongoose.Types.ObjectId.createFromHexString(requestedId);
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({
        message: "Invalid user",
      });

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error." });
  }
};
