import express from "express";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";
import {
  createReport,
} from "../controllers/reportController.js";

const router = express.Router();

// @route   POST /api/reports
// @desc    Submit a new report
// @access  Private (Any logged in user)
router.post("/", protect, createReport);





export default router;
