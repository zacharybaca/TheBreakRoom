import User from "../models/User.js";
import Job from "../models/Job.js";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js"; // <--- ADDED THIS (Required for deleteUser)

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
      role: isAdmin ? "admin" : "user", // Sync role with isAdmin flag
      isAdmin: isAdmin || false,
      job: job._id,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
        role: user.role,
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

      // Update both isAdmin and Role to keep them in sync
      if (isAdmin !== undefined) {
        user.isAdmin = isAdmin;
        user.role = isAdmin ? "admin" : "user";
      }

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
        role: updatedUser.role,
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

// @desc    Delete user (Admin or Self)
// @route   DELETE /api/users/:id
// @access  Private
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
    await Post.deleteMany({ authorId: user._id }); // Note: Ensure your Post model uses 'authorId' or 'author'
    await Comment.deleteMany({ authorId: user._id }); // Same for Comment

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
// @access  Private
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
// @access  Private
export const updateUserAvatar = async (req, res) => {
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

// --- NEW FUNCTION ADDED BELOW ---

// @desc    Ban or Unban a user
// @route   PUT /api/users/:id/ban
// @access  Admin Only
export const banUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { banReason } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Safety: Prevent banning other admins
    // Checks both role and isAdmin flag for safety
    if (user.role === "admin" || user.isAdmin) {
      return res.status(400).json({ message: "You cannot ban another admin." });
    }

    // Toggle ban status
    user.isBanned = !user.isBanned;

    // Save reason if banning
    if (user.isBanned) {
      user.banReason = banReason || "Violation of community guidelines";
    } else {
      user.banReason = undefined; // Clear reason on unban
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: user.isBanned
        ? `User ${user.username} has been banned.`
        : `User ${user.username} has been unbanned.`,
      isBanned: user.isBanned,
    });
  } catch (err) {
    console.error("❌ Error banning user:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// @desc    User Requests Reactivation of Account
// @route   POST /api/users/:id/request-reactivation
// @access  Public

// 1. User requests help (Public Route)
export const requestReactivation = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isActive) return res.status(400).json({ message: "Account is already active." });

    user.reactivationRequested = true;
    await user.save();

    res.status(200).json({ message: "Reactivation request sent to admins." });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin(s) Retrieve User Requests for Account Reactivation
// @route   GET /api/admin/reactivation-requests
// @access  Admin Only

// 2. Admin fetches queue
export const getReactivationRequests = async (req, res, next) => {
  try {
    // Find users who are inactive AND have requested help
    const users = await User.find({ isActive: false, reactivationRequested: true })
      .select('name username email lastActive avatarUrl job');

    res.json(users);
  } catch (err) {
    next(err);
  }
};

// @desc    Admin(s) are Able to Approve Account Reactivation Request
// @route   PUT /api/admin/reactivation-requests/:id
// @access  Admin Only

// 3. Admin approves request
export const approveReactivation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = true;
    user.reactivationRequested = false;
    user.lastActive = new Date(); // Reset their timer so they don't get banned tomorrow

    await user.save();

    res.json({ message: `${user.name} has been reactivated!` });
  } catch (err) {
    next(err);
  }
};
