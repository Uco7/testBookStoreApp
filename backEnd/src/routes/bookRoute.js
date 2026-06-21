



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
import {createTimetable,stopTimetable,
  deleteTimetable,
  fetchTimetables,
  getTimetableById,
  reactivateTimetable,
    getTimetableAccessStatus

} from "../controller/userTimetableCont.js"


const router = express.Router();
router.get("/timetable/access-status", authMiddleware, getTimetableAccessStatus);
// IMPORTANT: multer must be middleware here
router.post("/create-book", authMiddleware, uploadLimiter, upload.single("file"), createBook);
router.post(
  "/create/timetable",
  authMiddleware,
  createTimetable
);
router.patch("/stop/timetable/:id",authMiddleware, stopTimetable);
router.patch("/reactivate/timetable/:id", authMiddleware, reactivateTimetable);
router.get("/fetch/timetables/books", authMiddleware, fetchTimetables);
router.get("/fetch/timetable/:id", authMiddleware, getTimetableById);
router.delete("/delete/timetable/:id", authMiddleware, deleteTimetable);
router.get("/get/all-books", authMiddleware, getBooks);
// router.get("/fetch/timetable/books",authMiddleware,fetchUserTimetable)
router.put("/update-book/:id", authMiddleware, uploadLimiter, upload.single("file"), updateBook);
router.delete("/delete-book/:id", authMiddleware, deleteBook);

export default router;



