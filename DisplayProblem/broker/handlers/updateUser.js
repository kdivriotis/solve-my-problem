import mongoose from "mongoose";
import { User } from "../../database/index.js";

/**
 * Handle message received from broker to update user's credits or create a new user
 *
 * @param {string} id The unique ID of the user to be updated
 * @param {string} name User's name (if user doesn't already exist, he will automatically be created)
 * @param {number?} credits The new amount of credits
 */
export const updateUser = async (id, name, credits = 0) => {
  try {
    // Validate inputs
    if (!id || id === "") return;

    // Get user's ID from request
    const userId = mongoose.Types.ObjectId.createFromHexString(id);
    
    // Get user's info from DB
    let user = await User.findById(userId);
    if (!user) {
      user = new User({
        _id: userId,
        name: name,
        credits: credits,
        isDeleted: false,
      });
    } else {
      user.name = name;
      if (credits != null && credits != undefined) user.credits = credits;
      user.isDeleted = false;
    }

    // Update user's credits in DB
    await user.save();
  } catch (e) {
    console.error(`Error when charging user: ${e}`);
  }
};
