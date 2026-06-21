import express from "express";
const router = express.Router();

import {
  getAllTimetables,
  getSingleTimetableAdmin,
  stopTimetableAdmin,
  deleteTimetableAdmin,
  getTimetableSummary,
} from "../../controller/adminController/adminTimetableController.js";

// ✅ "/summary" must come before "/:id" — otherwise Express matches
// "summary" as if it were a timetable ID and routes it to
// getSingleTimetableAdmin instead (more specific paths first).
router.get("/summary", getTimetableSummary);

// ✅ Handles: GET /api/admin/timetables
router.get("/", getAllTimetables);

// ✅ Handles: GET /api/admin/timetables/:id
router.get("/:id", getSingleTimetableAdmin);

// ✅ Handles: PATCH /api/admin/timetables/:id/stop
router.patch("/:id/stop", stopTimetableAdmin);

// ✅ Handles: DELETE /api/admin/timetables/:id
router.delete("/:id", deleteTimetableAdmin);

export default router;