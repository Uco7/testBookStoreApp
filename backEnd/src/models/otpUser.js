import mongoose from "mongoose";

const otpUserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }, // Already hashed
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 900 } // Auto-delete after 15 mins
});

export default mongoose.model("OtpUser", otpUserSchema);