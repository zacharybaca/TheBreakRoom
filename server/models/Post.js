import mongoose from "mongoose";

function arrayLimit(val) {
  return val.length <= 5;
}

const postSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true, maxlength: 2000 },
    imageUrl: { type: String },
    anonymous: { type: Boolean, default: false },

    tags: {
      type: [String],
      validate: [arrayLimit, "Exceeds the limit of 5 tags"],
      set: (tags) => tags.map((tag) => tag.toLowerCase()), // normalize tags
    },

    // Store reaction references (for populating if needed)
    reactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reaction" }],

    // Store aggregated reaction counts for fast lookups
    reactionCounts: {
      like: { type: Number, default: 0 },
      love: { type: Number, default: 0 },
      haha: { type: Number, default: 0 },
      wow: { type: Number, default: 0 },
      sad: { type: Number, default: 0 },
      angry: { type: Number, default: 0 },
    },

    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],

    // Soft delete for moderation
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes for performance
postSchema.index({ authorId: 1 });
postSchema.index({ tags: 1 });

export default mongoose.model("Post", postSchema);
