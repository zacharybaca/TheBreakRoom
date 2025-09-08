import mongoose from "mongoose";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

// Create Comment
export const createComment = async (req, res) => {
  try {
    const post = await Post.findOne({ authorId: req.user._id });

    if (!post) return res.status(400).json({ message: "Post is required" });

    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Content is required" });
    }

    const newComment = new Comment({
      postId: post._id,
      authorId: req.user._id,
      content,
    });

    let saved = await newComment.save();

    // Populate post info
    saved = await saved.populate(
      "postId",
      "content imageUrl anonymous tags reactions comments"
    );
    // Populate author info (excluding sensitive informaton)
    saved = await saved.populate("authorId", "username name avatarUrl");

    res.status(201).json(saved);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error creating comment", error: err.message });
  }
};

// Get all comments
// Get all comments for a specific post by the logged-in user
export const getComments = async (req, res) => {
  try {
    // Get the postId from the URL parameter (assuming it's a route like "/posts/:postId/comments")
    const { postId } = req.params;

    // Check if the post belongs to the logged-in user (i.e., the author)
    const post = await Post.findOne({ _id: postId, authorId: req.user._id });

    if (!post) {
      return res
        .status(404)
        .json({
          message: "Post not found or you are not authorized to view comments",
        });
    }

    // Find all comments for the specified postId
    const comments = await Comment.find({ postId })
      .populate("authorId", "username name avatarUrl") // Populate author information
      .sort({ createdAt: -1 }); // Optionally, sort by creation date (most recent first)

    res.status(200).json(comments);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error fetching comments", error: err.message });
  }
};

// Get Comment by ID
export const getCommentById = async (req, res) => {
  try {
    const query = Comment.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate("postId", "authorId, content");

    const comment = await query;

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    res.status(200).json({
      ...comment.toObject(),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching comment", error: err.message });
  }
};

// Update Comment
export const updateComment = async (req, res) => {
  try {
    const { content } = req.body;

    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true, runValidators: true }
    ).populate("postId", "authorId content");

    if (!updatedComment)
      return res.status(404).json({ message: "Comment not found" });

    res.status(200).json({
      ...updatedComment.toObject(),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating comment", error: err.message });
  }
};

// Soft Delete Comment
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (
      !req.user ||
      (req.user.role !== "admin" && !comment.authorId.equals(req.user._id))
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    comment.isDeleted = true;
    await comment.save();

    res
      .status(200)
      .json({ message: "Comment deleted successfully (soft delete)" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting comment", error: err.message });
  }
};
