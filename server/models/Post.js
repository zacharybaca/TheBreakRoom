import mongoose from "mongoose";

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
      validate: [(val) => val.length <= 5, "Exceeds the limit of 5 tags"],
      set: (tags) => tags.map((tag) => tag.toLowerCase()),
    },

    // Performance Optimization: Storing counts directly on the post
    reactionCounts: {
      like: { type: Number, default: 0 },
      love: { type: Number, default: 0 },
      haha: { type: Number, default: 0 },
      wow: { type: Number, default: 0 },
      sad: { type: Number, default: 0 },
      angry: { type: Number, default: 0 },
    },

    commentCount: { type: Number, default: 0 },

    // Soft Delete & Moderation
    isDeleted: { type: Boolean, default: false },
    isFlagged: { type: Boolean, default: false },
    reportCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// --- METHOD: Recalculate Reactions ---
// Called by reactionController when a user reacts
postSchema.methods.updateReactionCounts = async function () {
  const Reaction = mongoose.model("Reaction");

  // 1. Aggregate all reactions for this post by type
  const counts = await Reaction.aggregate([
    { $match: { post: this._id } },
    { $group: { _id: "$type", count: { $sum: 1 } } },
  ]);

  // 2. Reset current counts to 0
  this.reactionCounts = {
    like: 0,
    love: 0,
    haha: 0,
    wow: 0,
    sad: 0,
    angry: 0,
  };

  // 3. Update with new aggregated data
  counts.forEach((c) => {
    if (this.reactionCounts.hasOwnProperty(c._id)) {
      this.reactionCounts[c._id] = c.count;
    }
  });

  return this.save();
};

// Indexes for Feed Performance
postSchema.index({ authorId: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ createdAt: -1 });

export default mongoose.model("Post", postSchema);
