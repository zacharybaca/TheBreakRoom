import mongoose from "mongoose";
import crypto from "crypto";
import User from "../models/User.js";
import Job from "../models/Job.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/mail/sendEmail.js";
import { passwordResetTemplate } from "../utils/mail/templates.js";

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
      return res
        .status(400)
        .json({ message: "Identifier and password required" });

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    })
      .select("+password")
      .populate("job", "title description");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // --- BAN CHECK ---
    if (user.isBanned) {
      return res.status(403).json({
        message: "Your account has been suspended.",
        reason: user.banReason || "Violation of community guidelines.",
      });
    }

    // OPTIONAL: Block if inactive
    if (!user.isActive) {
      return res.status(403).json({
        message: "Account deactivated due to inactivity.",
        reason: "Please contact support to restore your access.",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Removed sensitive console logs here

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Update lastActive
    user.lastActive = new Date();
    user.isActive = true;
    await user.save();

    res.status(200).json({
      _id: user._id,
      username: user.username,
      name: user.name,
      job: user.job,
      isAdmin: user.isAdmin,
      role: user.role,
      accessToken,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error logging in", error: err.message });
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

    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err)
          return res
            .status(403)
            .json({ message: "Invalid or expired refresh token" });

        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // --- BAN CHECK FOR ACTIVE SESSIONS ---
        if (user.isBanned) {
          res.clearCookie("refreshToken");
          return res.status(403).json({
            message: "Your account has been suspended.",
          });
        }

        const accessToken = generateAccessToken(user);
        res.status(200).json({ accessToken });
      },
    );
  } catch (err) {
    console.error("Refresh token error:", err);
    res
      .status(500)
      .json({ message: "Error refreshing token", error: err.message });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ success: false, message: "Email required" });

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({
      success: true,
      message: "If an account exists we have sent reset instructions.",
    });
  }

  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const emailHtml = passwordResetTemplate({
    name: user.name,
    resetUrl,
    minutes: 10,
  });

  const { success, info, error } = await sendEmail({
    to: user.email,
    subject: "Reset your Breakroom password",
    html: emailHtml,
    text: `Reset your password: ${resetUrl}`,
  });

  if (!success) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return res
      .status(500)
      .json({ success: false, message: "Failed to send reset email" });
  }

  return res.json({
    success: true,
    message: "If an account exists we have sent reset instructions.",
  });
};
