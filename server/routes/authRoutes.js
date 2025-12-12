// routes/authRoutes.js
import express from "express";
import passport from "passport";
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
import { protect } from "../middleware/authMiddleware.js";

// !!! CRITICAL FIX: Make sure you import your JWT generator here !!!
// Adjust the path to wherever you store your token generation logic
import { createJwtForUser } from "../utils/tokenUtils.js";

const router = express.Router();

// ... [Existing Standard Routes are fine and omitted for brevity] ...

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshAccessToken);
router.get("/me", protect, getMe);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);
router.post("/test-email", sendEmailTest);


/* -------------------------------------------------------------------------- */
/* OAUTH ROUTES                                */
/* -------------------------------------------------------------------------- */

/**
 * @route   GET /api/auth/google
 * @desc    Initiate Google OAuth2 authentication
 * @access  Public
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

/**
 * @route   GET /api/auth/google/callback
 * @desc    Handle Google OAuth2 callback
 * @access  Public
 */
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    // 1. Generate the JWT (ensure this function exists!)
    const token = createJwtForUser(req.user);

    // 2. Redirect to Frontend with token
    // Security Note: Ensure CLIENT_URL is set in .env to avoid open redirect vulnerabilities
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
  },
);

/**
 * @route   GET /api/auth/apple
 * @desc    Initiate Apple Sign-In authentication
 * @access  Public
 */
router.get("/apple", passport.authenticate("apple"));

/**
 * @route   POST /api/auth/apple/callback
 * @desc    Handle Apple Sign-In callback
 * @note    APPLE SENDS A POST REQUEST, NOT A GET!
 * @access  Public
 */
router.post( // <--- CHANGED FROM GET TO POST
  "/apple/callback",
  passport.authenticate("apple", { session: false }),
  async (req, res) => {
    const token = createJwtForUser(req.user);
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
  },
);

export default router;
