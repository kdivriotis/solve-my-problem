import mongoose from "mongoose";
import { User } from "../../database/index.js";

/**
 * Handle message received from broker to delete a user
 *
 * @param {string} id The unique ID of the user to be deleted
 */
export const deleteUser = async (id, name, credits = 0) => {
  try {
    // Validate inputs
    if (!id || id === "") return;

    // Get user's ID from request & try to delete
    const userId = mongoose.Types.ObjectId.createFromHexString(id);
    const user = await User.findById(userId);
    if (!user) return;
    user.isDeleted = true;
    await user.save();
  } catch (e) {
    console.error(`Error when deleting user: ${e}`);
  }
};
