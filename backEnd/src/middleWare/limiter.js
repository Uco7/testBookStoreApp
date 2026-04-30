import rateLimit from "express-rate-limit";

// 🌐 General API limiter
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests, try again later"
  }
});

// 📦 Strict limiter for uploads (VERY IMPORTANT)
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // uploads are expensive
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many uploads, slow down"
  }
});

// 🔐 Auth limiter (prevent brute force)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many login attempts"
  }
});