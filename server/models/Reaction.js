import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "love", "haha", "wow", "sad", "angry"],
      required: true,
    },
  },
  { timestamps: true },
);

// OPTIMIZED INDEX:
// This single compound index does two jobs:
// 1. Enforces Uniqueness: A user can only react once per post.
// 2. Optimizes Lookup: Since 'post' is the first key, MongoDB uses this
//    to find "all reactions for a post" without needing a separate index.
reactionSchema.index({ post: 1, user: 1 }, { unique: true });

export default mongoose.model("Reaction", reactionSchema);
