import express from "express"
const router = express.Router()
import { getallUsers, getSingleUser, deleteUser,getUserActivityStats } from "../../controller/adminController/userCont.js";

// ✅ Handles: GET /api/admin/users
router.get("/", getallUsers);
router.get("/stats", getUserActivityStats);

// ✅ Handles: GET /api/admin/users/:id
router.get("/:id", getSingleUser);

// ✅ Handles: DELETE /api/admin/users/:id
router.delete("/:id", deleteUser);

export default router;