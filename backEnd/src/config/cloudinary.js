// import { v2 as cloudinary } from "cloudinary";
// import dotenv from "dotenv";

// dotenv.config();
// console.log("cloudnary key", process.env.CLOUDINARY_KEY);
// console.log("cloudnary name", process.env.CLOUDINARY_NAME);
// console.log("cloudnary secret", process.env.CLOUDINARY_SECRET);


// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET,
// });

// export default cloudinary;


import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config()
cloudinary.config(
  {
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_SECRET
  }
)
export default cloudinary;