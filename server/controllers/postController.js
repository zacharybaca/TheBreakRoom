import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

// Helper: Formats response without extra DB calls
const formatPostResponse = (post) => {
  const postObj = post.toObject();

  // 1. PRIVACY CHECK: Mask the author if anonymous
  if (postObj.anonymous) {
    postObj.authorId = {
      _id: "anonymous",
      name: "Anonymous Worker",
      username: "anonymous",
      avatarUrl: "https://avatar.iran.liara.run/public/job/doctor", // Generic icon
      job: null // Hide job if it reveals identity
    };
  }

  // 2. Return stored counts directly (Fast!)
  return postObj;
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

    // Populate author so we can format it (even if anonymous, we need the structure)
    // Added 'job' to populate so we can show "Cashier" next to name
    newPost = await newPost.populate("authorId", "username name avatarUrl job");

    const formattedPost = formatPostResponse(newPost);

    if (req.io) {
      req.io.emit("postCreated", formattedPost);
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
    // 1. MODERATION: Filter out flagged posts
    // 2. POPULATE: Added 'job' so you can display it in the feed
    const posts = await Post.find({ isFlagged: false })
      .sort({ createdAt: -1 })
      .populate("authorId", "username name avatarUrl job");

    // No await needed here anymore (Sync operation)
    const formattedPosts = posts.map(formatPostResponse);

    res.status(200).json(formattedPosts);
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
    const post = await Post.findById(req.params.id)
        .populate("authorId", "username name avatarUrl job");

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json(formatPostResponse(post));
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

    await updatedPost.populate("authorId", "username name avatarUrl job");

    res.status(200).json(formatPostResponse(updatedPost));
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

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (
      !req.user ||
      (req.user.role !== "admin" && !post.authorId.equals(req.user._id))
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    post.isDeleted = true;
    await post.save();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting post",
      error: err.message,
    });
  }
};
