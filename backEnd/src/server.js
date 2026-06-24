
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import { dbconection } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoute.js";
import adminUserRoute from "./routes/adminRoute/adminUserRoute.js"
import adminBookRoute from "./routes/adminRoute/adminBookRoute.js"
import { generalLimiter } from "./middleWare/limiter.js";
import  adminRoute from "./routes/adminRoute/adminRoute.js"
// import { reminderWorker } from "./services/reminderWorker.js";
import { reminderWorker  } from "./services/reminderWorker.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import adminTimetableRoute from "./routes/adminRoute/Admintimetableroute.js";

import adminSubscriptionRoute from "./routes/adminRoute/adminSubscriptionRoute.js";
 
// near your other app.use(...) admin route mounts:


// near your other app.use(...) admin route mounts:


const app = express();
// reminderWorker(); // Start the reminder worker

dbconection();

app.use(cors());
app.set("trust proxy", 1);



// ─────────────────────────────────────────────
// WEBHOOK RAW BODY (MUST COME FIRST)
// ─────────────────────────────────────────────
// app.use(
//   "/api/subscription/webhook",
//   express.raw({ type: "application/json" })
// );

app.use(
  "/api/v1/subscription/webhook",
  express.raw({ type: "*/*" })
);

// normal JSON AFTER webhook
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ GLOBAL LIMITER
app.use("/api", generalLimiter);

// logging
app.use((req, res, next) => {
  console.log(`🔥 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// routes
app.get("/test", (req, res) => {
  res.send("OK - Server is Live");
});
// app.use('/api/admin',adminRoute);
// app.use("/api/admin", adminUserRoute);
// app.use("/api/admin", adminBookRoute);


// app.use("/api/admin/subscriptions", adminSubscriptionRoute);
app.use("/api/admin/timetables", adminTimetableRoute);
app.use('/api/admin', adminRoute);          // For general admin configurations
app.use("/api/admin/users", adminUserRoute); // 👈 Direct route for all user actions
app.use("/api/admin/books", adminBookRoute);
app.use(
  "/api/admin/subscriptions",
  adminSubscriptionRoute
);
// app.use("/api/subscription", subscriptionRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/books", bookRoutes);
// API V1 ROUTES
// ─────────────────────────────
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/subscription", subscriptionRoutes);



app.use(
  cors({
    origin: [
      "https://bookstore-admin.onrender.com",
      "http://localhost:5173"
    ],
    credentials: true,
  })
);


const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});