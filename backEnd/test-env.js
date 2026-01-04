import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve("./.env"), override: true });

console.log("ENV TEST:", {
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
  CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET
});

cloud_name: "ddjhnneps",
  api_key: "487562887228916",
  api_secret: "ZFIBfBZYMAgH-EK7ckutJNiiX6c", // match exactly