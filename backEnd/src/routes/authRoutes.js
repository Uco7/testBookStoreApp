import express from "express";
import {register,login,getUser } from "../controller/authController.js";
import authMiddleware from "../middleWare/authMiddleWare.js";
// import appVersion from "../config/appVersion.js";

const router = express.Router();
// router.post("/register/request", requestRegistration);

router.post("/register", register);
router.post("/login", login);
router.get("/user", authMiddleware, getUser);
// router.post("/forgot-password",forgotPassword)
// router.post("/reset-password",resetPassword)
// router.get("/app/version", appVersion);
// App version route
const latestAppInfo = {
  android: {
    version: "1.1.0",
    build: 2,
    otaEnabled: true,
    downloadUrl: "https://github.com/Uco7/testBookStoreApp/releases/download/v1.0.0/application-ac525880-6b6b-4523-a41c-1eb0d412f72f.apk",
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
