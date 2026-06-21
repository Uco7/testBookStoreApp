// models/subscription.js
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    email: { type: String, required: true },

    plan: {
      type: String,
      enum: ["monthly", "yearly", "lifetime"],
      required: true,
    },

    amount: { type: Number, required: true },

    reference: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },

    paidAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);