import { dbconection } from "./config/db.js";

import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoute.js";

const app = express();

app.use(cors());
app.use(express.json());
app.set("trust proxy", true);

app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));


app.use( authRoutes);

app.use( bookRoutes);



dbconection();

app.listen(5000,()=>console.log("Server running on port 5000")); 
