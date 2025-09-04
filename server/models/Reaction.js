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
reactionSchema.index({ post: 1 }); // for fast lookups

// Middleware to keep Post.reactionCounts in sync
reactionSchema.post("save", async function (doc) {
  const Post = mongoose.model("Post");

  await Post.findByIdAndUpdate(doc.post, {
    $inc: { [`reactionCounts.${doc.type}`]: 1 },
    $addToSet: { reactions: doc._id },
  });
});

reactionSchema.post("findOneAndUpdate", async function (doc) {
  if (!doc) return;
  const Post = mongoose.model("Post");

  const prevType = this.getQuery().type;
  const newType = doc.type;

  if (prevType !== newType) {
    await Post.findByIdAndUpdate(doc.post, {
      $inc: {
        [`reactionCounts.${prevType}`]: -1,
        [`reactionCounts.${newType}`]: 1,
      },
    });
  }
});

reactionSchema.post("findOneAndDelete", async function (doc) {
  if (!doc) return;
  const Post = mongoose.model("Post");

  await Post.findByIdAndUpdate(doc.post, {
    $inc: { [`reactionCounts.${doc.type}`]: -1 },
    $pull: { reactions: doc._id },
  });
});

export default mongoose.model("Reaction", reactionSchema);
