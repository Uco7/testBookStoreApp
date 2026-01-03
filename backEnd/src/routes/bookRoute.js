import express from "express";
import { uploadBook, getBooks ,updateBook,deleteBook} from "../controller/bookController.js";
import authMiddleware from "../middleWare/authMiddleWare.js";
import { upload } from "../config/upload/upload.js";

const router = express.Router();

router.post("/books", authMiddleware, upload.single("file"), uploadBook);
router.get("/get/books", authMiddleware, getBooks);
router.delete("/books/:id", authMiddleware, deleteBook);
router.put("/books/:id", authMiddleware, upload.single("file"), updateBook);


export default router;
