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

/**
 * @route POST /api/breakrooms
 * @desc Create a new breakroom
 * @access Private
 */

router.post("/", protect, createBreakroom); // User can create breakroom

/**
 * @route GET /api/breakrooms
 * @desc Get all breakrooms
 * @access Private
 */

router.get("/", protect, getBreakrooms); // Get all breakrooms

/**
 * @route GET /api/breakrooms/:id
 * @desc Get breakroom by Id
 * @access Private
 */

router.get("/:id", protect, getBreakroomById); // Get single breakroom

/**
 * @route POST /api/breakrooms/:id/join
 * @desc User can join a breakroom
 * @access Private
 */

router.post("/:id/join", protect, joinBreakroom); // Join breakroom

/**
 * @route POST /api/breakrooms/:id/leave
 * @desc User can leave a breakroom
 * @access Private
 */

router.post("/:id/leave", protect, leaveBreakroom); // Leave breakroom

export default router;
