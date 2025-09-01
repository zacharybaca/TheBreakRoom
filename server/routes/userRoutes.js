import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/users
 * @desc    Register a new user
 * @access  Public
 */
router.post("/", createUser);

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private (Admin only in real-world apps, but you can adjust)
 */
router.get("/", protect, requireAdmin, getUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private (self or admin)
 */
router.get("/:id", protect, getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user by ID
 * @access  Private (self or admin)
 */
router.put("/:id", protect, updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user by ID
 * @access  Private (self or admin)
 */
router.delete("/:id", protect, deleteUser);

export default router;
