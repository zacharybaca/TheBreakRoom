import Post from "../models/Post.js";

// Create Post
export const createPost = async (req, res) => {
  try {
    const { content, imageUrl, anonymous, tags } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Content is required" });
    }

    let newPost = new Post({
      authorId: req.user._id,
      content,
      imageUrl,
      anonymous: anonymous ?? false,
      tags: tags || [],
    });

    newPost = await newPost.save();
    newPost = await newPost.populate("authorId", "username name avatarUrl");

    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: "Error creating post", error: err.message });
  }
};

// Get all Posts
export const getPosts = async (req, res) => {
  try {
    const query = Post.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .populate("authorId", "username name avatarUrl");

    // If client requests full reaction details
    if (req.query.withReactions === "true") {
      query.populate({
        path: "reactions",
        populate: { path: "user", select: "username avatarUrl" },
      });
    }

    const posts = await query;

    // Always include reactionCounts (lightweight, aggregated view)
    const result = posts.map((post) => ({
      ...post.toObject(),
      reactionCounts: post.reactionCounts,
    }));

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts", error: err.message });
  }
};

// Get Post by ID
export const getPostById = async (req, res) => {
  try {
    const query = Post.findOne({ _id: req.params.id, isDeleted: false })
      .populate("authorId", "username name avatarUrl");

    if (req.query.withReactions === "true") {
      query.populate({
        path: "reactions",
        populate: { path: "user", select: "username avatarUrl" },
      });
    }

    const post = await query;

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json({
      ...post.toObject(),
      reactionCounts: post.reactionCounts,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching post", error: err.message });
  }
};

// Update Post
export const updatePost = async (req, res) => {
  try {
    const { content, imageUrl, anonymous, tags } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { content, imageUrl, anonymous, tags },
      { new: true, runValidators: true }
    ).populate("authorId", "username name avatarUrl");

    if (!updatedPost) return res.status(404).json({ message: "Post not found" });

    res.status(200).json({
      ...updatedPost.toObject(),
      reactionCounts: updatedPost.reactionCounts,
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating post", error: err.message });
  }
};

// Soft Delete Post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!req.user || (req.user.role !== "admin" && !post.authorId.equals(req.user._id))) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    post.isDeleted = true;
    await post.save();

    res.status(200).json({ message: "Post deleted successfully (soft delete)" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting post", error: err.message });
  }
};
