// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   username: { type: String, unique: true }, // Added unique for safety
//   fullName: { type: String },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true, select: false }, // Added select: false
//   resetPasswordToken: { type: String },
//   resetPasswordExpires: { type: Date }
// }, { timestamps: true });

// export default mongoose.model("User", userSchema);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    unique: true, 
    required: true, 
    trim: true 
  },
  fullName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true, 
    select: false // Ensures password isn't leaked in general queries
  },
  // --- OTP Logic Fields ---
  resetPasswordOTP: { 
    type: String, 
    default: null 
  },
  resetPasswordExpires: { 
    type: Date, 
    default: null 
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);