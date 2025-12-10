import express from "express";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";
import {
  createReport,
  getReports,
  resolveReport
} from "../controllers/reportController.js";

const router = express.Router();

// @route   POST /api/reports
// @desc    Submit a new report
// @access  Private (Any logged in user)
router.post("/", protect, createReport);

// @route   GET /api/reports
// @desc    Get all pending reports
// @access  Admin Only
router.get("/", protect, requireAdmin, getReports);

// @route   PUT /api/reports/:reportId/resolve
// @desc    Resolve a report (Dismiss or Delete Content)
// @access  Admin Only
router.put("/:reportId/resolve", protect, requireAdmin, resolveReport);

export default router;
