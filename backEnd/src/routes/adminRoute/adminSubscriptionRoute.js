import express from "express";
const router = express.Router();

import {
  getAllSubscriptions,
  getSingleSubscription,
  getSubscriptionSummary,
  grantPremiumManually,
} from "../../controller/adminController/adminSubscriptionController.js";


// ✅ "/summary" must come before "/:id" — same route-ordering rule as the
// other admin routers: specific paths first, or Express will try to match
// "summary" as a subscription ID.
router.get("/summary", getSubscriptionSummary);

// ✅ Handles: GET /api/admin/subscriptions
router.get("/", getAllSubscriptions);

// ✅ Handles: GET /api/admin/subscriptions/:id
router.get("/:id", getSingleSubscription);

// ✅ Handles: PATCH /api/admin/subscriptions/:userId/grant-premium
// NOTE: this takes a userId, not a subscription id — it acts directly on
// the User document, since manual grants don't always correspond to an
// existing Subscription record (e.g. webhook never fired, so no record
// exists at all).
router.patch("/:userId/grant-premium", grantPremiumManually);

export default router;