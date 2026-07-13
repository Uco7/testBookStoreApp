




// import jwt from "jsonwebtoken";

// export default function authMiddleware(req, res, next) {
//   const authHeader = req.headers.authorization;

//   console.log("AUTH HEADER:", authHeader);

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({
//       message: "No token",
//     });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET
//     );

//     console.log("DECODED TOKEN:", decoded);

//     req.user = decoded;

//     next();
//   } catch (err) {
//     console.log("JWT ERROR:", err.message);

//     return res.status(401).json({
//       message: "Invalid token",
//     });
//   }
// }









import jwt from "jsonwebtoken";
import User from "../models/User.js"; // adjust path to your User model

export default async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();

  } catch (err) {
    // Token expired -> user should no longer show as online
    if (err.name === "TokenExpiredError") {
      const expiredPayload = jwt.decode(token); // decode without verifying, just to get the id

      if (expiredPayload?.id) {
        await User.findByIdAndUpdate(expiredPayload.id, {
          "activityStatus.isOnline": false,
          "activityStatus.lastSeen": new Date(),
        }).catch((e) => console.error("Failed to set offline:", e.message));
      }

      return res.status(401).json({ message: "Token expired" });
    }

    // Any other invalid token
    return res.status(401).json({ message: "Invalid token" });
  }
}