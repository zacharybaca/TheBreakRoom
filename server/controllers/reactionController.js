import Reaction from "../models/Reaction.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

// Add or Update Reaction
export const addReaction = async (req, res) => {
  try {
    const { type } = req.body;
    const postId = req.params.id;

    if (!type) {
      return res.status(400).json({ message: "Reaction type is required" });
    }

    // Find post first
    const post = await Post.findOne({ _id: postId, isDeleted: false });
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Add or update reaction
    const reaction = await Reaction.findOneAndUpdate(
      { post: postId, user: req.user._id },
      { type },
      { new: true, upsert: true, runValidators: true }
    ).populate("user", "username avatarUrl");

    // Refresh reaction counts
    await post.updateReactionCounts();

    // Refresh comment count for completeness
    const commentCount = await Comment.countDocuments({
      postId,
      isDeleted: false,
    });
    post.commentCount = commentCount;
    await post.save();

    res.status(200).json({
      message: "Reaction added/updated successfully",
      reaction,
      reactionCounts: post.reactionCounts,
      commentCount: post.commentCount,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error adding reaction",
      error: err.message,
    });
  }
};

// Remove Reaction
export const removeReaction = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findOne({ _id: postId, isDeleted: false });
    if (!post) return res.status(404).json({ message: "Post not found" });

    const reaction = await Reaction.findOneAndDelete({
      post: postId,
      user: req.user._id,
    });

    if (!reaction) {
      return res.status(404).json({ message: "Reaction not found" });
    }

    // Refresh reaction counts
    await post.updateReactionCounts();

    // Refresh comment count for completeness
    const commentCount = await Comment.countDocuments({
      postId,
      isDeleted: false,
    });
    post.commentCount = commentCount;
    await post.save();

    res.status(200).json({
      message: "Reaction removed successfully",
      reactionCounts: post.reactionCounts,
      commentCount: post.commentCount,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error removing reaction",
      error: err.message,
    });
  }
};

// Get all reactions for a post
export const getReactionsForPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const reactions = await Reaction.find({ post: postId })
      .populate("user", "username avatarUrl")
      .sort({ createdAt: -1 });

    res.status(200).json(reactions);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching reactions",
      error: err.message,
    });
  }
};
