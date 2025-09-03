import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route POST /api/posts
 * @desc Create a new post
 * @access Private (self or admin)
 */

// Create post
router.post("/", protect, createPost);

/**
 * @route GET /api/posts
 * @desc Get all posts
 * @access Private (self or admin)
 */

// Get all posts
router.get("/", protect, getPosts);

/**
 * @route GET /api/posts/:id
 * @desc Get post by Id
 * @access Private (self or admin)
 */

// Get post by Id
router.get("/:id", protect, getPostById);

/**
 * @route PUT /api/posts/:id
 * @desc Update post by Id
 * @access Private (self or admin)
 */

// Update post
router.put("/:id", protect, updatePost);

/**
 * @route DELETE /api/posts/:id
 * @desc Delete post by Id
 * @access Private (self or admin)
 */

// Delete post
router.delete("/:id", protect, deletePost);

export default router;
