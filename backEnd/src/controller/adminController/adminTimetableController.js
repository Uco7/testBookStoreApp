import UserTimetable from "../../models/userTimetable.js";
import mongoose from "mongoose";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * ADMIN TIMETABLE CONTROLLER
 * ─────────────────────────────────────────────────────────────────────────
 * Mirrors the conventions already used in your admin user/book controllers:
 *   - 404 when a find() returns an empty array (not a 200 with [])
 *   - populate() to bring in related, display-safe fields only
 *   - consistent error shape: { message }
 *
 * KEY DIFFERENCE FROM THE USER-FACING TIMETABLE CONTROLLER:
 * The user-facing controller scopes every query to `userId: req.user.id`,
 * because a regular user should only ever see/touch their own timetables.
 * Here, admin routes intentionally have NO such scoping — an admin needs
 * to see and act on every user's timetables, not just their own. This is
 * the correct and necessary difference, not an oversight — just flagging
 * it so it's not "fixed" into matching the user-facing version later.
 * ─────────────────────────────────────────────────────────────────────────
 */

// ─────────────────────────────────────────────────────────────────────────
// GET ALL TIMETABLES (admin view, across all users)
// GET /api/admin/timetables
// ─────────────────────────────────────────────────────────────────────────
export const getAllTimetables = async (req, res) => {
  try {
    const timetables = await UserTimetable.find()
      .sort({ createdAt: -1 })
      .populate("userId", "username email fullName")
      .populate("bookId", "title");

    if (timetables.length === 0) {
      return res.status(404).json({
        message: "No timetable records found",
      });
    }

    return res.status(200).json(timetables);
  } catch (err) {
    console.error("Get All Timetables Error:", err);
    return res.status(500).json({
      message: err.message || "Internal server error",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────
// GET SINGLE TIMETABLE (admin view)
// GET /api/admin/timetables/:id
// ─────────────────────────────────────────────────────────────────────────
export const getSingleTimetableAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const timetable = await UserTimetable.findById(id)
      .populate("userId", "username email fullName")
      .populate("bookId", "title");

    if (!timetable) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    return res.status(200).json(timetable);
  } catch (err) {
    console.error("Get Single Timetable (admin) Error:", err);

    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Timetable ID format" });
    }

    return res.status(500).json({
      message: err.message || "Internal server error",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────
// STOP TIMETABLE (admin action, any user's timetable)
// PATCH /api/admin/timetables/:id/stop
// ─────────────────────────────────────────────────────────────────────────
// NOTE: this does not cancel any queued background jobs (jobIds), matching
// a gap that already exists in the user-facing stopTimetable controller —
// `reminderQueue` is referenced there but never imported. If you want this
// admin action to also clear queued jobs, that gap needs fixing in both
// places together, since they'd share the same job-cancellation logic.
export const stopTimetableAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const timetable = await UserTimetable.findById(id);
    if (!timetable) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    timetable.isActive = false;
    timetable.deviceScheduleVersion = (timetable.deviceScheduleVersion || 1) + 1;
    timetable.lastSyncedAt = new Date();
    timetable.localAlarmPayload = null;

    await timetable.save();

    return res.json({ message: "Timetable stopped by admin", timetable });
  } catch (err) {
    console.error("Stop Timetable (admin) Error:", err);

    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Timetable ID format" });
    }

    return res.status(500).json({ message: err.message || "Internal server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────
// DELETE TIMETABLE (admin action, any user's timetable)
// DELETE /api/admin/timetables/:id
// ─────────────────────────────────────────────────────────────────────────
export const deleteTimetableAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTimetable = await UserTimetable.findByIdAndDelete(id);

    if (!deletedTimetable) {
      return res.status(404).json({
        message: "Timetable not found or already deleted",
      });
    }

    return res.status(200).json({
      message: "Timetable deleted successfully by admin",
    });
  } catch (err) {
    console.error("Delete Timetable (admin) Error:", err);

    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Timetable ID format" });
    }

    return res.status(500).json({ message: err.message || "Internal server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────
// TIMETABLE SUMMARY (counts for the admin dashboard)
// GET /api/admin/timetables/summary
// ─────────────────────────────────────────────────────────────────────────
export const getTimetableSummary = async (req, res) => {
  try {
    const [
      totalTimetables,
      activeTimetables,
      stoppedTimetables,
      regularReminders,
      premiumReminders,
    ] = await Promise.all([
      UserTimetable.countDocuments({}),
      UserTimetable.countDocuments({ isActive: true }),
      UserTimetable.countDocuments({ isActive: false }),

      UserTimetable.countDocuments({
        planType: "regular",
      }),

      UserTimetable.countDocuments({
        planType: "premium",
      }),
    ]);

    return res.status(200).json({
      totalTimetables,

      activeTimetables,
      stoppedTimetables,

      totalRegularReminders: regularReminders,
      totalPremiumReminders: premiumReminders,

      totalReminders:
        regularReminders + premiumReminders,
    });
  } catch (err) {
    console.error("Get Timetable Summary Error:", err);

    return res.status(500).json({
      message: err.message || "Internal server error",
    });
  }
};