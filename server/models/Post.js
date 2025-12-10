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

    // Vital for your specific app concept
    anonymous: { type: Boolean, default: false },

    tags: {
      type: [String],
      validate: [(val) => val.length <= 5, "Exceeds the limit of 5 tags"],
      set: (tags) => tags.map((tag) => tag.toLowerCase()),
    },

    // REMOVED: reactions: [] (This will explode on viral posts)
    // REMOVED: comments: [] (Use the Comment model to query these)

    // Keep these counts, they are excellent for performance
    reactionCounts: {
      like: { type: Number, default: 0 },
      love: { type: Number, default: 0 },
      haha: { type: Number, default: 0 },
      wow: { type: Number, default: 0 },
      sad: { type: Number, default: 0 },
      angry: { type: Number, default: 0 },
    },

    commentCount: { type: Number, default: 0 },

    // --- Soft Delete Flag ---
    isDeleted: { type: Boolean, default: false },

    // NEW: Moderation for "venting" apps is crucial
    isFlagged: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// --- NEW MIDDLEWARE: Auto-filter deleted posts ---
// This regex /^find/ covers find, findOne, findById, etc.
postSchema.pre(/^find/, function (next) {
  // 'this' refers to the query currently running.
  // We add a filter to exclude any document where isDeleted is true.
  this.find({ isDeleted: { $ne: true } });
  next();
});

// Ensure this is in models/Post.js
postSchema.methods.updateReactionCounts = async function () {
  const Reaction = mongoose.model("Reaction");

  // Aggregate all reactions for this post
  const counts = await Reaction.aggregate([
    { $match: { post: this._id } },
    { $group: { _id: "$type", count: { $sum: 1 } } },
  ]);

  // Reset counts
  this.reactionCounts = {
    like: 0,
    love: 0,
    haha: 0,
    wow: 0,
    sad: 0,
    angry: 0,
  };

  // Apply new counts
  counts.forEach((c) => {
    if (this.reactionCounts.hasOwnProperty(c._id)) {
      this.reactionCounts[c._id] = c.count;
    }
  });

  return this.save(); // This saves the post
};

// Indexes
postSchema.index({ authorId: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ createdAt: -1 }); // Critical for "Feed" queries

export default mongoose.model("Post", postSchema);
