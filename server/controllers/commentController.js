import mongoose from "mongoose";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

// Utility: validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Fields to consistently populate
const populateConfig = [
  { path: "postId", select: "authorId content" },
  { path: "authorId", select: "username name avatarUrl" },
];

/**
 * Create Comment
 * Body: { postId, content }
 */
export const createComment = async (req, res) => {
  try {
    const { postId, content } = req.body;

    if (!isValidId(postId)) {
      return res.status(400).json({ message: "Valid postId is required" });
    }
    if (!content || typeof content !== "string" || content.trim() === "") {
      return res.status(400).json({ message: "Content is required" });
    }

    const post = await Post.findById(postId).select(
      "_id isDeleted commentCount comments",
    );
    if (!post || post.isDeleted) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = new Comment({
      postId,
      authorId: req.user._id,
      content: content.trim(),
    });

    const saved = await newComment.save();

    // push comment reference & increment count
    post.comments.push(saved._id);
    post.commentCount = (post.commentCount || 0) + 1;
    await post.save();

    const populated = await saved.populate(populateConfig);

    return res.status(201).json({
      message: "Comment created successfully",
      comment: populated,
      commentCount: post.commentCount,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error creating comment",
      error: err.message,
    });
  }
};

/**
 * Get all comments for a post
 * Params: :postId
 * Query: ?includeDeleted=true (admin only)
 */
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const includeDeleted = req.query.includeDeleted === "true";

    if (!isValidId(postId)) {
      return res.status(400).json({ message: "Valid postId is required" });
    }

    const post = await Post.findById(postId).select(
      "_id isDeleted commentCount",
    );
    if (!post || post.isDeleted) {
      return res.status(404).json({ message: "Post not found" });
    }

    const filter = { postId };
    if (!includeDeleted || req.user.role !== "admin") {
      filter.isDeleted = false;
    }

    const comments = await Comment.find(filter)
      .populate(populateConfig)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      comments,
      commentCount: post.commentCount,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching comments",
      error: err.message,
    });
  }
};

/**
 * Get comment by ID
 * Params: :id
 */
export const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid comment id" });
    }

    const comment = await Comment.findById(id).populate(populateConfig);

    if (!comment || comment.isDeleted) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(200).json(comment);
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching comment",
      error: err.message,
    });
  }
};

/**
 * Update Comment
 * Params: :id
 * Body: { content }
 * Only author or admin can update
 */
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid comment id" });
    }
    if (!content || typeof content !== "string" || content.trim() === "") {
      return res.status(400).json({ message: "Content is required" });
    }

    const comment = await Comment.findById(id);
    if (!comment || comment.isDeleted) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const isOwner = comment.authorId.equals(req.user._id);
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this comment" });
    }

    comment.content = content.trim();
    const updated = await comment.save();
    const populated = await updated.populate(populateConfig);

    return res.status(200).json(populated);
  } catch (err) {
    return res.status(500).json({
      message: "Error updating comment",
      error: err.message,
    });
  }
};

/**
 * Soft Delete Comment
 * Params: :id
 * Owner or admin
 */
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid comment id" });
    }

    const comment = await Comment.findById(id);
    if (!comment || comment.isDeleted) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const isOwner = comment.authorId.equals(req.user._id);
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    comment.isDeleted = true;
    await comment.save();

    // decrement count & clean up ref
    const post = await Post.findByIdAndUpdate(
      comment.postId,
      {
        $pull: { comments: comment._id },
        $inc: { commentCount: -1 },
      },
      { new: true },
    );

    return res.status(200).json({
      message: "Comment deleted successfully (soft delete)",
      commentCount: post?.commentCount ?? 0,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error deleting comment",
      error: err.message,
    });
  }
};
