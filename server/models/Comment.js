import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true, // optimize queries for comments by post
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    // Add these to your schema definitions
    isFlagged: { type: Boolean, default: false },
    reportCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("Comment", commentSchema);
