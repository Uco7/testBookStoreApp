// // routes/subscriptionRoutes.js
// import express from "express";
// const router = express.Router();
// import {
//   initiateSubscription,
//   paystackWebhook,
//   verifySubscription,
// } from "../controller/subscriptionController.js";
// import authMiddleware from "../middleWare/authMiddleWare.js";

// router.get(
//   "/verify/:reference",
//   authMiddleware,
//   verifySubscription
// );

// // payment start
// router.post("/initiate", authMiddleware, initiateSubscription);

// // webhook (NO auth middleware here!)
// router.post("/webhook", paystackWebhook);

// export default router;



import express from "express";
import authMiddleware from "../middleWare/authMiddleWare.js";

import {
  initiateSubscription,
  paystackWebhook,
  verifySubscription,
  getCurrentSubscription,
  getMyTransactions
  
} from "../controller/subscriptionController.js";

const router = express.Router();

// Verify payment after Paystack redirect
router.get(
  "/verify/:reference",
  authMiddleware,
  verifySubscription
);

// Start payment
router.post(
  "/initiate",
  authMiddleware,
  initiateSubscription
);

// Paystack webhook
router.post(
  "/webhook",
  paystackWebhook
);
router.get(
  "/my-transactions",
  authMiddleware,
  getMyTransactions
);

router.get(
  "/current",
 authMiddleware,
  getCurrentSubscription
);

export default router;