import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

// Helper to format post response
const formatPostResponse = async (post) => {
  // We ensure counts are fresh before sending
  // Note: For high-traffic apps, you might remove this line and update counts only on user action
  await post.updateReactionCounts();

  const commentCount = await Comment.countDocuments({
    postId: post._id,
    isDeleted: false, // If you added middleware to Comment model, you can remove this line too
  });

  return {
    ...post.toObject(),
    reactionCounts: post.reactionCounts,
    commentCount,
  };
};

// Create Post
export const createPost = async (req, res) => {
  try {
    const { content, imageUrl, anonymous, tags } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Content is required" });
    }

    let newPost = new Post({
      authorId: req.user._id,
      content: content.trim(),
      imageUrl,
      anonymous: anonymous ?? false,
      tags: tags || [],
    });

    await newPost.save();

    // Populate author details so the frontend can display the user immediately
    newPost = await newPost.populate("authorId", "username name avatarUrl");

    const formattedPost = await formatPostResponse(newPost);

    // Broadcast to all connected clients via WebSocket
    if (req.io) {
      req.io.emit("postCreated", formattedPost);
      console.log("📡 Emitted postCreated event via WebSocket");
    }

    res.status(201).json(formattedPost);
  } catch (err) {
    res.status(400).json({
      message: "Error creating post",
      error: err.message,
    });
  }
};

// Get all Posts
export const getPosts = async (req, res) => {
  try {
    // 1. We removed { isDeleted: false } because the Schema Middleware handles it automatically now.
    // 2. We removed .populate("reactions") because that array no longer exists (better for scale).
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("authorId", "username name avatarUrl");

    const postsWithCounts = await Promise.all(posts.map(formatPostResponse));

    res.status(200).json(postsWithCounts);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching posts",
      error: err.message,
    });
  }
};

// Get Post by ID
export const getPostById = async (req, res) => {
  try {
    // Schema Middleware automatically filters out deleted posts here
    const post = await Post.findById(req.params.id).populate(
      "authorId",
      "username name avatarUrl",
    );

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json(await formatPostResponse(post));
  } catch (err) {
    res.status(500).json({
      message: "Error fetching post",
      error: err.message,
    });
  }
};

// Update Post
export const updatePost = async (req, res) => {
  try {
    const { content, imageUrl, anonymous, tags } = req.body;

    if (content !== undefined && content.trim() === "") {
      return res.status(400).json({ message: "Content cannot be empty" });
    }

    const updatedPost = await Post.findById(req.params.id);

    // If 'post' is null, it either doesn't exist OR it was soft-deleted (middleware hid it)
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check permissions
    if (
      !req.user ||
      (req.user.role !== "admin" && !updatedPost.authorId.equals(req.user._id))
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    updatedPost.content = content ?? updatedPost.content;
    updatedPost.imageUrl = imageUrl ?? updatedPost.imageUrl;
    updatedPost.anonymous = anonymous ?? updatedPost.anonymous;
    updatedPost.tags = tags ?? updatedPost.tags;

    await updatedPost.save();

    // Repopulate author for the response
    await updatedPost.populate("authorId", "username name avatarUrl");

    res.status(200).json(await formatPostResponse(updatedPost));
  } catch (err) {
    res.status(500).json({
      message: "Error updating post",
      error: err.message,
    });
  }
};

// Soft Delete Post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // If middleware is working, this returns null if the post is already soft-deleted.
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (
      !req.user ||
      (req.user.role !== "admin" && !post.authorId.equals(req.user._id))
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    // This triggers the save() logic which is safer than findByIdAndUpdate
    post.isDeleted = true;
    await post.save();

    res
      .status(200)
      .json({ message: "Post deleted successfully (soft delete)" });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting post",
      error: err.message,
    });
  }
};
