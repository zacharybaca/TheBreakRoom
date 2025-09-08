import express from "express";
import {
  createComment,
  getComments,
  getCommentById,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";

import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route POST /api/comments
 * @desc Create a new comment
 * @access Private
 */
router.post("/", protect, createComment);

/**
 * @route GET /api/comments/:postId
 * @desc Get all Comments on Specific Post
 * @access Private
 */
router.get(":/postId", protect, getComments);

/**
 * @route PUT /api/comments/:id
 * @desc Update comment by Id
 * @access Private
 */
router.put(":/id", protect, updateComment);

/**
 * @route DELETE /api/comments/:id
 * desc Soft delete comment by Id
 * @access Private (owner or admin)
 */
router.delete(":id", protect, requireAdmin, deleteComment);

/**
 * @route GET /api/comments/:id
 * @desc Get comment by Id
 * @access Private
 */
router.get(":/id", protect, getCommentById);

export default router;
