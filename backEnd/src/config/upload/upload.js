// import multer from "multer";
// import { v2 as cloudinary } from "cloudinary";
// import cloudinaryStorage from "multer-storage-cloudinary";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const storage = cloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "bookstore",
//     resource_type: "raw",
//     allowed_formats: ["pdf", "doc", "docx"],
//   },
// });

// export const upload = multer({ storage });
import multer from "multer";
import cloudinaryStorage from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({ secure: true });

const storage = cloudinaryStorage({
  cloudinary,
  params: {
    folder: "bookstore",
    resource_type: "raw",
    allowed_formats: ["pdf", "doc", "docx"],
  },
});

export const upload = multer({ storage });

