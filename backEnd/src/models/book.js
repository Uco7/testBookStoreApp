import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    // =========================
    // BASIC INFO
    // =========================
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    // =========================
    // FILE HANDLING
    // =========================
    fileUrl: {
      type: String,
      default: null,
    },

    fileType: {
      type: String,
      enum: ["file", "link"],
      default: "file",
    },

    originalFormat: {
      type: String,
      default: null,
    },

    fileLink: {
      type: String,
      default: null,
    },

    // =========================
    // OWNERSHIP
    // =========================
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // =========================
    // USAGE TRACKING (IMPORTANT FOR FUTURE)
    // =========================

    // how many times opened/read
    readCount: {
      type: Number,
      default: 0,
    },

    // for ranking / analytics later
    lastOpenedAt: {
      type: Date,
      default: null,
    },

    // =========================
    // STATUS FLAGS
    // =========================

    isArchived: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    // =========================
    // PREMIUM CONTENT FLAG (OPTIONAL FUTURE USE)
    // =========================

    isPremiumContent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Book", bookSchema);