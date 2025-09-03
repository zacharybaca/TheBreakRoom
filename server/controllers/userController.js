import mongoose from "mongoose";
import User from "../models/User.js";
import Job from "../models/Job.js";
import generateToken from "../utils/generateToken.js";

export const createUser = async (req, res) => {
  try {
    const { name, username, email, password, job } = req.body;

    // Require at least username OR email
    if (!username && !email) {
      return res.status(400).json({
        message: "A username or an email is required to create an account",
      });
    }

    // Check for duplicates
    const userExists = await User.findOne({
      $or: [{ username }, { email }].filter((field) => field),
    });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with that username/email already exists" });
    }

    // Resolve or create Job
    let jobDoc;
    if (!job) {
      return res.status(400).json({ message: "Job is required" });
    }

    if (mongoose.Types.ObjectId.isValid(job)) {
      jobDoc = await Job.findById(job);
      if (!jobDoc) {
        return res.status(400).json({ message: "Job not found" });
      }
    } else {
      // Look for existing job by title
      jobDoc = await Job.findOne({ title: job });
      if (!jobDoc) {
        // Job doesn't exist, create it
        jobDoc = await Job.create({ title: job, description: "" });
      }
    }

    const newUser = new User({
      name,
      username,
      email,
      password,
      job: jobDoc._id,
    });

    const saved = await newUser.save();

    // Populate job for the response
    await saved.populate("job", "title description");

    res.status(201).json({
      _id: saved._id,
      name: saved.name,
      username: saved.username,
      email: saved.email,
      job: saved.job, // full job details
      role: saved.role,
      isAdmin: saved.isAdmin,
      bio: saved.bio,
      avatarUrl: saved.avatarUrl,
      token: generateToken(saved._id, saved.username),
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error creating user", error: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    // explicitly exclude password field
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("job", "title description"); // 👈 get job details
    if (!user) return res.status(404).json({ message: "User not found" });

    // allow self or admin
    if (req.user._id.toString() !== user._id.toString() && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this user" });
    }

    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check permissions (only self or admin)
    const isSelf = req.user._id.toString() === user._id.toString();
    if (!isSelf && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this user" });
    }

    // Define fields user can update vs. admin
    const userAllowedFields = [
      "name",
      "username",
      "email",
      "password",
      "job",
      "bio",
      "gender",
      "avatarUrl",
    ];
    const adminAllowedFields = [...userAllowedFields, "role", "isAdmin"];

    const allowedFields = req.user.isAdmin
      ? adminAllowedFields
      : userAllowedFields;

    // Apply only allowed updates
    Object.keys(req.body).forEach((field) => {
      if (allowedFields.includes(field)) {
        user[field] = req.body[field];
      }
    });

    // Ensure at least username or email exists after update
    if (!user.username && !user.email) {
      return res.status(400).json({
        message: "User must have at least a username or an email",
      });
    }

    // Check duplicates when changing username/email
    if (req.body.username || req.body.email) {
      const conditions = [];
      if (req.body.username) conditions.push({ username: req.body.username });
      if (req.body.email) conditions.push({ email: req.body.email });

      const duplicate = await User.findOne({
        $or: conditions,
        _id: { $ne: user._id }, // exclude self
      });

      if (duplicate) {
        return res.status(400).json({
          message: "Another user already has that username/email",
        });
      }
    }

    const updated = await user.save();

    res.status(200).json({
      _id: updated._id,
      name: updated.name,
      username: updated.username,
      email: updated.email,
      job: updated.job,
      role: updated.role,
      isAdmin: updated.isAdmin,
      bio: updated.bio,
      avatarUrl: updated.avatarUrl,
      token: isSelf ? generateToken(updated._id, updated.username || updated.email) : undefined, // only refresh token for self
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating user", error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check permissions
    if (req.user._id.toString() !== user._id.toString() && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this user" });
    }

    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: err.message });
  }
};
