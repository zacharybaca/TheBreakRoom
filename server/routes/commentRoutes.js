import express from "express";
import {
  createComment,
  getComments,
  getCommentById,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route POST /api/comments
 * @desc Create a new comment
 * @access Private
 * @body { postId, content }
 */
router.post("/", protect, createComment);

/**
 * @route GET /api/comments/comment/:id
 * @desc Get a single comment by ID
 * @access Private
 */
router.get("/comment/:id", protect, getCommentById);

/**
 * @route GET /api/comments/:postId
 * @desc Get all comments for a specific post
 * @access Private
 * @query includeDeleted=true (admin only)
 */
router.get("/:postId", protect, getComments);

/**
 * @route PUT /api/comments/:id
 * @desc Update a comment by ID
 * @access Private (owner or admin)
 */
router.put("/:id", protect, updateComment);

/**
 * @route DELETE /api/comments/:id
 * @desc Soft delete a comment by ID
 * @access Private (owner or admin)
 */
router.delete("/:id", protect, deleteComment);

export default router;
