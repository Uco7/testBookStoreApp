import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true, trim: true },
    fullName: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: { type: String, required: true, select: false },

    premium: {
      isPremium: { type: Boolean, default: false },

      trialStartedAt:  { type: Date, default: null },
      trialExpiresAt:  { type: Date, default: null },

      premiumPlan: {
        type: String,
        enum: ["monthly", "yearly", "lifetime", null],
        default: null,
      },

      premiumStartedAt: { type: Date, default: null },
      premiumExpiresAt: { type: Date, default: null },

      adsRemoved: { type: Boolean, default: false },
    },

    // ── WELCOME BONUS ────────────────────────────────────────────────────────
    // Clock starts the moment the user creates their very first timetable.
    // bonusStartedAt    — set once on first timetable creation, never changed.
    // bonusExpiresAt    — bonusStartedAt + 30 days.
    // gracePeriodEndsAt — bonusExpiresAt + 3 days.
    //
    // Phases:
    //   bonusStartedAt → bonusExpiresAt    : fully free, no gates
    //   bonusExpiresAt → gracePeriodEndsAt : grace — max 3 timetables, warning shown
    //   after gracePeriodEndsAt            : must watch ad or subscribe
    welcomeBonus: {
      bonusStartedAt:    { type: Date, default: null },
      bonusExpiresAt:    { type: Date, default: null },
      gracePeriodEndsAt: { type: Date, default: null },
    },
    // ── ACTIVITY STATUS (online / offline) ──────────────────────────────────
    // isOnline  — flip to true on login / socket "connect", false on logout /
    //             socket "disconnect" (or after a heartbeat timeout).
    // lastSeen  — update every time isOnline changes, or on each heartbeat ping.
    //             Useful for showing "last seen 5 minutes ago" even when offline.
    activityStatus: {
      isOnline: { type: Boolean, default: false },
      lastSeen: { type: Date, default: null },
    },

    // ── AD UNLOCK ────────────────────────────────────────────────────────────
    // Tracks rewarded-ad unlocks server-side.
    // 3 premium timetables allowed per 24-hour ad-unlock window.
    adUnlock: {
      unlockedAt: { type: Date,   default: null },
      count:      { type: Number, default: 0    },
    },

    otp:                  { type: String },
    otpExpires:           { type: Date   },
    isVerified:           { type: Boolean, default: false },

    resetPasswordOTP:     { type: String },
    resetPasswordExpires: { type: Date   },


    pushToken: { type: String, default: null },
  },
  
  { timestamps: true }
);

export default mongoose.model("User", userSchema);