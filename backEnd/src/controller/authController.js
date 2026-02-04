// import sendEmail from "../middleWare/sendMail.js";
// import bcrypt from "bcryptjs";
// import User from "../models/user.js";
// import OtpUser from "../models/otpUser.js";

// /* ---------- Helpers ---------- */

// const normalizeEmail = (email) => email?.toLowerCase().trim();
// const sanitize = (str) => str?.replace(/[<>\/\\$;]/g, "").trim();

// const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
// const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[^\s]{8,128}$/;

// /* ---------- Registration Step 1: Request OTP ---------- */

// export const requestRegistration = async (req, res) => {
//   try {
//     const { username, fullName, email, password } = req.body;
//     console.log("register req:", req.body);

//     // 1. Validation
//     if (!username || !fullName || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const cleanUsername = sanitize(username);
//     const cleanEmail = normalizeEmail(email);

//     if (!USERNAME_REGEX.test(cleanUsername)) {
//       return res.status(400).json({ message: "Invalid username format" });
//     }

//     if (!EMAIL_REGEX.test(cleanEmail)) {
//       return res.status(400).json({ message: "Invalid email format" });
//     }

//     if (!PASSWORD_REGEX.test(password)) {
//       return res.status(400).json({ message: "Password too weak" });
//     }

//     // 2. Check existing permanent users
//     const existing = await User.findOne({
//       $or: [{ email: cleanEmail }, { username: cleanUsername }],
//     });

//     if (existing) {
//       return res.status(409).json({ message: "User already exists" });
//     }

//     // 3. Generate OTP and hash password
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // 4. Save temporary user
//     await OtpUser.findOneAndUpdate(
//       { email: cleanEmail },
//       {
//         username: cleanUsername,
//         fullName: sanitize(fullName),
//         email: cleanEmail,
//         password: hashedPassword,
//         otp,
//         createdAt: Date.now(),
//       },
//       { upsert: true, new: true }
//     );

//     // ✅ 5. RESPOND IMMEDIATELY (CRITICAL FIX)
//     res.status(200).json({ message: "Verification code sent to email" });

//     // ✅ 6. SEND EMAIL IN BACKGROUND (NON-BLOCKING)
//     sendEmail({
//       email: cleanEmail,
//       subject: "Verify Your Account",
//       message: `Your verification code is ${otp}. It expires in 15 minutes.`,
//     }).catch((err) => {
//       console.error("Email send failed:", err);
//     });

//   } catch (err) {
//     console.error("OTP Request Error:", err);
//     return res.status(500).json({ message: "Failed to send verification code" });
//   }
// };


// /* ---------- Registration Step 2: Verify & Create ---------- */

// export const verifyAndRegister = async (req, res) => {
//   try {
//     const { email, otp } = req.body;
//     const cleanEmail = normalizeEmail(email);

//     // 1. Find pending data
//     const pendingUser = await OtpUser.findOne({ email: cleanEmail });

//     if (!pendingUser) {
//       return res.status(400).json({ message: "Session expired. Please register again." });
//     }

//     // 2. Check OTP
//     if (pendingUser.otp !== otp) {
//       return res.status(400).json({ message: "Invalid verification code" });
//     }

//     // 3. Create permanent user
//     const user = await User.create({
//       username: pendingUser.username,
//       fullName: pendingUser.fullName,
//       email: pendingUser.email,
//       password: pendingUser.password, // already hashed
//     });

//     // 4. Cleanup temporary data
//     await OtpUser.deleteOne({ email: cleanEmail });

//     res.status(201).json({
//       message: "Registration successful",
//       user: { id: user._id, username: user.username, email: user.email },
//     });
//   } catch (err) {
//     console.error("Verification Error:", err);
//     res.status(500).json({ message: "Registration failed" });
//   }
// };

// /* ---------- Login ---------- */

// export const login = async (req, res) => {
//   try {
//     const { identifier, password } = req.body;
//     console.log("login req:",req.body)
//     if (!identifier || !password)
//       return res.status(400).json({ msg: "Invalid credentials" });

//     const cleanIdentifier = sanitize(identifier);
//     const query = EMAIL_REGEX.test(cleanIdentifier)
//       ? { email: normalizeEmail(cleanIdentifier) }
//       : { username: cleanIdentifier };

//     const user = await User.findOne(query).select("+password");

//     const fakeHash = "$2a$12$C9JxYkzjbxH0I5i9Jp9F7e3F4f5xkQ3Y1M4zQXKxjv6XW9fZ1N5Ka";
//     const hash = user?.password || fakeHash;
//     const match = await bcrypt.compare(password, hash);

//     if (!user || !match)
//       return res.status(400).json({ msg: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     res.json({ token });
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// };

// /* ---------- Get User & Password Reset ---------- */

// export const getUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const forgotPassword = async (req, res) => {
//   try {
//     const { identifier } = req.body;
//     const user = await User.findOne({
//       $or: [{ email: normalizeEmail(identifier) }, { username: identifier }],
//     });

//     if (!user) return res.status(404).json({ message: "Account not found" });

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     user.resetPasswordOTP = crypto.createHash("sha256").update(otp).digest("hex");
//     user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
//     await user.save();

//     await sendEmail({
//       email: user.email,
//       subject: "Your Password Reset Code",
//       message: `Your reset code is ${otp}. It expires in 10 minutes.`,
//     });

//     res.status(200).json({ message: "Reset code sent to your email!" });
//   } catch (err) {
//     res.status(500).json({ message: "Error sending email" });
//   }
// };

// export const resetPassword = async (req, res) => {
//   try {
//     const { identifier, otp, password } = req.body;

//     // 1. Backend Password Validation
//     if (!password || !PASSWORD_REGEX.test(password)) {
//       return res.status(400).json({ 
//         message: "Password must be 8-64 chars with letters and numbers." 
//       });
//     }

//     const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

//     const user = await User.findOne({
//       $or: [{ email: normalizeEmail(identifier) }, { username: identifier }],
//       resetPasswordOTP: hashedOtp,
//       resetPasswordExpires: { $gt: Date.now() },
//     });

//     if (!user) return res.status(400).json({ message: "Invalid or expired code" });

//     // 2. Hash and Save
//     user.password = await bcrypt.hash(password, 12);
//     user.resetPasswordOTP = undefined;
//     user.resetPasswordExpires = undefined;
//     await user.save();

//     res.status(200).json({ message: "Password updated successfully!" });
//   } catch (err) {
//     console.error("Reset Error:", err);
//     res.status(500).json({ message: "Reset failed" });
//   }
// };



import sendEmail from "../middleWare/sendMail.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import OtpUser from "../models/otpUser.js";

/* ---------- Helpers ---------- */
const normalizeEmail = (email) => email?.toLowerCase().trim();
const sanitize = (str) => str?.replace(/[<>\/\\$;]/g, "").trim();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[^\s]{8,128}$/;

/* ---------- Registration Step 1: Request OTP ---------- */
export const requestRegistration = async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;
    console.log("register req:", req.body);

    if (!username || !fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const cleanUsername = sanitize(username);
    const cleanEmail = normalizeEmail(email);

    if (!USERNAME_REGEX.test(cleanUsername)) {
      return res.status(400).json({ message: "Invalid username format" });
    }
    if (!EMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({ message: "Password too weak" });
    }

    const existing = await User.findOne({
      $or: [{ email: cleanEmail }, { username: cleanUsername }],
    });
    if (existing) return res.status(409).json({ message: "User already exists" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 12);

    await OtpUser.findOneAndUpdate(
      { email: cleanEmail },
      {
        username: cleanUsername,
        fullName: sanitize(fullName),
        email: cleanEmail,
        password: hashedPassword,
        otp,
        createdAt: Date.now(),
      },
      { upsert: true, new: true }
    );

    // Respond immediately (non-blocking)
    res.status(200).json({ message: "Verification code sent to email" });

    // Send OTP email in background
    sendEmail({
      email: cleanEmail,
      subject: "Verify Your Account",
      message: `Your verification code is ${otp}. It expires in 15 minutes.`,
    }).catch((err) => console.error("Email send failed:", err));

  } catch (err) {
    console.error("OTP Request Error:", err);
    return res.status(500).json({ message: "Failed to send verification code" });
  }
};

/* ---------- Registration Step 2: Verify & Create ---------- */
export const verifyAndRegister = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const cleanEmail = normalizeEmail(email);

    const pendingUser = await OtpUser.findOne({ email: cleanEmail });
    if (!pendingUser)
      return res.status(400).json({ message: "Session expired. Please register again." });

    if (pendingUser.otp !== otp)
      return res.status(400).json({ message: "Invalid verification code" });

    const user = await User.create({
      username: pendingUser.username,
      fullName: pendingUser.fullName,
      email: pendingUser.email,
      password: pendingUser.password,
    });

    await OtpUser.deleteOne({ email: cleanEmail });

    res.status(201).json({
      message: "Registration successful",
      user: { id: user._id, username: user.username, email: user.email },
    });

  } catch (err) {
    console.error("Verification Error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

/* ---------- Login ---------- */
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    console.log("login req:", req.body);

    if (!identifier || !password)
      return res.status(400).json({ msg: "Invalid credentials" });

    const cleanIdentifier = sanitize(identifier);
    const query = EMAIL_REGEX.test(cleanIdentifier)
      ? { email: normalizeEmail(cleanIdentifier) }
      : { username: cleanIdentifier };

    const user = await User.findOne(query).select("+password");

    const fakeHash =
      "$2a$12$C9JxYkzjbxH0I5i9Jp9F7e3F4f5xkQ3Y1M4zQXKxjv6XW9fZ1N5Ka";
    const hash = user?.password || fakeHash;
    const match = await bcrypt.compare(password, hash);

    if (!user || !match)
      return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

/* ---------- Get User & Password Reset ---------- */
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { identifier } = req.body;
    const user = await User.findOne({
      $or: [{ email: normalizeEmail(identifier) }, { username: identifier }],
    });

    if (!user) return res.status(404).json({ message: "Account not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = crypto.createHash("sha256").update(otp).digest("hex");
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send reset email using Resend
    sendEmail({
      email: user.email,
      subject: "Your Password Reset Code",
      message: `Your reset code is ${otp}. It expires in 10 minutes.`,
    }).catch((err) => console.error("Reset email failed:", err));

    res.status(200).json({ message: "Reset code sent to your email!" });

  } catch (err) {
    res.status(500).json({ message: "Error sending email" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { identifier, otp, password } = req.body;

    if (!password || !PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        message: "Password must be 8-64 chars with letters and numbers.",
      });
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const user = await User.findOne({
      $or: [{ email: normalizeEmail(identifier) }, { username: identifier }],
      resetPasswordOTP: hashedOtp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired code" });

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password updated successfully!" });

  } catch (err) {
    console.error("Reset Error:", err);
    res.status(500).json({ message: "Reset failed" });
  }
};
