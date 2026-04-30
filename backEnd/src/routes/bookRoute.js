// import express from "express";
// import { uploadBook, getBooks ,updateBook,deleteBook} from "../controller/bookController.js";
// import authMiddleware from "../middleWare/authMiddleWare.js";
// import upload from "../config/upload/upload.js";
// const router = express.Router();

// router.post("/books", authMiddleware, upload.single("file"), uploadBook);
// router.get("/get/books", authMiddleware,getBooks);
// router.delete("/books/:id", authMiddleware, deleteBook);
// router.put("/books/:id", authMiddleware, upload.single("file"), updateBook);


// export default router;



import express from "express";
import {
  createBook,
  getBooks,
  updateBook,
  // deleteBook,
 
} from "../controller/bCont.js";
import upload from "../config/upload/upload.js";
import authMiddleware from "../middleWare/authMiddleWare.js";
import { uploadLimiter } from "../middleWare/limiter.js";


const router = express.Router();

// IMPORTANT: multer must be middleware here
router.post("/create-book", authMiddleware, uploadLimiter, upload.single("file"), createBook);
router.get("/get/all-books", authMiddleware, getBooks);
router.put("/update-book/:id", authMiddleware, uploadLimiter, upload.single("file"), updateBook);
// router.delete("/delete-book/:id", authMiddleware, deleteBook);

export default router;
