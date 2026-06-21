

import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },

    planType: {
      type: String,
      enum: ["regular", "premium"],
      default: "regular",
    },

    mode: {
      type: String,
      enum: ["notification", "alarm"],
      default: "notification",
    },

    deliveryMode: {
      type: String,
      enum: ["online", "offline", "hybrid"],
      default: "online",
    },

    offlineEnabled: { type: Boolean, default: false },

    noticeCount: { type: Number, required: true, min: 1, max: 24 },
    reminderTime: { type: String, required: true },

    reminderType: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "daily",
    },

    studyDays: {
      type: [String],
      enum: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      default: [],
    },

    notificationMessage: {
      type: String,
      default: "",
      trim: true,
      maxlength: 200,
    },

    // ONLINE SCHEDULING
    jobIds: { type: [String], default: [] },
    repeatKeys: { type: [String], default: [] },

    // OFFLINE DEVICE SYNC (🔥 IMPORTANT)
    deviceScheduleVersion: { type: Number, default: 1 },
    lastSyncedAt: { type: Date, default: null },

    localAlarmPayload: { type: Object, default: null },

    enableAlarmSound: { type: Boolean, default: false },
    soundName: { type: String, default: null },

    isActive: { type: Boolean, default: true },

    sentCountToday: { type: Number, default: 0 },
    lastResetDate: { type: String, default: null },

    timezone: { type: String, default: "Africa/Lagos" },
  },
  { timestamps: true }
);

export default mongoose.model("UserTimetable", timetableSchema);