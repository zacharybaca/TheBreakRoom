import Job from "../models/Job.js";

// --- HELPER: Normalize Text ---
// Converts "  manager " -> "Manager"
const normalizeJobTitle = (title) => {
  if (!title) return "";
  return title
    .trim()
    .toLowerCase()
    .split(/\s+/) // Splits by any length of whitespace
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ title: 1 }); // sort alphabetically
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private/Admin
export const createJob = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Job title is required" });
    }

    // Normalize the title
    const cleanTitle = normalizeJobTitle(title);

    const existingJob = await Job.findOne({ title: cleanTitle });
    if (existingJob) {
      return res.status(400).json({ message: "Job already exists" });
    }

    const job = await Job.create({ title: cleanTitle, description: description || "" });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private/Admin
export const updateJob = async (req, res) => {
  try {
    const { title, description } = req.body;

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Only normalize if a new title was actually provided
    if (title) {
      job.title = normalizeJobTitle(title);
    }

    if (description !== undefined) {
      job.description = description;
    }

    const updatedJob = await job.save();
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private/Admin
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await job.deleteOne();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
