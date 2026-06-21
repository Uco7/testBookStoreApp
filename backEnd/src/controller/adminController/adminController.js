import dotenv from "dotenv";
dotenv.config();

import Admin from "../../models/Admin.js";
import jwt from "jsonwebtoken";

// @desc    Register a new admin
// @route   POST /api/admin/register
export const registerAdmin = async (req, res) => {
  try {
    const { username, email, password, adminSecretCode } = req.body;
    
    console.log("\n--- [START] ADMIN REGISTRATION DEBUG LOGS ---");
    console.log("1. Incoming req.body payload:", { username, email, password, adminSecretCode });

    // Grab configuration secret
    const envSecret = process.env.ADMIN_REGISTRATION_SECRET;

    console.log("2. Comparing Registration Tokens:");
    console.log(`   -> Received from Frontend : "${adminSecretCode}" (Length: ${adminSecretCode ? adminSecretCode.length : 0})`);
    console.log(`   -> Loaded from Backend .env: "${envSecret}" (Length: ${envSecret ? envSecret.length : 0})`);
    
    // Check for strict type/value equivalence match
    const isSecretMatch = adminSecretCode === envSecret;
    console.log(`   -> Do they match exactly? : ${isSecretMatch}`);

    // Detailed breakdown check for hidden quotes inside .env config
    if (!isSecretMatch && envSecret) {
      const cleanEnvSecret = envSecret.replace(/['"]/g, '');
      console.log(`   -> Diagnostic check (Stripping quotes from .env): "${cleanEnvSecret}"`);
      console.log(`   -> Does it match after stripping quotes? : ${adminSecretCode === cleanEnvSecret}`);
    }

    // 1. Verify administrative token from environment variables
    if (!isSecretMatch) {
      console.log("❌ Registration stopped: 403 Unauthorized (Secret key mismatch).");
      console.log("--- [END] DEBUG LOGS ---\n");
      return res.status(403).json({ message: 'Unauthorized: Invalid admin registration token.' });
    }

    // 2. Check if admin already exists
    const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });
    if (existingAdmin) {
      console.log("❌ Registration stopped: 400 Bad Request (Admin user data already exists).");
      console.log("--- [END] DEBUG LOGS ---\n");
      return res.status(400).json({ message: 'Admin username or email already registered.' });
    }

    // 3. Create new Admin instance
    console.log("3. Creating mongoose model record instance...");
    const newAdmin = new Admin({ username, email, password });
    
    // Fire MongoDB save transaction hook
    await newAdmin.save();
    console.log("✅ Admin database record stored cleanly in collection:", newAdmin);
    console.log("--- [END] DEBUG LOGS ---\n");
    
    res.status(201).json({ 
      success: true, 
      message: 'Administrative account created successfully.' 
    });
  } catch (error) {
    console.error("💥 CRITICAL SYSTEM ERROR DURING REGISTRATION:");
    console.error(error);
    console.log("--- [END] DEBUG LOGS ---\n");
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
};

// @desc    Login Admin & get token
// @route   POST /api/admin/login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("\n--- [START] ADMIN LOGIN DEBUG LOGS ---");
    console.log("1. Request parameters:", { email, password: password ? "****" : "empty" });

    // 1. Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log("❌ Login failed: 401 Unauthorized (Email layout pattern matching not found).");
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // 2. Check account status
    if (!admin.isActive) {
      console.log(`❌ Login failed: 403 Forbidden (Account state isActive flag is explicitly ${admin.isActive}).`);
      return res.status(403).json({ message: 'Account deactivated. Contact system administrator.' });
    }

    // 3. Compare passwords using the instance method from our model
    console.log("2. Running model comparison password hook logic verification...");
    const isMatch = await admin.comparePassword(password);
    console.log("   -> Password payload verification valid match status:", isMatch);
    
    if (!isMatch) {
      console.log("❌ Login failed: 401 Unauthorized (Password string values mismatch).");
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // 4. Generate JWT Token
    console.log("3. Sign authentic token signature profile...");
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '1d' }
    );
    
    console.log("✅ Login flow completed successfully for ID:", admin._id);
    console.log("--- [END] DEBUG LOGS ---\n");

    res.status(200).json({
      success: true,
      token,
      admin: { id: admin._id, username: admin.username, email: admin.email, role: admin.role }
    });
  } catch (error) {
    console.error("💥 CRITICAL SYSTEM ERROR DURING LOGIN:");
    console.error(error);
    console.log("--- [END] DEBUG LOGS ---\n");
    res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
};