import express from "express";
import {requestRegistration,verifyAndRegister,login,getUser,forgotPassword,resetPassword } from "../controller/authController.js";
import authMiddleware from "../middleWare/authMiddleWare.js";

const router = express.Router();
router.post("/register/request", requestRegistration);

router.post("/register", verifyAndRegister);
router.post("/login", login);
router.get("/user", authMiddleware, getUser);
router.post("/forgot-password",forgotPassword)
router.post("/reset-password",resetPassword)

export default router; 
