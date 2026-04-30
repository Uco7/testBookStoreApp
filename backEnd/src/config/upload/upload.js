// import multer from "multer";

// const storage = multer.memoryStorage();

// const allowedMimeTypes = [
//   "application/pdf",
//   "application/msword",
//   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//   "application/vnd.ms-powerpoint",
//   "application/vnd.openxmlformats-officedocument.presentationml.presentation",
//   "image/jpeg",
//   "image/png"
// ];

// // ✅ File validation belongs here
// const fileFilter = (req, file, cb) => {
//   if (!allowedMimeTypes.includes(file.mimetype)) {
//     return cb(new Error("Invalid file type"), false);
//   }

//   cb(null, true);
// };

// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 20 * 1024 * 1024 // 20MB
//   },
//   fileFilter
// });

// export default upload;
import multer from "multer";
import os from "os";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir());
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const allowedMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg",
  "image/png"
];

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB safer for Render
  },
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"), false);
    }
    cb(null, true);
  }
});

export default upload;