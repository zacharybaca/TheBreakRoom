import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postController.js";

import {
  addReaction,
  removeReaction,
  getReactionsForPost, // 👈 bring in the getter
} from "../controllers/reactionController.js";

import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/posts
 * @desc    Create a new post
 * @access  Private
 */
router.post("/", protect, createPost);

/**
 * @route   GET /api/posts
 * @desc    Get all posts (use ?withReactions=true to include reactions)
 * @access  Private
 */
router.get("/", protect, getPosts);

/**
 * @route   GET /api/posts/:id
 * @desc    Get post by Id (includes reactions if populated)
 * @access  Private
 */
router.get("/:id", protect, getPostById);

/**
 * @route   PUT /api/posts/:id
 * @desc    Update post by Id
 * @access  Private (owner or admin)
 */
router.put("/:id", protect, requireAdmin, updatePost);

/**
 * @route   DELETE /api/posts/:id
 * @desc    Soft delete post by Id
 * @access  Private (owner or admin)
 */
router.delete("/:id", protect, requireAdmin, deletePost);

/**
 * @route   POST /api/posts/:id/reactions
 * @desc    Add or update reaction to a post
 * @access  Private
 */
router.post("/:id/reactions", protect, addReaction);

/**
 * @route   DELETE /api/posts/:id/reactions
 * @desc    Remove current user's reaction from a post
 * @access  Private
 */
router.delete("/:id/reactions", protect, removeReaction);

/**
 * @route   GET /api/posts/:id/reactions
 * @desc    Get all reactions for a post
 * @access  Private
 */
router.get("/:id/reactions", protect, getReactionsForPost);

export default router;
