import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body; 
    // identifier = username OR email

    // Search by username OR email, and explicitly include password
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid username/email or password" });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username/email or password" });
    }

    // Success: return user info and token
    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
      job: user.job,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      token: generateToken(user._id, user.username),
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};
