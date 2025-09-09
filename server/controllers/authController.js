import User from "../models/User.js";
import Job from "../models/Job.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

// LOGIN
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password)
      return res.status(400).json({ message: "Identifier and password required" });

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    })
      .select("+password")
      .populate("job", "title description");

    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

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
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

// REGISTER
export const register = async (req, res) => {
  try {
    const { username, password, name, avatarUrl, job } = req.body;

    if (!username || !name)
      return res.status(400).json({ message: "Username and name required" });

    const existingUser = await User.findOne({ $or: [{ username }, { email: req.body.email }].filter(Boolean) });
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
    res.status(500).json({ message: "Error logging out", error: err.message });
  }
};

// REFRESH TOKEN
export const refreshAccessToken = (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token provided" });

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid refresh token" });

      const accessToken = generateAccessToken(user);
      res.status(200).json({ accessToken });
    });
  } catch (err) {
    res.status(500).json({ message: "Error refreshing token", error: err.message });
  }
};
