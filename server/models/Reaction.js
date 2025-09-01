import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["like", "love", "haha", "wow", "sad", "angry"],
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate reactions by same user on same post
reactionSchema.index({ post: 1, user: 1 }, { unique: true });

export default mongoose.model("Reaction", reactionSchema);
