import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect routes with access token
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify short-lived access token
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // Attach user info from token (optional: fetch full user from DB)
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (err) {
      console.error("JWT error:", err);
      return res.status(403).json({ message: "Token invalid or expired" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

// Admin-only routes
export const requireAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
