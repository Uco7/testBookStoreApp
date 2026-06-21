import express from "express";

const router = express.Router();
import { registerAdmin, loginAdmin } from '../../controller/adminController/adminController.js';

// Map endpoints directly to your controller logic
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

export default router;