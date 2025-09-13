// routes/userRoutes.js
import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadAvatar,
  updateUserAvatar,
} from "../controllers/userController.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Create a new user (Admin only)
// @route   POST /api/users
// @access  Private/Admin
router.post("/", protect, requireAdmin, createUser);

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get("/", protect, requireAdmin, getUsers);

// @desc    Get user by ID (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
router.get("/:id", protect, requireAdmin, getUserById);

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
router.put("/:id", protect, requireAdmin, updateUser);

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete("/:id", protect, requireAdmin, deleteUser);

// @desc    Upload user avatar
// @route   POST /api/users/:id/avatar
// @access  Private (user or admin)
router.post("/:id/avatar", protect, upload.single("avatar"), uploadAvatar);

// @desc Update user avatar
// @route PUT /api/users/:id/avatar
// @access Private (user or admin)
router.put("/:id/avatar", protect, upload.single("avatar"), updateUserAvatar);

export default router;
