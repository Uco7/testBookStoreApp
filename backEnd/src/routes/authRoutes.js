import express from "express";
import {requestRegistration,verifyAndRegister,login,getUser,forgotPassword,resetPassword } from "../controller/authController.js";
import authMiddleware from "../middleWare/authMiddleWare.js";
// import appVersion from "../config/appVersion.js";

const router = express.Router();
router.post("/register/request", requestRegistration);

router.post("/register", verifyAndRegister);
router.post("/login", login);
router.get("/user", authMiddleware, getUser);
router.post("/forgot-password",forgotPassword)
router.post("/reset-password",resetPassword)
// router.get("/app/version", appVersion);
// App version route
const latestAppInfo = {
  android: {
    version: "1.1.0",
    build: 2,
    otaEnabled: true,
    downloadUrl: "https://github.com/Uco7/testBookStoreApp/releases/download/v1.0.0/application-7ba02d64-8daf-4217-8d6a-8ec56ff85929.apk",
    mandatory: false,
  },
  ios: {
    version: "1.1.0",
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
