import Post from "../models/Post.js";

// Create Post
export const createPost = async (req, res) => {
  try {
    const { content, imageUrl, anonymous, tags } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Content is required" });
    }

    const newPost = new Post({
      authorId: req.user._id,   // 🔑 link to logged-in user
      content,
      imageUrl,
      anonymous: anonymous ?? false,
      tags,
      reactions: [],            // start with no reactions
    });

    let saved = await newPost.save();

    // Populate author info (but exclude sensitive stuff like password)
    saved = await saved.populate("authorId", "username name avatarUrl");

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Error creating post", error: err.message });
  }
};

// Get all Posts
export const getPosts = async (req, res) => {
  try {
    // Find posts sorted by newest first
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("authorId", "username name avatarUrl") // Populate author
      .populate({
        path: "reactions",
        populate: { path: "user", select: "username avatarUrl" } // Populate users who reacted
      });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts", error: err.message });
  }
};

// Get Post by ID
export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ message: "Error fetching post", error: err.message });
    }
};

// Updated Post
export const updatePost = async (req, res) => {
    try {
        const { content, imageUrl, anonymous, tags } = req.body;
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { content, imageUrl, anonymous, tags },
            { new: true, runValidators: true }
        );

        if (!updatedPost) return res.status(404).json({ message: "Post not found" });
        res.status(500).json({ message: "Error updating post", error: err.message });
    } catch (err) {
      res.status(500).json({ message: "Error updating post", error: err.message });
    }
};

// Delete Post
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized to delete this post" });
        }

        await post.deleteOne();
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting post", error: err.message });
    }
};
