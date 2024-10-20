//blockUserHandler.js

const User = require('../../models/User');   // Ensure this path is correct
const mongoose = require("mongoose");

//export const blockUserHandler = async (message) => {
const blockUserHandler = async (message) => {
  const { userId, block } = message;

  try {
    const user = await User.findById( mongoose.Types.ObjectId.createFromHexString(userId));
    if (!user) {
      console.log(`User with ID ${userId} not found`);
      return;
    }

    user.isBlocked = block; // block is true to block, false to unblock
    await user.save();

    console.log(`User with ID ${userId} is now ${block ? "blocked" : "unblocked"}`);
  } catch (err) {
    console.error(`Error blocking/unblocking user with ID ${userId}: ${err.message}`);
  }
};

module.exports = blockUserHandler;