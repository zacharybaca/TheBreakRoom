import Reaction from "../models/Reaction.js";
import Post from "../models/Post.js";

// Add or Update Reaction
export const addReaction = async (req, res) => {
  try {
    const { type } = req.body;
    const postId = req.params.id;

    if (!type) {
      return res.status(400).json({ message: "Reaction type is required" });
    }

    // 1. Check if post exists
    const post = await Post.findOne({ _id: postId, isDeleted: false });
    if (!post) return res.status(404).json({ message: "Post not found" });

    // 2. Add or update reaction (Upsert)
    const reaction = await Reaction.findOneAndUpdate(
      { post: postId, user: req.user._id },
      { type },
      { new: true, upsert: true, runValidators: true }
    ).populate("user", "username avatarUrl");

    // 3. Refresh reaction counts
    // This method (defined in your Post model) calculates counts AND saves the post.
    await post.updateReactionCounts();

    // REMOVED: Unnecessary comment re-counting
    // REMOVED: Second post.save()

    res.status(200).json({
      message: "Reaction added/updated successfully",
      reaction,
      reactionCounts: post.reactionCounts,
      // Just return the existing comment count from the post document
      commentCount: post.commentCount,
    });
  } catch (err) {
    console.error(err); // Good practice to log the error
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

    // Refresh reaction counts (Calculates & Saves)
    await post.updateReactionCounts();

    res.status(200).json({
      message: "Reaction removed successfully",
      reactionCounts: post.reactionCounts,
      commentCount: post.commentCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error removing reaction",
      error: err.message,
    });
  }
};

// Get all reactions for a post (Unchanged)
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
