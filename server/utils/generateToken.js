import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, isAdmin: user.isAdmin },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" } // short-lived
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, isAdmin: user.isAdmin },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" } // long-lived
  );
};
