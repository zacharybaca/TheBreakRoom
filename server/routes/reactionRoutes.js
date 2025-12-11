import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addReaction,
  removeReaction,
  getReactionsForPost,
} from "../controllers/reactionController.js";

const router = express.Router();

// @route   POST /api/reactions/:id
// @desc    Add or Update reaction (toggle like/love etc)
router.post("/:id", protect, addReaction);

// @route   DELETE /api/reactions/:id
// @desc    Remove reaction (unlike)
router.delete("/:id", protect, removeReaction);

// @route   GET /api/reactions/:id
// @desc    Get list of users who reacted
router.get("/:id", protect, getReactionsForPost);

export default router;
