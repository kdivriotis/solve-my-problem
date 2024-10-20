const mongoose = require("mongoose");
const User = require("../../models/User");

/**
 * Get user's profile info from the database.
 *
 * @returns [{ id, name, email, date, isAdmin }] or message in case of failure
 */
exports.getUsers = async (req, res) => {
  try {
    // Only admins can access other users' info
    if (!req.user?.isAdmin) {
      return res.status(401).json({
        message: "You are not authorized to access other users' information",
      });
    }

    // Get users' info from DB
    let users = await User.find().sort({ email: 1 });

    // Transform the fetched data to the desired format
    users = users.map((user) => {
      return {
        id: user._id.toHexString(),
        name: user.name,
        email: user.email,
        credits: user.credits,
        isAdmin: user.isAdmin,
        date: user.date,
        isDeleted: user.isDeleted,
        isSameAsRequest: user._id.toHexString() === req.user.id,
      };
    });

    return res.status(200).json({ users });
  } catch (e) {
    return res.status(500).json({
      message: `Something went wrong. Please try again later. (${e})`,
    });
  }
};
