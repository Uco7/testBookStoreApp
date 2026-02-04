
import path from "path";
import dotenv from "dotenv";
dotenv.config(); // must be first

import { dbconection } from "./config/db.js";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoute.js";

const app = express();


dbconection();
app.use((req, res, next) => {
  console.log("🔥 INCOMING REQUEST:", req.method, req.url);
  next();
});

app.use(cors());
app.use(express.json());
app.set("trust proxy", true);

app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));
console.log("ENV check:", {
  mongo: process.env.MONGODB_URI,
  jwt: process.env.JWT_SECRET,
  cloud_name: process.env.CLOUDINARY_NAME
});
app.get("/test", (req, res) => {
  console.log("Test route hit");
  res.send("OK");
});

app.use( authRoutes);

app.use( bookRoutes);




app.listen(5000,()=>console.log("Server running on port 5000")); 
