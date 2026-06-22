
import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import crypto from "crypto";
import Subscription from "../models/subscription.js";


import User from "../models/user.js";


const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
export const initiateSubscription = async (req, res) => {
  try {
    const { plan } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    let amount = 0;

    if (plan === "monthly") amount = 200;
    else if (plan === "yearly") amount = 300;
    else return res.status(400).json({ message: "Invalid plan" });

    const reference = `sub_${crypto.randomBytes(12).toString("hex")}`;

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: user.email,
        amount: amount * 100,
        reference,
        metadata: {
          userId: user._id,
          plan,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    await Subscription.create({
      userId: user._id,
      email: user.email,
      plan,
      amount,
      reference,
      status: "pending",
    });

    return res.json({
      authorizationUrl: response.data.data.authorization_url,
      reference,
    });
  } catch (err) {
    console.log(err.response?.data || err.message);
    return res.status(500).json({ message: "Init failed" });
  }
};

// controllers/subscriptionController.js


/**
 * PAYSTACK WEBHOOK
 * IMPORTANT: must use express.raw middleware
 */

// export const paystackWebhook = async (req, res) => {
//   try {
//     console.log("🔥 WEBHOOK HIT");

//     const secret = process.env.PAYSTACK_SECRET_KEY;

//     const hash = crypto
//       .createHmac("sha512", secret)
//       .update(req.body)
//       .digest("hex");

//     const signature = req.headers["x-paystack-signature"];

//     console.log("Generated:", hash);
//     console.log("Received :", signature);

//     if (hash !== signature) {
//       console.log("❌ Invalid Signature");
//       return res.status(401).send("Invalid signature");
//     }

//     const event = JSON.parse(req.body.toString());

//     console.log("EVENT:", event.event);

//     if (event.event !== "charge.success") {
//       return res.status(200).send("Ignored");
//     }

//     const reference = event.data.reference;

//     console.log("Reference:", reference);

//     const subscription = await Subscription.findOne({ reference });

//     if (!subscription) {
//       console.log("❌ Subscription not found");
//       return res.status(200).send("Subscription not found");
//     }

//     if (subscription.status === "success") {
//       console.log("Already processed");
//       return res.status(200).send("Already processed");
//     }

//     subscription.status = "success";
//     subscription.paidAt = new Date();

//     await subscription.save();

//     console.log("✅ Subscription updated");

//     const user = await User.findById(subscription.userId);

//     if (!user) {
//       console.log("❌ User not found");
//       return res.status(200).send("User not found");
//     }

//     const now = new Date();

//     user.premium.isPremium = true;
//     user.premium.premiumPlan = subscription.plan;
//     user.premium.premiumStartedAt = now;

//     if (subscription.plan === "monthly") {
//       user.premium.premiumExpiresAt = new Date(
//         now.getTime() + 30 * 24 * 60 * 60 * 1000
//       );
//     }

//     if (subscription.plan === "yearly") {
//       user.premium.premiumExpiresAt = new Date(
//         now.getTime() + 365 * 24 * 60 * 60 * 1000
//       );
//     }

//     user.premium.adsRemoved = true;

//     await user.save();

//     console.log("✅ User premium activated");

//     return res.status(200).send("OK");
//   } catch (err) {
//     console.log("WEBHOOK ERROR:", err);
//     return res.status(500).send("Webhook failed");
//   }
// };

export const paystackWebhook = async (req, res) => {
  try {
    console.log("🔥 WEBHOOK HIT");

    const event = JSON.parse(req.body.toString());

    console.log("EVENT:", event.event);

    if (event.event !== "charge.success") {
      return res.status(200).send("ignored");
    }

    const reference = event.data.reference;

    const subscription = await Subscription.findOne({ reference });

    if (!subscription) {
      console.log("❌ Not found");
      return res.status(200).send("not found");
    }

    if (subscription.status === "success") {
      return res.status(200).send("already processed");
    }

    subscription.status = "success";
    subscription.paidAt = new Date();
    await subscription.save();

    const user = await User.findById(subscription.userId);

    if (user) {
      const now = new Date();

      user.premium.isPremium = true;
      user.premium.premiumPlan = subscription.plan;
      user.premium.premiumStartedAt = now;

      if (subscription.plan === "monthly") {
        user.premium.premiumExpiresAt = new Date(now.getTime() + 30 * 86400000);
      } else {
        user.premium.premiumExpiresAt = new Date(now.getTime() + 365 * 86400000);
      }

      await user.save();
    }

    console.log("✅ SUCCESS UPDATED");

    return res.status(200).send("ok");
  } catch (err) {
    console.log("WEBHOOK ERROR:", err.message);
    return res.status(500).send("error");
  }
};

export const verifySubscription = async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const payment = response.data.data;

    if (payment.status !== "success") {
      return res.status(400).json({
        message: "Payment not successful",
      });
    }

    const subscription = await Subscription.findOne({ reference });

    if (!subscription) {
      return res.status(404).json({
        message: "Subscription not found",
      });
    }

    if (subscription.status !== "success") {
      subscription.status = "success";
      subscription.paidAt = new Date();

      await subscription.save();

      const user = await User.findById(subscription.userId);

      if (user) {
        const now = new Date();

        user.premium.isPremium = true;
        user.premium.premiumPlan = subscription.plan;
        user.premium.premiumStartedAt = now;

        if (subscription.plan === "monthly") {
          user.premium.premiumExpiresAt = new Date(
            now.getTime() + 30 * 24 * 60 * 60 * 1000
          );
        }

        if (subscription.plan === "yearly") {
          user.premium.premiumExpiresAt = new Date(
            now.getTime() + 365 * 24 * 60 * 60 * 1000
          );
        }

        await user.save();
      }
    }

    return res.json({
      success: true,
    });
  } catch (err) {
    console.log(err.response?.data || err.message);

    return res.status(500).json({
      message: "Verification failed",
    });
  }
};





export const getMyTransactions = async (req, res) => {
  try {
    const transactions = await Subscription.find({
      userId: req.user.id,
    })
      .sort({ createdAt: -1 })
      .select(
        "reference plan amount status paidAt createdAt"
      );

    return res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (err) {
    console.log("Get Transactions Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
    });
  }
};

export const getCurrentSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "premium"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      premium: user.premium,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Failed to fetch subscription",
    });
  }
};