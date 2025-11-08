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

    reactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reaction" }],

    reactionCounts: {
      like: { type: Number, default: 0 },
      love: { type: Number, default: 0 },
      haha: { type: Number, default: 0 },
      wow: { type: Number, default: 0 },
      sad: { type: Number, default: 0 },
      angry: { type: Number, default: 0 },
    },

    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],

    // New: store comment count for performance
    commentCount: { type: Number, default: 0 },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Indexes
postSchema.index({ authorId: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ createdAt: -1 });

// Utility: recalc reactions
postSchema.methods.updateReactionCounts = async function () {
  const Reaction = mongoose.model("Reaction");

  const counts = await Reaction.aggregate([
    { $match: { post: this._id } },
    { $group: { _id: "$type", count: { $sum: 1 } } },
  ]);

  this.reactionCounts = {
    like: 0,
    love: 0,
    haha: 0,
    wow: 0,
    sad: 0,
    angry: 0,
  };

  counts.forEach((c) => {
    this.reactionCounts[c._id] = c.count;
  });

  await this.save();
  return this.reactionCounts;
};

// Virtual: if you want live comment counts (fallback to DB query)
postSchema.virtual("commentsCount").get(function () {
  return this.commentCount ?? 0;
});

export default mongoose.model("Post", postSchema);
