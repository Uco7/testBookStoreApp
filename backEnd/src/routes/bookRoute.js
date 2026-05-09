



import express from "express";
import {
  createBook,
  getBooks,
  updateBook,
  deleteBook,
 
} from "../controller/bookController.js";
import upload from "../config/upload/upload.js";
import authMiddleware from "../middleWare/authMiddleWare.js";
import { uploadLimiter } from "../middleWare/limiter.js";


const router = express.Router();

// IMPORTANT: multer must be middleware here
router.post("/create-book", authMiddleware, uploadLimiter, upload.single("file"), createBook);
router.get("/get/all-books", authMiddleware, getBooks);
router.put("/update-book/:id", authMiddleware, uploadLimiter, upload.single("file"), updateBook);
router.delete("/delete-book/:id", authMiddleware, deleteBook);

export default router;
