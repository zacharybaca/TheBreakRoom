import Breakroom from "../models/Breakroom.js";
import User from "../models/User.js";

// Create a new breakroom
export const createBreakroom = async (req, res, next) => {
  try {
    const {
      name,
      description,
      vibe,
      accent,
      occupants,
      newCount,
      iconURL,
      jobTags,
    } = req.body;

    const breakroom = await Breakroom.create({
      name,
      description,
      vibe,
      accent,
      occupants,
      newCount,
      iconURL,
      jobTags,
    });
    res.status(201).json(breakroom);
  } catch (err) {
    next(err);
  }
};

// Get all breakrooms
export const getBreakrooms = async (req, res, next) => {
  try {
    const breakrooms = await Breakroom.find().populate(
      "members",
      "name username avatarUrl",
    );
    res.json(breakrooms);
  } catch (err) {
    next(err);
  }
};

// Get single breakroom by ID
export const getBreakroomById = async (req, res, next) => {
  try {
    const breakroom = await Breakroom.findById(req.params.id).populate(
      "members",
      "name username avatarUrl",
    );
    if (!breakroom)
      return res.status(404).json({ message: "Breakroom not found" });
    res.json(breakroom);
  } catch (err) {
    next(err);
  }
};

// Join a breakroom
export const joinBreakroom = async (req, res, next) => {
  try {
    const userId = req.user.id; // requires auth middleware
    const { id } = req.params;

    const breakroom = await Breakroom.findById(id);
    if (!breakroom)
      return res.status(404).json({ message: "Breakroom not found" });

    // Add user to breakroom if not already in it
    if (!breakroom.members.includes(userId)) {
      breakroom.members.push(userId);
      await breakroom.save();
    }

    // Also update user doc
    await User.findByIdAndUpdate(userId, { $addToSet: { breakrooms: id } });

    res.json({ message: "Joined breakroom successfully" });
  } catch (err) {
    next(err);
  }
};

// Leave a breakroom
export const leaveBreakroom = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const breakroom = await Breakroom.findById(id);
    if (!breakroom)
      return res.status(404).json({ message: "Breakroom not found" });

    breakroom.members = breakroom.members.filter(
      (member) => member.toString() !== userId,
    );
    await breakroom.save();

    await User.findByIdAndUpdate(userId, { $pull: { breakrooms: id } });

    res.json({ message: "Left breakroom successfully" });
  } catch (err) {
    next(err);
  }
};
