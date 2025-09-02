import Job from "../models/Job.js";

// Create Job
export const createJob = async (req, res) => {
  try {
    const { title, description } = req.body;

    const jobExists = await Job.findOne({ title });
    if (jobExists) {
      return res.status(400).json({ message: "Job already exists" });
    }

    const newJob = new Job({ title, description });
    const saved = await newJob.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Error creating job", error: err.message });
  }
};

// Get all Jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().select("title description createdAt updatedAt");
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs", error: err.message });
  }
};

// Get Job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ message: "Error fetching job", error: err.message });
  }
};

// Update Job
export const updateJob = async (req, res) => {
  try {
    const { title, description } = req.body;
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true, runValidators: true }
    );

    if (!updatedJob) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(updatedJob);
  } catch (err) {
    res.status(500).json({ message: "Error updating job", error: err.message });
  }
};

// Delete Job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await job.deleteOne();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting job", error: err.message });
  }
};
