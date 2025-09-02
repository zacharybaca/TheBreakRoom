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

// Create job (admin only)
router.post("/", protect, requireAdmin, createJob);

// Get all jobs
router.get("/", getJobs);

// Get job by Id
router.get("/:id", getJobById);

// Update job
router.put("/:id", protect, requireAdmin, updateJob);

// Delete job
router.delete("/:id", protect, requireAdmin, deleteJob);

export default router;
