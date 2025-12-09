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

// 1. Prevent duplicate reactions: A user can only have ONE reaction per post
reactionSchema.index({ post: 1, user: 1 }, { unique: true });

// 2. Index for fast lookups: Essential for fetching "all reactions for this post"
reactionSchema.index({ post: 1 });

export default mongoose.model("Reaction", reactionSchema);
