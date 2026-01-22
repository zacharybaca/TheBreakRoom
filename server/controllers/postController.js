import Post from "../models/Post.js";
import Reaction from "../models/Reaction.js"; // Import Reaction model

// Helper: Formats response
const formatPostResponse = (post, userReaction = null) => {
  const postObj = post.toObject ? post.toObject() : post;

  // 1. PRIVACY CHECK: Mask the author if anonymous
  if (postObj.anonymous) {
    postObj.authorId = {
      _id: "anonymous", // Frontend should handle this string ID carefully
      name: "Anonymous Worker",
      username: "anonymous",
      avatarUrl: "https://avatar.iran.liara.run/public/job/doctor",
      job: null,
    };
  }

  // 2. Attach the current user's reaction (if any)
  if (userReaction) {
    postObj.userReaction = userReaction;
  }

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

    newPost = await newPost.populate("authorId", "username name avatarUrl job");

    // Pass null for userReaction since they just created it (no reactions yet)
    const formattedPost = formatPostResponse(newPost, null);

    if (req.io) {
      req.io.emit("postCreated", formattedPost);
    }

    res.status(201).json(formattedPost);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error creating post", error: err.message });
  }
};

// Get all Posts (Feed)
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // 1. QUERY: Filter flagged AND deleted posts
    const query = { isFlagged: false, isDeleted: false };

    // Optional: Filter by tag if provided
    if (req.query.tag) {
      query.tags = req.query.tag;
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("authorId", "username name avatarUrl job");

    // 2. USER CONTEXT: Find which posts the current user has reacted to
    let userReactionsMap = {};

    if (req.user) {
      // Get IDs of the posts we just fetched
      const postIds = posts.map((p) => p._id);

      // Find reactions by this user for these specific posts
      const reactions = await Reaction.find({
        user: req.user._id,
        post: { $in: postIds },
      });

      // Map postId -> reactionType (e.g., { "123": "like", "456": "heart" })
      reactions.forEach((r) => {
        userReactionsMap[r.post.toString()] = r.type;
      });
    }

    // 3. FORMAT: Merge post data with the user's reaction status
    const formattedPosts = posts.map((post) =>
      formatPostResponse(post, userReactionsMap[post._id.toString()]),
    );

    res.status(200).json(formattedPosts);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching posts", error: err.message });
  }
};

// Get Post by ID
export const getPostById = async (req, res) => {
  try {
    // 1. FILTER: Ensure we don't return deleted posts!
    const post = await Post.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate("authorId", "username name avatarUrl job");

    if (!post) return res.status(404).json({ message: "Post not found" });

    // 2. USER CONTEXT: Fetch user's reaction for this single post
    let userReaction = null;
    if (req.user) {
      const reaction = await Reaction.findOne({
        user: req.user._id,
        post: post._id,
      });
      if (reaction) userReaction = reaction.type;
    }

    res.status(200).json(formatPostResponse(post, userReaction));
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching post", error: err.message });
  }
};

// Update Post
export const updatePost = async (req, res) => {
  try {
    const { content, imageUrl, anonymous, tags } = req.body;

    if (content !== undefined && content.trim() === "") {
      return res.status(400).json({ message: "Content cannot be empty" });
    }

    // 1. FILTER: Ensure we don't update a deleted post
    const updatedPost = await Post.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

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
    res
      .status(500)
      .json({ message: "Error updating post", error: err.message });
  }
};

// Delete Post (Soft Delete)
export const deletePost = async (req, res) => {
  try {
    // Note: We findById because even if it is already deleted, we might want to know it exists
    // But typically for a delete action, finding only active ones is safer.
    const post = await Post.findOne({ _id: req.params.id, isDeleted: false });

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
    res
      .status(500)
      .json({ message: "Error deleting post", error: err.message });
  }
};
