import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";

import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route POST /api/jobs
 * @desc Create a new job
 * @access Private (Admin only)
 */

// Create job (admin only)
router.post("/", protect, requireAdmin, createJob);

/**
 * @route GET /api/jobs
 * @desc Get all jobs
 * @access Public
 */

// Get all jobs
router.get("/", getJobs);

/**
 * @route GET /api/jobs/:id
 * @desc Get job by Id
 * @access Public
 */

// Get job by Id
router.get("/:id", getJobById);

/**
 * @route PUT /api/jobs/:id
 * @desc Update job by Id
 * @access Private (Admin only)
 */

// Update job
router.put("/:id", protect, requireAdmin, updateJob);

/**
 * @route DELETE /api/jobs/:id
 * @desc Delete job by Id
 * @access Private (Admin only)
 */

// Delete job
router.delete("/:id", protect, requireAdmin, deleteJob);

export default router;
