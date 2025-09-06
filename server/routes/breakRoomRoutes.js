import express from "express";
import {
  createBreakroom,
  getBreakrooms,
  getBreakroomById,
  joinBreakroom,
  leaveBreakroom,
} from "../controllers/breakRoomController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// CRUD & membership
router.post("/", protect, createBreakroom); // User can create breakroom
router.get("/", protect, getBreakrooms); // Get all breakrooms
router.get("/:id", protect, getBreakroomById); // Get single breakroom
router.post("/:id/join", protect, joinBreakroom); // Join breakroom
router.post("/:id/leave", protect, leaveBreakroom); // Leave breakroom

export default router;
