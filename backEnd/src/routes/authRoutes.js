import express from "express";
import {
  requestRegisterOTP,
  verifyAndRegister,
  login,
  getUser,
  forgotPassword,
  resetPassword,
  sendTestNotification,
  savePushToken
} from "../controller/authController.js";
import { authLimiter } from "../middleWare/limiter.js";


import authMiddleware from "../middleWare/authMiddleWare.js";


const router = express.Router();
router.post("/register/request", authLimiter, requestRegisterOTP);
router.post("/register", authLimiter, verifyAndRegister);
router.post("/login", authLimiter, login);
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
// router.post("/register", register);
// router.post("/login", login);
// router.get("/user", authMiddleware, getUser);
// router.get("/app/version", appVersion);
// App version route
const latestAppInfo = {
  android: {
    version: "1.0.1",
    build: 2,
    otaEnabled: true,
    downloadUrl: "https://github.com/Uco7/testBookStoreApp/releases/download/v1.0.1/application-c93dcff6-ed2f-4166-a293-5c50b55786c0.apk",
    mandatory: false,
  },
  ios: {
    version: "1.0.1",
    build: 2,
    otaEnabled: true,
    downloadUrl: "",
    mandatory: false,
  },
};

router.get("/app/version", (req, res) => {
  const platform = req.query.platform || "android";
  const info = latestAppInfo[platform.toLowerCase()];
  if (!info) return res.status(400).json({ message: "Invalid platform" });
  res.json(info);
});


export default router; 
