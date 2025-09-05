// routes/authRoutes.js
import express from "express";
import { login, register } from "../controllers/authController.js";

const router = express.Router();

// @desc    Register a new user (self-registration)
// @route   POST /api/auth/register
// @access  Public
router.post("/register", register);

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post("/login", login);

export default router;
