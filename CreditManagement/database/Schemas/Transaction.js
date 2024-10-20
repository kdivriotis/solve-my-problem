import mongoose from "mongoose";

import { User } from "./User.js";

export const TransactionType = {
  ADD_CREDITS: 0, // User added credits to his account
  CHARGE: 1, // Charge user for problem execution
};

const TransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: User,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: Number,
      required: true,
      enum: Object.values(TransactionType),
      default: TransactionType.ADD_CREDITS,
    },
    problemId: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    collection: "transactions",
  }
);

export const Transaction = mongoose.model("Transaction", TransactionSchema);
