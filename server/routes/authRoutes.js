// routes/authRoutes.js
import express from "express";
import { login, logout, register, refreshAccessToken, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (self-registration)
 * @access  Public
 */
router.post("/register", register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post("/login", login);

/**
 * @route POST /api/auth/logout
 * @desc Logout a current "logged-in" user
 * @access Public
 */
router.post("/logout", logout);

/**
 * @route POST /api/auth/refresh
 * @desc Refreshes user's token
 * @access Private
 */
router.post("/refresh", refreshAccessToken);

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user's info
 * @access  Private
 */
router.get("/me", protect, getMe);

/**
 * Additional debug routes could be added here if needed
 */

export default router;
