import express from "express";
import Job from "../models/Job.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create job (admin only)
router.post("/", protect, requireAdmin, async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all jobs
router.get("/", async (req, res) => {
  const jobs = await Job.find({ isActive: true });
  res.json(jobs);
});

export default router;
