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
  getReactionsForPost,
} from "../controllers/reactionController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route POST /api/posts
 * @desc Create a new post
 * @access Private
 */
router.post("/", protect, createPost);

/**
 * @route GET /api/posts
 * @desc Get all posts
 * @access Private
 */
router.get("/", protect, getPosts);

/**
 * @route GET /api/posts/:id
 * @desc Get post by id
 * @access Private
 */
router.get("/:id", protect, getPostById);

/**
 * @route PUT /api/posts/:id
 * @desc Update post by id
 * @access Private
 */
router.put("/:id", protect, updatePost);

/**
 * @route DELETE /api/posts/:id
 * @desc Delete job by id
 * @access Private
 */
router.delete("/:id", protect, deletePost);

// --- REACTION ROUTES (Nested) ---
/**
 * @route POST /api/posts/:id/reactions
 * @desc Add a reaction to a post
 * @access Private
 */
router.post("/:id/reactions", protect, addReaction);

/**
 * @route DELETE /api/posts/:id/reactions
 * @desc Delete a reaction to a post
 * @access Private
 */
router.delete("/:id/reactions", protect, removeReaction);

/**
 * @route GET /api/posts/:id/reactions
 * @desc Get reactions to a post
 * @access Private
 */
router.get("/:id/reactions", protect, getReactionsForPost);

export default router;
