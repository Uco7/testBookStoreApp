import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, trim: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, select: false },

  // ✅ Registration OTP fields
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },

  // 🔑 NEW: Password Reset fields
  // These must be defined so Mongoose allows them to be saved
  resetPasswordOTP: { type: String },
  resetPasswordExpires: { type: Date },

}, { timestamps: true });

export default mongoose.model("User", userSchema);