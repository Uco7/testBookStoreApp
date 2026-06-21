import { getAllUploadedBooks, getSingleBook, deleteBook } from "../../controller/adminController/adminBookCont.js";
import express from "express";

const router = express.Router();

/**
 * ─────────────────────────────────────────────────────────────────────────
 * FIX: this router previously used router.get("/admin/books", ...) etc.,
 * which assumes the router itself supplies the "/admin/books" prefix. But
 * server.js mounts this router as:
 *
 *   app.use("/api/admin/books", adminBookRoute);
 *
 * ...meaning the prefix is already applied at mount time. With both the
 * mount prefix AND the in-router path both saying "/admin/books", the real
 * resulting path became /api/admin/books/admin/books — broken, and
 * inconsistent with every other admin router (users, timetables,
 * subscriptions), which all correctly use "/" and "/:id" relative paths.
 * Fixed below to match that pattern.
 * ─────────────────────────────────────────────────────────────────────────
 */

// ✅ Handles: GET /api/admin/books
router.get("/", getAllUploadedBooks);

// ✅ Handles: GET /api/admin/books/:id
router.get("/:id", getSingleBook);

// ✅ Handles: DELETE /api/admin/books/:id
router.delete("/:id", deleteBook);

export default router;