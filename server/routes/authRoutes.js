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

// --- UPDATED IMPORT ---
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";

const router = express.Router();

// ... [Existing Standard Routes - register, login, etc. stay the same] ...
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshAccessToken);
router.get("/me", protect, getMe);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);
router.post("/test-email", sendEmailTest);

/* -------------------------------------------------------------------------- */
/* OAUTH ROUTES                                                               */
/* -------------------------------------------------------------------------- */

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    // 1. Generate Both Tokens
    const accessToken = generateAccessToken(req.user);
    const refreshToken = generateRefreshToken(req.user);

    // 2. Set Refresh Token as HTTP-Only Cookie (More Secure)
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only secure in prod
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 3. Redirect to Frontend with Access Token only
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${accessToken}`);
  },
);

router.get("/apple", passport.authenticate("apple"));

router.post( // Apple uses POST
  "/apple/callback",
  passport.authenticate("apple", { session: false }),
  async (req, res) => {
    const accessToken = generateAccessToken(req.user);
    const refreshToken = generateRefreshToken(req.user);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${accessToken}`);
  },
);

export default router;
