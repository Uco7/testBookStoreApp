import express from "express";
import {
  requestRegisterOTP,
  verifyAndRegister,
  login,
  getUser,
  forgotPassword,
  resetPassword,
  sendTestNotification,
  savePushToken,
  logout,
  deleteAccount
} from "../controller/authController.js";
import { authLimiter } from "../middleWare/limiter.js";


import authMiddleware from "../middleWare/authMiddleWare.js";


const router = express.Router();
router.post("/register/request", authLimiter, requestRegisterOTP);
router.post("/register", authLimiter, verifyAndRegister);
router.post("/login", authLimiter, login);
router.post("/logout", authMiddleware, logout);
router.get("/user", authMiddleware,authLimiter, getUser);

router.post(
  "/save-push-token",
  authLimiter,
  authMiddleware,
  savePushToken
);
router.post(
  "/test-notification",
  authMiddleware,
  sendTestNotification
);

router.post("/forgot-password", authLimiter, forgotPassword)
router.post("/reset-password", authLimiter, resetPassword)
router.delete("/delete-account", authMiddleware, deleteAccount);

// router.get("/app/version", appVersion);
// App version route
// e.g. routes/appVersion.js on your Render backend
router.get("/app-version", (req, res) => {
  res.json({
    minVersion: "1.0.2",
    latestVersion: "1.0.3",
    forceUpdate: false,
    storeUrlAndroid: "https://play.google.com/store/apps/details?id=com.ucmobileapk.bookstore",
    storeUrlIos: "https://apps.apple.com/app/id_YOUR_APP_ID",
    message:
  "📚 BookStore v1.0.3 is now available! Enjoy a cleaner app launch, better performance, and important improvements for a smoother experience."
  });
});
export default router; 
