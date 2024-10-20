const mongoose = require("mongoose");
const User = require("../../models/User");

/**
 * Get user's profile info from the database.
 *
 * @returns { name, email, date } or message in case of failure
 */
exports.getProfile = async (req, res) => {
  try {
    // Get authorized user's ID from request
    const userId = mongoose.Types.ObjectId.createFromHexString(req.user.id);

    // Get user's info from DB
    let user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }

    if (user.isDeleted) {
      return res.status(400).json({
        message:
          "Your account has been deleted. It can only be restored by an administrator",
      });
    }

    // Transform the fetched data to the desired format
    user = {
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      date: user.date,
    };

    return res.status(200).json({ user });
  } catch (e) {
    return res.status(500).json({
      message: `Something went wrong. Please try again later. (${e})`,
    });
  }
};
