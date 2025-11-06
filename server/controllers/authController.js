import mongoose from "mongoose";
import User from "../models/User.js";
import Job from "../models/Job.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import { sendEmail } from '../utils/mail/sendEmail.js';
import { passwordResetTemplate } from '../utils/mail/templates.js';

// Helper to ensure JWT secrets are loaded
const ensureSecrets = () => {
  if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("JWT secrets are not defined in environment variables");
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    ensureSecrets();

    const { identifier, password } = req.body;
    if (!identifier || !password)
      return res.status(400).json({ message: "Identifier and password required" });

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    })
      .select("+password")
      .populate("job", "title description");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      _id: user._id,
      username: user.username,
      name: user.name,
      job: user.job,
      isAdmin: user.isAdmin,
      accessToken,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

// REGISTER
export const register = async (req, res) => {
  try {
    ensureSecrets();

    const { username, password, name, avatarUrl, job } = req.body;
    if (!username || !name)
      return res.status(400).json({ message: "Username and name required" });

    const existingUser = await User.findOne({
      $or: [{ username }, { email: req.body.email }].filter(Boolean),
    });
    if (existingUser) return res.status(400).json({ message: "Username/email already exists" });

    let jobDoc;
    if (mongoose.Types.ObjectId.isValid(job)) {
      jobDoc = await Job.findById(job);
      if (!jobDoc) return res.status(400).json({ message: "Job not found" });
    } else {
      jobDoc = await Job.findOne({ title: job }) || await Job.create({ title: job, description: "" });
    }

    const newUser = new User({ username, password, name, avatarUrl, job: jobDoc._id });
    const saved = await newUser.save();
    await saved.populate("job", "title description");

    const accessToken = generateAccessToken(saved);
    const refreshToken = generateRefreshToken(saved);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      _id: saved._id,
      username: saved.username,
      name: saved.name,
      job: saved.job,
      isAdmin: saved.isAdmin,
      accessToken,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(400).json({ message: "Error registering user", error: err.message });
  }
};

// LOGOUT
export const logout = (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.status(200).json({ message: "User successfully logged out" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Error logging out", error: err.message });
  }
};

// REFRESH TOKEN
export const refreshAccessToken = async (req, res) => {
  try {
    ensureSecrets();

    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid or expired refresh token" });

      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const accessToken = generateAccessToken(user);
      res.status(200).json({ accessToken });
    });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(500).json({ message: "Error refreshing token", error: err.message });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    res.status(200).json({
      _id: req.user._id,
      username: req.user.username,
      name: req.user.name,
      job: req.user.job,
      isAdmin: req.user.isAdmin,
    });
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ message: "Failed to fetch user info" });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Hash the token to match the stored one
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
      return res.status(400).json({ success: false, message: 'Token invalid or expired.' });
    }

    await user.resetPassword(newPassword);

    // cleanup token fields
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Password successfully reset.' });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
}

// Forgot Password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success:false, message:'Email required' });

  const user = await User.findOne({ email });
  if (!user) {
    // To avoid email enumeration, respond success but log
    return res.json({ success: true, message: 'If an account exists we have sent reset instructions.' });
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const emailHtml = passwordResetTemplate({ name: user.name, resetUrl, minutes: 10 });

  const { success, info, error } = await sendEmail({
    to: user.email,
    subject: 'Reset your Breakroom password',
    html: emailHtml,
    text: `Reset your password: ${resetUrl}`
  });

  if (!success) {
    // cleanup token fields if you want, or keep for a retry strategy
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(500).json({ success: false, message: 'Failed to send reset email' });
  }

  return res.json({ success: true, message: 'If an account exists we have sent reset instructions.' });
}
