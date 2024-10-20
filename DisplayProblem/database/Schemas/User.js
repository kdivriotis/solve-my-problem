import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    credits: {
      type: Number,
      required: true,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    collection: "users",
  }
);

export const User = mongoose.model("User", UserSchema);
