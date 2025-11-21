// routes/authRoutes.js
import express from "express";
import {
  login,
  logout,
  register,
  refreshAccessToken,
  getMe,
  resetPassword,
  forgotPassword,
} from "../controllers/authController.js";
import { sendEmailTest } from "../utils/mail/sendEmailTest.js";
import passport from 'passport';
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
 * @route POST /api/auth/reset-password
 * @desc Change current authenticated user's password
 * @access Private
 */
router.post("/reset-password", resetPassword);

/**
 * @route POST /api/auth/forgot-password
 * @desc Enables a user to reset their password
 * @access Private
 */
router.post("/forgot-password", forgotPassword);

/**
 * @route POST /api/auth/test-email
 * @desc Sends a Test E-Mail
 * @access Public
 */
router.post("/test-email", sendEmailTest);

/**
 * @route   GET /api/auth/google
 * @desc    Initiate Google OAuth2 authentication
 * @access  Public
 */
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @route   GET /api/auth/google/callback
 * @desc    Handle Google OAuth2 callback
 * @access  Public
 */
router.get('/auth/google/callback',
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    const token = createJwtForUser(req.user); // your current JWT generator
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
  });

/**
 * @route GET /api/auth/apple
 * @desc Initiate Apple Sign-In authentication
 * @access Public
 */
router.get(
  "/auth/apple",
  passport.authenticate("apple")
);

/**
 * @route GET /api/auth/apple/callback
 * @desc Handle Apple Sign-In callback
 * @access Public
 */
router.get('/auth/apple/callback',
  passport.authenticate('apple', { session: false }),
  async (req, res) => {
    const token = createJwtForUser(req.user); // your current JWT generator
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
  });

export default router;
