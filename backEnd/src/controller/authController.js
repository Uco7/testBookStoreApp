
import sendEmail from "../middleWare/sendMail.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

/* ---------- Helpers ---------- */
const normalizeEmail = (email) => email?.toLowerCase().trim();
const sanitize = (str) => str?.replace(/[<>\/\\$;]/g, "").trim();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[^\s]{8,128}$/;

/* ---------- Registration Step 1: Request OTP ---------- */
export const requestRegisterOTP = async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;
    console.log("OTP Request:", req.body);

    if (!username || !fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const cleanUsername = sanitize(username);
    console.log("Cleaned Username:", cleanUsername);
    const cleanEmail = normalizeEmail(email);
    console.log("Cleaned Email:", cleanEmail);

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
    console.log("Existing User Check:", existing);
      
    if (existing&&existing.isVerified) {
      return res.status(409).json({ message: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP:", otp);
    const hashedPassword = await bcrypt.hash(password, 12);

    await User.findOneAndUpdate(
      { email: cleanEmail },
      {
        username: cleanUsername,
        fullName: sanitize(fullName),
        email: cleanEmail,
        password: hashedPassword,
        otp,
        otpExpires: Date.now() + 15 * 60 * 1000, // 15 mins
        isVerified: false,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Verification code sent to email" });

    sendEmail({
      to: cleanEmail,
      subject: "Your BookStore App Verification Code",
      html: `<p>Hi ${fullName},</p><p>Your verification code is <strong>${otp}</strong>. It expires in 15 minutes.</p>`,
    }).catch((err) => console.error("Email send failed:", err));

  } catch (err) {
    console.error("OTP Request Error:", err);
    return res.status(500).json({ message: "Failed to send verification code" });
  }
};

/* ---------- Registration Step 2: Verify OTP ---------- */
export const verifyAndRegister = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log("Verification Request:", req.body);

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
    const cleanEmail = normalizeEmail(email);
    console.log("Cleaned Email for Verification:", cleanEmail);

    const user = await User.findOne({ email: cleanEmail });
    console.log("User Found for Verification:", user);

    if (!user) {
      return res.status(400).json({ message: "User session not found. Please register again." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();
    console.log("User verified and saved:", user);

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
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

    if (!identifier || !password) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const cleanIdentifier = identifier?.trim();

    const query = EMAIL_REGEX.test(cleanIdentifier)
      ? { email: normalizeEmail(cleanIdentifier) }
      : { username: cleanIdentifier };

    const user = await User.findOne(query).select("+password");

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ msg: "Account not verified" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

/* ---------- Get User ---------- */
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


/* ---------- Forgot Password ---------- */
export const forgotPassword = async (req, res) => {
  try {
    const { identifier } = req.body;
    console.log("Forgot Password Request:", req.body);

    if (!identifier) {
      return res.status(400).json({ message: "Email or username is required" });
    }

    const user = await User.findOne({
      $or: [
        { email:normalizeEmail(identifier) },
        { username:sanitize(identifier) },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "Account not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetPasswordOTP = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    sendEmail({
      to: user.email, 
      subject: "Your BookStore App Password Reset Code",
      html: `<p>Hi ${user.fullName},</p><p>Your password reset code is <strong>${otp}</strong>. It expires in 15 minutes.</p>`,
    }).catch((err) => console.error("Reset email failed:", err));

    res.status(200).json({ message: "Reset code sent to your email!" });

  } catch (err) {
    res.status(500).json({ message: "Error sending email" });
  }
};


/* ---------- Reset Password ---------- */
export const resetPassword = async (req, res) => {
  try {
    const { identifier, otp, password } = req.body;
    console.log("Reset Password Request:", req.body);

    if (!password || !PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        message: "Password must be 8-64 chars with letters and numbers.",
      });
    }

    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");
      console.log("Hashed OTP for Lookup:", hashedOtp);

    const user = await User.findOne({
      $or: [
        { email: normalizeEmail(identifier) },
        { username: sanitize(identifier) },
      ],
      resetPasswordOTP: hashedOtp,
      resetPasswordExpires: { $gt: Date.now() },
    });
    console.log("Reset Password User Lookup:", user);

    if (!user) {
      console.log("Invalid or expired OTP for identifier:", identifier);
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordOTP = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({ message: "Password updated successfully!" });

  } catch (err) {
    console.error("Reset Error:", err);
    res.status(500).json({ message: "Reset failed" });
  }
};