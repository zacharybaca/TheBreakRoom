import mongoose from "mongoose";
import Job from "../models/Job.js";
import User from "../models/User.js"; // if we want to prevent deletes

// Create Job
export const createJob = async (req, res) => {
  try {
    let { title, description, category } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Job title is required" });
    }

    title = title.trim();

    const jobExists = await Job.findOne({ title: new RegExp(`^${title}$`, "i") });
    if (jobExists) {
      return res.status(400).json({ message: "Job already exists" });
    }

    const newJob = new Job({ title, description, category });
    const saved = await newJob.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Error creating job", error: err.message });
  }
};

// Get all Jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .select("title description category createdAt updatedAt")
      .lean();
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs", error: err.message });
  }
};

// Get Job by ID
export const getJobById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Job ID" });
    }

    const job = await Job.findById(req.params.id).lean();
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ message: "Error fetching job", error: err.message });
  }
};

// Update Job
export const updateJob = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Job ID" });
    }

    const { title, description, category } = req.body;
    const updateData = { title, description, category };

    if (title) updateData.title = title.trim();

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!updatedJob) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(updatedJob);
  } catch (err) {
    res.status(500).json({ message: "Error updating job", error: err.message });
  }
};

// Delete Job
export const deleteJob = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Job ID" });
    }

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // OPTIONAL: prevent deleting if users are assigned
    const assignedUsers = await User.countDocuments({ job: job._id });
    if (assignedUsers > 0) {
      return res.status(400).json({ message: "Cannot delete job while users are assigned to it" });
    }

    await job.deleteOne();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting job", error: err.message });
  }
};
