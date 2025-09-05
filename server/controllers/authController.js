// authController.js
import mongoose from "mongoose";
import User from "../models/User.js";
import Job from "../models/Job.js";
import generateToken from "../utils/generateToken.js";

// Login existing user
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // username OR email

    if (!identifier || !password) {
      return res.status(400).json({ message: "Identifier and password are required" });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    })
      .select("+password")
      .populate("job", "title description");

    if (!user) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
      job: user.job,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      token: generateToken(user._id, user.username),
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

// Register new user (admin-only creation can be handled via userController if needed)
export const register = async (req, res) => {
  try {
    const { username, password, name, avatarUrl, job } = req.body;

    if (!username && !name) {
      return res.status(400).json({ message: "Username and name are required" });
    }

    // Check duplicates
    const userExists = await User.findOne({
      $or: [{ username }, { email: req.body.email }].filter(Boolean),
    });
    if (userExists) {
      return res.status(400).json({ message: "User with that username/email already exists" });
    }

    if (!job) {
      return res.status(400).json({ message: "Job is required" });
    }

    let jobDoc;
    if (mongoose.Types.ObjectId.isValid(job)) {
      jobDoc = await Job.findById(job);
      if (!jobDoc) {
        return res.status(400).json({ message: "Job not found" });
      }
    } else {
      jobDoc = await Job.findOne({ title: job });
      if (!jobDoc) {
        jobDoc = await Job.create({ title: job, description: "" });
      }
    }

    const newUser = new User({
      username,
      password,
      name,
      avatarUrl,
      job: jobDoc._id,
    });

    const saved = await newUser.save();
    await saved.populate("job", "title description");

    res.status(201).json({
      _id: saved._id,
      name: saved.name,
      username: saved.username,
      email: saved.email,
      job: saved.job,
      role: saved.role,
      isAdmin: saved.isAdmin,
      bio: saved.bio,
      avatarUrl: saved.avatarUrl,
      token: generateToken(saved._id, saved.username),
    });
  } catch (err) {
    res.status(400).json({ message: "Error registering user", error: err.message });
  }
};
