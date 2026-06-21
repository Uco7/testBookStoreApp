import Subscription from "../../models/subscription.js";
import User from "../../models/user.js";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * ADMIN SUBSCRIPTION CONTROLLER
 * ─────────────────────────────────────────────────────────────────────────
 * Same conventions as your other admin controllers: 404 on empty find(),
 * populate() for related display fields, { message } error shape.
 *
 * IMPORTANT DESIGN NOTE:
 * This is intentionally read-mostly. The Paystack webhook is the only
 * place that should normally flip a subscription's status to "success"
 * and grant premium — that's the one path that's actually verified against
 * Paystack's signature. The one write action here (`grantPremiumManually`)
 * exists for support cases only (e.g. a user paid but the webhook never
 * fired, or fired and failed silently) and is clearly named/logged as a
 * manual override so it's never confused with the normal automated flow.
 * ─────────────────────────────────────────────────────────────────────────
 */

// ─────────────────────────────────────────────────────────────────────────
// GET ALL SUBSCRIPTIONS (admin view, across all users)
// GET /api/admin/subscriptions
// ─────────────────────────────────────────────────────────────────────────
export const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .sort({ createdAt: -1 })
      .populate("userId", "username email fullName");

    if (subscriptions.length === 0) {
      return res.status(404).json({
        message: "No subscription records found",
      });
    }

    return res.status(200).json(subscriptions);
  } catch (err) {
    console.error("Get All Subscriptions Error:", err);
    return res.status(500).json({
      message: err.message || "Internal server error",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────
// GET SINGLE SUBSCRIPTION
// GET /api/admin/subscriptions/:id
// ─────────────────────────────────────────────────────────────────────────
export const getSingleSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findById(id)
      .populate("userId", "username email fullName");

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    return res.status(200).json(subscription);
  } catch (err) {
    console.error("Get Single Subscription Error:", err);

    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Subscription ID format" });
    }

    return res.status(500).json({
      message: err.message || "Internal server error",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────
// REVENUE / SUBSCRIPTION SUMMARY (for the admin dashboard)
// GET /api/admin/subscriptions/summary
// ─────────────────────────────────────────────────────────────────────────
export const getSubscriptionSummary = async (req, res) => {
  try {
    const [
      totalSubscriptions,
      successfulCount,
      pendingCount,
      failedCount,
      revenueAgg,
      monthlyCount,
      yearlyCount,
      lifetimeCount,
    ] = await Promise.all([
      Subscription.countDocuments({}),
      Subscription.countDocuments({ status: "success" }),
      Subscription.countDocuments({ status: "pending" }),
      Subscription.countDocuments({ status: "failed" }),
      // Sum amount only for successful payments — pending/failed never
      // collected real money, so they shouldn't count toward revenue.
      Subscription.aggregate([
        { $match: { status: "success" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Subscription.countDocuments({ status: "success", plan: "monthly" }),
      Subscription.countDocuments({ status: "success", plan: "yearly" }),
      Subscription.countDocuments({ status: "success", plan: "lifetime" }),
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    return res.json({
      totalSubscriptions,
      successfulCount,
      pendingCount,
      failedCount,
      totalRevenue, // in your stored currency unit (Naira, based on the 1500/15000 amounts in initiateSubscription)
      planBreakdown: {
        monthly: monthlyCount,
        yearly: yearlyCount,
        lifetime: lifetimeCount,
      },
    });
  } catch (err) {
    console.error("Get Subscription Summary Error:", err);
    return res.status(500).json({ message: err.message || "Internal server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────
// MANUALLY GRANT PREMIUM (support override — NOT the normal flow)
// PATCH /api/admin/subscriptions/:userId/grant-premium
// Body: { plan: "monthly" | "yearly" | "lifetime" }
// ─────────────────────────────────────────────────────────────────────────
// Use this only when a user genuinely paid (verify in your Paystack
// dashboard first) but the webhook didn't fire or failed to update the
// user record. This bypasses subscription-record creation entirely and
// directly flips the user's premium fields, exactly like the webhook does,
// so behavior stays consistent between the automatic and manual paths.
export const grantPremiumManually = async (req, res) => {
  try {
    const { userId } = req.params;
    const { plan } = req.body;

    if (!["monthly", "yearly", "lifetime"].includes(plan)) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const now = new Date();

    user.premium.isPremium = true;
    user.premium.premiumPlan = plan;
    user.premium.premiumStartedAt = now;

    if (plan === "monthly") {
      user.premium.premiumExpiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    } else if (plan === "yearly") {
      user.premium.premiumExpiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
    } else if (plan === "lifetime") {
      user.premium.premiumExpiresAt = null;
    }

    user.premium.adsRemoved = true;

    await user.save();

    // Logged distinctly from the webhook's own logs so manual overrides
    // are easy to find/audit later if billing questions come up.
    console.log(
      `⚠️ MANUAL PREMIUM GRANT by admin: user=${user.email} plan=${plan} grantedAt=${now.toISOString()}`
    );

    return res.json({
      message: `Premium (${plan}) manually granted to ${user.email}`,
      user: {
        _id: user._id,
        email: user.email,
        premium: user.premium,
      },
    });
  } catch (err) {
    console.error("Grant Premium Manually Error:", err);

    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    return res.status(500).json({ message: err.message || "Internal server error" });
  }
};