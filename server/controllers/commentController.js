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
            content
        });

        let saved = await newComment.save();

        // Populate post info
        saved = await saved.populate("postId", "content imageUrl anonymous tags reactions comments");
        // Populate author info (excluding sensitive informaton)
        saved = await saved.populate("authorId", "username name avatarUrl");

        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: "Error creating comment", error: err.message });
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
            return res.status(404).json({ message: "Post not found or you are not authorized to view comments" });
        }

        // Find all comments for the specified postId
        const comments = await Comment.find({ postId })
            .populate("authorId", "username name avatarUrl") // Populate author information
            .sort({ createdAt: -1 }); // Optionally, sort by creation date (most recent first)

        res.status(200).json(comments);
    } catch (err) {
        res.status(400).json({ message: "Error fetching comments", error: err.message });
    }
};
