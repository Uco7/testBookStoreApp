// import multer from "multer";
// import cloudinary from "../cloudinary.js"; // your Cloudinary config
// import MulterCloudinary from "multer-storage-cloudinary"; // import default

// const CloudinaryStorage = MulterCloudinary; // assign the default export

// const storage = CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "bookstore",
//     allowed_formats: ["pdf", "doc", "docx"],
//     resource_type: "raw", // must be 'raw' for docs
//   },
// });

// export const upload = multer({
//   storage,
//   limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
// });




import multer from "multer";
import cloudinary from "../cloudinary.js";
import MulterCloudinary from "multer-storage-cloudinary";

const CloudinaryStorage = MulterCloudinary;

const storage = CloudinaryStorage({
  cloudinary,
  params: {
    folder: "bookstore",
    resource_type: "raw", // must be 'raw' for docs like pdf, docx
    allowed_formats: ["pdf", "doc", "docx"],
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

