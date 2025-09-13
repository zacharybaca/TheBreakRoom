// controllers/userController.js
import User from "../models/User.js";
import Job from "../models/Job.js";
import Comment from "../models/Comment.js";

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
// Delete user (admin or self)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Only admin or the user themselves can delete
    if (req.user.id !== id && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this user" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Cascade delete: remove all posts and comments by this user
    await Post.deleteMany({ author: user._id });
    await Comment.deleteMany({ author: user._id });

    // Delete user
    await user.deleteOne();

    res.json({
      message: "User and all related posts/comments deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting user:", error.message);
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

// @desc    Upload user avatar
// @route   POST /api/users/:id/avatar
// @access  Private (user or admin)
export const uploadAvatar = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this avatar" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Set avatar URL (public URL served from /uploads)
    user.avatarUrl = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({
      message: "Avatar uploaded successfully",
      avatarUrl: user.avatarUrl,
    });
  } catch (error) {
    console.error("❌ Error uploading avatar:", error.message);
    res.status(500).json({ message: "Error uploading avatar" });
  }
};

// @desc    Update user avatar
// @route   PUT /api/users/:id/avatar
// @access  Private (user or admin)
export const updateUserAvatar = async (req, res) => {
  try {
    const { id } = req.params;

    // Only allow the user themselves or an admin
    if (req.user.id !== id && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this avatar" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Optional: delete old avatar file from disk if it exists
    // (use fs.unlinkSync or fs.promises.unlink, but only if you want to clean up)
    // if (user.avatarUrl) {
    //   const oldPath = path.join(process.cwd(), user.avatarUrl);
    //   try { fs.unlinkSync(oldPath); } catch (err) { console.warn("Could not delete old avatar:", err.message); }
    // }

    // Save new avatar
    user.avatarUrl = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({
      message: "Avatar updated successfully",
      avatarUrl: user.avatarUrl,
    });
  } catch (error) {
    console.error("❌ Error updating avatar:", error.message);
    res
      .status(500)
      .json({ message: "Error updating avatar", error: error.message });
  }
};
