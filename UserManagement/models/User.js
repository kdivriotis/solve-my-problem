const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      // Will be null for Google users
      type: String,
      // Make password required only for non-Google users
      required: function () {
        return !this.isGoogleUser;
      },
    },
    googleId: {
      // Will be null for regular users
      type: String,
    },
    isGoogleUser: {
      type: Boolean,
      default: false,
    },
    credits: {
      type: Number,
      required: true,
      default: 0,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now,
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

module.exports = mongoose.model("User", UserSchema);
