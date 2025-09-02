import Post from "../models/Post.js";

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
