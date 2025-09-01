import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// Creates a New User
export const createUser = async (req, res) => {
  try {
    const { username, email } = req.body;

    const userExists = await User.findOne({ $or: [{ username }, { email }] });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User(req.body);
    const saved = await newUser.save();
    res.status(201).json({
      _id: saved._id,
      name: saved.name,
      username: saved.username,
      email: saved.email,
      token: generateToken(saved._id),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Retrieves all Created Users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Retrieve a Created User by Id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User Not Found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a Created User
export const updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a Created User
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
