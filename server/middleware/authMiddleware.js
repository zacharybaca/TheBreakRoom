import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect routes
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) return res.status(401).json({ message: "User not found" });

      // --- NEW: THE BAN CHECK ---
      if (req.user.isBanned) {
        return res.status(403).json({
          message: "Your account has been suspended. Please contact support.",
        });
      }
      // --------------------------

      next();
    } catch (err) {
      console.error("JWT error:", err);
      return res.status(403).json({ message: "Token invalid or expired" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

// Admin-only routes
export const requireAdmin = (req, res, next) => {
  // Check for 'admin' role (More robust than the boolean check)
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Admin access required" });
  }
};
