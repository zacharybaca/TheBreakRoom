// controllers/userController.js
import User from "../models/User.js";
import Job from "../models/Job.js";

// @desc    Create a new user (Admin only)
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (req, res) => {
  try {
    const { username, password, isAdmin, jobTitle } = req.body;

    // Check if username already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Handle job: either select existing or create new
    let job = await Job.findOne({ title: jobTitle });
    if (!job) {
      job = await Job.create({ title: jobTitle });
    }

    // Create user
    const user = await User.create({
      username,
      password,
      isAdmin: isAdmin || false,
      job: job._id,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
        job: job.title,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in createUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("job", "title");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get user by ID (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("job", "title");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const { username, password, isAdmin, jobTitle } = req.body;

    const user = await User.findById(req.params.id);

    if (user) {
      user.username = username || user.username;
      if (password) {
        user.password = password;
      }
      user.isAdmin = isAdmin !== undefined ? isAdmin : user.isAdmin;

      if (jobTitle) {
        let job = await Job.findOne({ title: jobTitle });
        if (!job) {
          job = await Job.create({ title: jobTitle });
        }
        user.job = job._id;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        isAdmin: updatedUser.isAdmin,
        job: jobTitle || (await Job.findById(updatedUser.job)).title,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error in updateUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.deleteOne();
      res.json({ message: "User removed" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
