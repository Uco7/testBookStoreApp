// src/config/upload/upload.js
import multer from "multer";

// Store uploaded file in memory (buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
