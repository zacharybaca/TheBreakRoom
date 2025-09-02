import Job from "../models/Job.js";

export const createJob = async (req, res) => {
    try {
        const { title, description } = req.body;

        const jobExists = await Job.findOne({ $and: [{ title }, { description }]});
        if (jobExists) {
            return res.status(400).json({ message: "Job already exists" });
        }

        const newJob = new Job({ title, description });
        const saved = await newJob.save();

        res.status(201).json({
            _id: saved._id,
            title: saved.title,
            description: saved.description,
        });
    } catch (err) {
        res.status(400).json({ message: "Error creating job", error: err.message });
    }
};

export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ message: "Error fetching jobs", error: err.message });
    }
};

export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        res.status(200).json(job);
    } catch (err) {
        res.status(500).json({ message: "Error fetching job", error: err.message });
    }
};

export const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        const updated = await job.save();

        res.status(200).json({
            _id: updated._id,
            title: updated.title,
            description: updated.description,
        });
    } catch (err) {
        res.status(500).json({ message: "Error updating job", error: err.message });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({ message: "Not authorized to delete this job" });
        }

        await job.deleteOne();
        res.status(200).json({ message: "Job deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting job", error: err.message });
    }
};
