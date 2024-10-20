import mongoose from "mongoose";

/**
 * Connect to MongoDB database.
 * Get connection string from .env configuration file.
 *
 * @return {Promise<boolean>} true if connection is successful, otherwise false
 */
export const connect = async (reconnect) => {
  const connectionString = process.env.MONGO_URI;

  try {
    const db = await mongoose.connect(connectionString);
    mongoose.connection.on("disconnect", () =>
      console.log("Disconnected from MongoDB")
    );
    mongoose.connection.on("reconnect", () =>
      console.log("Reconnected to MongoDB")
    );
    return true;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return false;
  }
};
