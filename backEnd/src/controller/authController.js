import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

/* ---------- Helpers ---------- */

// Normalize email (lowercase + trim)
const normalizeEmail = (email) =>
  email?.toLowerCase().trim();

// Sanitize inputs to prevent basic injection
const sanitize = (str) =>
  str?.replace(/[<>\/\\$;]/g, "").trim();

// Regex patterns
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[^\s]{8,128}$/; // 8–128 chars, at least one letter and number, no whitespace

/* ---------- Register ---------- */

export const register = async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;

    // 1. Check required fields
    if (!username || !fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Sanitize and normalize
    const cleanUsername = sanitize(username);
    const cleanName = sanitize(fullName);
    const cleanEmail = normalizeEmail(email);

    // 3. Validate fields
    if (!USERNAME_REGEX.test(cleanUsername))
      return res.status(400).json({ message: "Username must be 3–20 characters, letters, numbers or _" });

    if (!EMAIL_REGEX.test(cleanEmail))
      return res.status(400).json({ message: "Invalid email format" });

    if (!PASSWORD_REGEX.test(password))
      return res.status(400).json({
        message: "Password must be 8–128 chars, include letters and numbers, and no spaces",
      });

    // 4. Check if user/email exists
    const existing = await User.findOne({
      $or: [{ email: cleanEmail }, { username: cleanUsername }],
    });

    if (existing)
      return res.status(409).json({ message: "User already exists" });

    // 5. Hash password
    const hash = await bcrypt.hash(password, 12);

    // 6. Create user
    const user = await User.create({
      username: cleanUsername,
      fullName: cleanName,
      email: cleanEmail,
      password: hash,
    });

    // 7. Return user info (without password)
    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
    });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

/* ---------- Login ---------- */

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password)
      return res.status(400).json({ msg: "Invalid credentials" });

    // Sanitize login input
    const cleanIdentifier = sanitize(identifier);

    // Decide if email or username
    const query = EMAIL_REGEX.test(cleanIdentifier)
      ? { email: normalizeEmail(cleanIdentifier) }
      : { username: cleanIdentifier };

    // Find user with password
    const user = await User.findOne(query).select("+password");

    // Timing-safe compare to avoid enumeration attacks
    const fakeHash =
      "$2a$12$C9JxYkzjbxH0I5i9Jp9F7e3F4f5xkQ3Y1M4zQXKxjv6XW9fZ1N5Ka";
    const hash = user?.password || fakeHash;

    const match = await bcrypt.compare(password, hash);

    if (!user || !match)
      return res.status(400).json({ msg: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

/* ---------- Get Authenticated User ---------- */

export const getUser = async (req, res) => {
  try {
    if (!req.user?.id)
      return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user.id).select("-password");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user);

  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
