import UserTimetable from "../models/userTimetable.js";
import User from "../models/user.js";
import Book from "../models/book.js";
import { scheduleTimetableJobs,cancelTimetableJobs } from "../services/scheduleTimetableJobs.js";
import mongoose from "mongoose";
import sanitizeHtml from "sanitize-html";



const notificationMessageRegex = /^[A-Za-z0-9\s.,'"\-?!()]{0,2000}$/;
const textRegex = /^[A-Za-z0-9\s.,'"\-?!()@:/]*$/;

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const BONUS_DAYS        = 30;   // free welcome period in days
const GRACE_DAYS        = 3;    // grace period after bonus expires
const GRACE_MAX_TABLES  = 3;    // max timetables allowed during grace period
const AD_WINDOW_HOURS   = 24;   // rewarded-ad unlock window duration
const AD_MAX_PER_WINDOW = 3;    // max timetables per ad-unlock window

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** True if the user has an active paid subscription or active trial. */
const hasPaidAccess = (user) => {
  const now = new Date();
  const p   = user.premium;
  if (!p) return false;
  if (p.isPremium && p.premiumPlan === "lifetime") return true;
  if (p.isPremium && p.premiumExpiresAt && new Date(p.premiumExpiresAt) > now) return true;
  if (p.trialExpiresAt && new Date(p.trialExpiresAt) > now) return true;
  return false;
};

/**
 * Derives the user's current access phase based on welcomeBonus dates
 * and the total number of timetables they have created.
 *
 * Returns one of:
 *   "bonus"       — within the 30-day free window  → no gates
 *   "grace"       — within the 3-day grace window   → warn, cap at GRACE_MAX_TABLES
 *   "restricted"  — after grace period              → must watch ad or subscribe
 *   "fresh"       — never created a timetable yet   → treat same as bonus
 */
const getAccessPhase = (user, totalTimetables) => {
  const wb = user.welcomeBonus;

  // No timetable created yet — first one is always free
  if (!wb?.bonusStartedAt) return "fresh";

  const now = new Date();

  if (now <= new Date(wb.bonusExpiresAt))    return "bonus";
  if (now <= new Date(wb.gracePeriodEndsAt)) return "grace";
  return "restricted";
};

/**
 * Initialises the welcomeBonus dates on the user document.
 * Called only once — the first time a timetable is created.
 */
const initWelcomeBonus = (user) => {
  const now              = new Date();
  const bonusExpiry      = new Date(now.getTime() + BONUS_DAYS * 24 * 60 * 60 * 1000);
  const gracePeriodEnd   = new Date(bonusExpiry.getTime() + GRACE_DAYS * 24 * 60 * 60 * 1000);

  user.welcomeBonus = {
    bonusStartedAt:    now,
    bonusExpiresAt:    bonusExpiry,
    gracePeriodEndsAt: gracePeriodEnd,
  };
};

/**
 * Validates a rewarded-ad unlock and increments the server-side counter.
 * Returns { allowed: boolean, message?: string }
 */
const handleAdUnlock = async (user) => {
  const now    = Date.now();
  const unlock = user.adUnlock || { unlockedAt: null, count: 0 };

  const hoursSince = unlock.unlockedAt
    ? (now - new Date(unlock.unlockedAt).getTime()) / (1000 * 60 * 60)
    : 999;

  if (hoursSince > AD_WINDOW_HOURS) {
    // Previous window expired — start a fresh window
    user.adUnlock = { unlockedAt: new Date(), count: 1 };
    await user.save();
    return { allowed: true };
  }

  if ((unlock.count || 0) >= AD_MAX_PER_WINDOW) {
    return {
      allowed: false,
      message: "Ad unlock limit reached. Watch another ad to continue.",
    };
  }

  user.adUnlock.count = (unlock.count || 0) + 1;
  await user.save();
  return { allowed: true };
};

// ─────────────────────────────────────────────────────────────────────────────
// CREATE TIMETABLE
// ─────────────────────────────────────────────────────────────────────────────
export const createTimetable = async (req, res) => {
  try {
    const {
      bookId,
      noticeCount,
      reminderTime,
      reminderType,
      studyDays,
      timetableType,
      notificationMessage,
       scheduleKind, // NEW

    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const book = await Book.findById(bookId).select("title");
    if (!book) return res.status(404).json({ message: "Book not found" });
     // NEW: validate scheduleKind, default to "timetable"
    const validScheduleKinds = ["timetable", "reminder"];
    const resolvedScheduleKind = validScheduleKinds.includes(scheduleKind)
      ? scheduleKind
      : "timetable";

    // Total timetables this user has ever created
    const totalTimetables = await UserTimetable.countDocuments({ userId: req.user.id });

    // ── WELCOME BONUS: initialise on very first timetable ───────────────────
    const isFirstTimetable = !user.welcomeBonus?.bonusStartedAt;
    if (isFirstTimetable) {
      initWelcomeBonus(user);
      await user.save();
    }

    // ── ACCESS PHASE CHECK ──────────────────────────────────────────────────
    const phase = getAccessPhase(user, totalTimetables);

    if (phase === "grace") {
      // Grace period: allow up to GRACE_MAX_TABLES total, then gate
      if (totalTimetables >= GRACE_MAX_TABLES && !hasPaidAccess(user)) {
        const adUnlockHeader = req.headers["x-ad-unlock"] === "true";

        if (!adUnlockHeader) {
          return res.status(403).json({
            message: "Grace period limit reached",
            phase: "grace_limit",
            gracePeriodEndsAt: user.welcomeBonus.gracePeriodEndsAt,
          });
        }

        const adResult = await handleAdUnlock(user);
        if (!adResult.allowed) {
          return res.status(403).json({
            message: adResult.message,
            phase: "ad_limit",
          });
        }
      }
    }

    if (phase === "restricted") {
      // Bonus and grace both expired — must have paid access or ad unlock
      if (!hasPaidAccess(user)) {
        const adUnlockHeader = req.headers["x-ad-unlock"] === "true";

        if (!adUnlockHeader) {
          return res.status(403).json({
            message: "Free period ended. Watch an ad or subscribe to continue.",
            phase: "restricted",
          });
        }

        const adResult = await handleAdUnlock(user);
        if (!adResult.allowed) {
          return res.status(403).json({
            message: adResult.message,
            phase: "ad_limit",
          });
        }
      }
    }

    // ── PREMIUM PLAN MODE ───────────────────────────────────────────────────
    // During bonus/grace phases, premium plan features are free.
    // After restriction, timetableType === "premium" requires paid/ad access
    // (already gated above). Here we just set the correct mode.
    let mode = "notification";

    if (timetableType === "premium") {
      // Extra guard: during restricted phase without paid access and no ad header
      // this would already have been rejected above, so we can safely set alarm.
      mode = "alarm";
      
    }
 if(notificationMessage!=null){
                const trimed=notificationMessage.trim()
              if (notificationMessage && typeof notificationMessage !== "string") {
  return res.status(400).json({
    message: "Invalid description field",
  });
}

const trimmed = notificationMessage?.trim();

if (trimmed && trimmed.length > 250) {
  return res.status(400).json({
    message: "Description too long",
  });
}
        
    }

    const cleanDescription=notificationMessage?sanitizeHtml(notificationMessage,{
                    allowedTags:[],
                    allowedAttributes:{}
                }):""

    // ── CREATE ──────────────────────────────────────────────────────────────
    const timetable = await UserTimetable.create({
      userId:              req.user.id,
      bookId,
      noticeCount,
      scheduleKind:        resolvedScheduleKind, // NEW
      reminderTime,
      reminderType,
      studyDays,
      planType:            timetableType,
      mode,
      deliveryMode:        "hybrid",
      offlineEnabled:      true,
      notificationMessage,
      enableAlarmSound:    mode === "alarm",
      soundName:           mode === "alarm" ? "alarm_sound" : null,
      isActive:            true,
      jobIds:              [],
    });

    // ── RESPONSE ─────────────────────────────────────────────────────────────
    // Include bonus/phase info so the client can update its UI immediately
    res.status(201).json({
      message:   "Timetable created",
        bookTitle: book.title,          // ← added

      timetable,
      accessInfo: {
        phase,
        bonusExpiresAt:    user.welcomeBonus?.bonusExpiresAt    || null,
        gracePeriodEndsAt: user.welcomeBonus?.gracePeriodEndsAt || null,
        totalTimetables:   totalTimetables + 1,
        graceMaxTables:    GRACE_MAX_TABLES,
      },
    });

    // ── BACKGROUND JOB (non-blocking) ────────────────────────────────────────
    setImmediate(async () => {
      try {
        const jobIds = await scheduleTimetableJobs({
          _id:                 timetable._id,
          userId:              req.user.id,
          reminderTime,
          noticeCount,
          studyDays,
          reminderType,
          mode,
          bookTitle:           book.title,
          notificationMessage,
        });

        await UserTimetable.updateOne(
          { _id: timetable._id },
          { $set: { jobIds } }
        );
      } catch (err) {
        console.log("❌ Background job error:", err.message);
      }
    });

  } catch (err) {
    console.log("createTimetable error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET ACCESS STATUS  (used by client to determine which UI to show)
// GET /api/books/timetable/access-status
// ─────────────────────────────────────────────────────────────────────────────
export const getTimetableAccessStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const totalTimetables = await UserTimetable.countDocuments({ userId: req.user.id });
    const phase           = getAccessPhase(user, totalTimetables);
    const paid            = hasPaidAccess(user);

    return res.json({
      phase,                 // "fresh" | "bonus" | "grace" | "restricted"
      isPaidUser:     paid,
      totalTimetables,
      graceMaxTables: GRACE_MAX_TABLES,
      bonusExpiresAt:    user.welcomeBonus?.bonusExpiresAt    || null,
      gracePeriodEndsAt: user.welcomeBonus?.gracePeriodEndsAt || null,
      // How many days remain in the current phase (for UI countdown)
      daysRemaining: (() => {
        if (phase === "bonus") {
          return Math.max(
            0,
            Math.ceil(
              (new Date(user.welcomeBonus.bonusExpiresAt) - new Date()) /
              (1000 * 60 * 60 * 24)
            )
          );
        }
        if (phase === "grace") {
          return Math.max(
            0,
            Math.ceil(
              (new Date(user.welcomeBonus.gracePeriodEndsAt) - new Date()) /
              (1000 * 60 * 60 * 24)
            )
          );
        }
        return 0;
      })(),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// FETCH ALL TIMETABLES
// ─────────────────────────────────────────────────────────────────────────────
export const fetchTimetables = async (req, res) => {
  try {
    const timetables = await UserTimetable.find({ userId: req.user.id })
      .populate("bookId")
      .sort({ createdAt: -1 });

    return res.json({
      timetables,
      offlineReady: timetables.filter((t) => t.offlineEnabled),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET SINGLE TIMETABLE
// ─────────────────────────────────────────────────────────────────────────────
export const getTimetableById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const timetable = await UserTimetable.findOne({
      _id: id,
      userId: req.user.id,
    }).populate("bookId");

    if (!timetable) return res.status(404).json({ message: "Timetable not found" });

    return res.json(timetable);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE TIMETABLE
// ─────────────────────────────────────────────────────────────────────────────
// export const deleteTimetable = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const timetable = await UserTimetable.findOneAndDelete({
//       _id: id,
//       userId: req.user.id,
//     });

//     if (!timetable) return res.status(404).json({ message: "Not found" });

//     return res.json({ message: "Timetable deleted successfully" });
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };
export const deleteTimetable = async (req, res) => {
  try {
    const { id } = req.params;

    const timetable = await UserTimetable.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!timetable) return res.status(404).json({ message: "Not found" });

    await cancelTimetableJobs(id);

    return res.json({ message: "Timetable deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


// ─────────────────────────────────────────────────────────────────────────────
// STOP TIMETABLE
// ─────────────────────────────────────────────────────────────────────────────
// export const stopTimetable = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const timetable = await UserTimetable.findOne({ _id: id, userId: req.user.id });
//     if (!timetable) return res.status(404).json({ message: "Not found or unauthorized" });

//     timetable.isActive = false;

//     if (timetable.jobIds?.length) {
//       for (const jobId of timetable.jobIds) {
//         try {
//           const job = await reminderQueue.getJob(jobId);
//           if (job) await job.remove();
//         } catch (e) {
//           console.log("Job remove error:", e.message);
//         }
//       }
//     }

//     timetable.jobIds                = [];
//     timetable.deviceScheduleVersion = (timetable.deviceScheduleVersion || 1) + 1;
//     timetable.lastSyncedAt          = new Date();
//     timetable.localAlarmPayload     = null;

//     await timetable.save();

//     return res.json({ message: "Timetable stopped successfully", timetable });
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// ─────────────────────────────────────────────────────────────────────────────
export const stopTimetable = async (req, res) => {
  try {
    const { id } = req.params;

    const timetable = await UserTimetable.findOne({ _id: id, userId: req.user.id });
    if (!timetable) return res.status(404).json({ message: "Not found or unauthorized" });

    timetable.isActive = false;

    await cancelTimetableJobs(id);

    timetable.jobIds                = [];
    timetable.deviceScheduleVersion = (timetable.deviceScheduleVersion || 1) + 1;
    timetable.lastSyncedAt          = new Date();
    timetable.localAlarmPayload     = null;

    await timetable.save();

    return res.json({ message: "Timetable stopped successfully", timetable });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


// ─────────────────────────────────────────────────────────────────────────────
// REACTIVATE TIMETABLE
// ─────────────────────────────────────────────────────────────────────────────
export const reactivateTimetable = async (req, res) => {
  try {
    const timetable = await UserTimetable.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!timetable) return res.status(404).json({ message: "Not found" });

    const book = await Book.findById(timetable.bookId).select("title");

    timetable.isActive              = true;
    timetable.deviceScheduleVersion += 1;
    timetable.lastSyncedAt          = new Date();
    timetable.localAlarmPayload     = {
      timetableId:  timetable._id,
      title:        `⏰ Study time: ${book.title}`,
      body:         timetable.notificationMessage,
      reminderTime: timetable.reminderTime,
      studyDays:    timetable.studyDays,
      noticeCount:  timetable.noticeCount,
      sound:        timetable.enableAlarmSound ? "alarm_sound.wav" : "default",
    };

    const jobIds = await scheduleTimetableJobs({
      _id:                 timetable._id,
      userId:              req.user.id,
      reminderTime:        timetable.reminderTime,
      noticeCount:         timetable.noticeCount,
      studyDays:           timetable.studyDays,
      reminderType:        timetable.reminderType,
      mode:                timetable.mode,
      bookTitle:           book.title,
      notificationMessage: timetable.notificationMessage,
    });

    timetable.jobIds = jobIds;
    await timetable.save();

    return res.json({ message: "Timetable reactivated",
        bookTitle: book.title,          // ← added
      timetable });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET OFFLINE TIMETABLES
// ─────────────────────────────────────────────────────────────────────────────
export const getOfflineTimetables = async (req, res) => {
  try {
    const data = await UserTimetable.find({
      userId:         req.user.id,
      offlineEnabled: true,
      isActive:       true,
    }).populate("bookId");

    return res.json({ timetables: data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};