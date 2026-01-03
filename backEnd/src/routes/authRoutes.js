import express from "express";
import { register, login, getUser } from "../controller/authController.js";
import authMiddleware from "../middleWare/authMiddleWare.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user", authMiddleware, getUser);

export default router; 
