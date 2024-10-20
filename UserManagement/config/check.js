const mongoose = require("mongoose");

/**
 * Check connection status to MongoDB database.
 *
 * @return {Promise<boolean>} true if connection is ok, otherwise false
 */
exports.check = async () => {
  try {
    await mongoose.connection.db.admin().ping();
    return true;
  } catch (error) {
    console.error("Error MongoDB connection status:", error);
    return false;
  }
};
