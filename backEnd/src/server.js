
// import path from "path";
// import fs from "fs";
// import { fileURLToPath } from "url";
// import dotenv from "dotenv";

// // Load environment variables early
// dotenv.config();


// import express from "express";
// import cors from "cors";
// import helmet from "helmet"; // Security headers
// import compression from "compression"; // Gzip compression
// import { dbconection } from "./config/db.js";
// import authRoutes from "./routes/authRoutes.js";
// import bookRoutes from "./routes/bookRoute.js";

// // --- ESM Path Setup ---
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const uploadsDir = path.join(__dirname, "uploads");

// // Ensure uploads directory exists
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }

// const app = express();

// // --- DATABASE ---
// dbconection();

// // --- PRODUCTION MIDDLEWARE ---
// app.set("trust proxy", 1); // Required for Render/Cloudflare to get real IPs
// app.use(helmet({ contentSecurityPolicy: false })); // Basic security
// app.use(compression()); // Reduces response body size
// app.use(cors());
// app.use(express.json({ limit: "10mb" })); // Limit JSON body size
// app.use(express.urlencoded({ extended: true }));

// // --- LOGGING (Request Logger) ---
// if (process.env.NODE_ENV !== "production") {
//   app.use((req, res, next) => {
//     console.log(`🔥 [${new Date().toISOString()}] ${req.method} ${req.url}`);
//     next();
//   });
// }

// // --- STATIC FILES ---
// app.use("/files", express.static(uploadsDir));

// // --- ROUTES ---
// app.get("/health", (req, res) => {
//   res.status(200).json({ status: "UP", uptime: process.uptime() });
// });

// app.use("/api/auth", authRoutes);
// app.use("/api/books", bookRoutes);

// // --- 404 HANDLER ---
// app.use((req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });

// // --- GLOBAL ERROR HANDLER (Production Ready) ---
// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   console.error(`❌ ERROR: ${err.message}`);
  
//   res.status(statusCode).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//     stack: process.env.NODE_ENV === "production" ? null : err.stack,
//   });
// });

// // --- SERVER START ---
// const PORT = process.env.PORT || 10000; // Default Render port
// const server = app.listen(PORT, () => {
//   console.log(`🚀 Production server running on port ${PORT}`);
// });

// // --- GRACEFUL SHUTDOWN ---
// process.on("SIGTERM", () => {
//   console.log("SIGTERM received. Shutting down gracefully...");
//   server.close(() => {
//     console.log("Process terminated.");
//   });
// });





import path from "path";
import dotenv from "dotenv";
dotenv.config();

import { dbconection } from "./config/db.js";
import express from "express";
import cors from "cors";
import fs from "fs";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoute.js";
import { uploadsDir } from "./config/path.js";

const app = express();

// =========================
// DATABASE
// =========================
dbconection();

// =========================
// MIDDLEWARE
// =========================
app.use(cors());
app.use(express.json());
app.set("trust proxy", true);

// =========================
// PATH SETUP
// =========================
app.use("/files", express.static(uploadsDir));

// =========================
// LOGGING
// =========================
app.use((req, res, next) => {
  console.log(`🔥 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// =========================
// ROUTES
// =========================
app.get("/test", (req, res) => {
  res.send("OK - Server is Live");
});
// testing front end
// app.use(express.static(path.join(__dirname, "frontEnd")))
// app.use(express.urlencoded({extended:true}))
// app.get("/register",(req,res)=>{
//   res.sendFile(path.join(__dirname,"frontEnd","register.html"))
// })
// testing front end

app.use(authRoutes);
app.use(bookRoutes);

// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Base URL: ${process.env.BASE_URL || "Localhost"}`);
});