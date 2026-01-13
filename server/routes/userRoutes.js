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
  banUser,                 // <--- NEW IMPORT
  requestReactivation,     // <--- NEW IMPORT
  getReactivationRequests, // <--- NEW IMPORT
  approveReactivation      // <--- NEW IMPORT
} from "../controllers/userController.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// =================================================================
// PUBLIC ROUTES (Must come before protected/ID routes)
// =================================================================

// @desc    User Requests Reactivation (Public - uses email in body)
// @route   POST /api/users/request-reactivation
// @access  Public
router.post("/request-reactivation", requestReactivation);

// =================================================================
// ADMIN ROUTES (Specific paths first)
// =================================================================

// @desc    Get Reactivation Requests
// @route   GET /api/users/reactivation-requests
// @access  Private/Admin
// ⚠️ IMPORTANT: This must be defined BEFORE /:id routes!
router.get("/reactivation-requests", protect, requireAdmin, getReactivationRequests);

// =================================================================
// STANDARD USER CRUD
// =================================================================

// @desc    Create a new user (Admin only)
// @route   POST /api/users
// @access  Private/Admin
router.post("/", protect, requireAdmin, createUser);

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get("/", protect, requireAdmin, getUsers);

// =================================================================
// ID-BASED ROUTES (Place these last to avoid conflicts)
// =================================================================

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

// =================================================================
// AVATAR & SPECIAL ACTIONS
// =================================================================

// @desc    Upload user avatar
// @route   POST /api/users/:id/avatar
// @access  Private (user or admin)
router.post("/:id/avatar", protect, upload.single("avatar"), uploadAvatar);

// @desc    Update user avatar
// @route   PUT /api/users/:id/avatar
// @access  Private (user or admin)
router.put("/:id/avatar", protect, upload.single("avatar"), updateUserAvatar);

// @desc    Ban or Unban a user
// @route   PUT /api/users/:id/ban
// @access  Private/Admin
router.put("/:id/ban", protect, requireAdmin, banUser);

// @desc    Approve Reactivation
// @route   PUT /api/users/:id/reactivate
// @access  Private/Admin
router.put("/:id/reactivate", protect, requireAdmin, approveReactivation);

export default router;
