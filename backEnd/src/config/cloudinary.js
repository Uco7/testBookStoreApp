// import cloudinary from "cloudinary";
// import dotenv from "dotenv";
// import path from "path";

// dotenv.config({ path: path.resolve(".env") });

// console.log("Cloudinary env check:", {
//   name: process.env.CLOUDINARY_NAME,
//   key: process.env.CLOUDINARY_KEY,
//   secret: process.env.CLOUDINARY_SECRET ? "loaded" : "missing",
// });

// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET,
// });

// // ✅ EXPORT v2 explicitly
// export default cloudinary.v2;

import cloudinary from "cloudinary";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(".env") });

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export default cloudinary.v2; // export the v2 instance

