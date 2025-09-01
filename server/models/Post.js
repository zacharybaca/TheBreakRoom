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
    content: { type: String, required: true },
    imageUrl: { type: String },
    anonymous: { type: Boolean, default: false },
    tags: {
      type: [String],
      validate: [arrayLimit, "Exceeds the limit of 5 tags"],
      set: (tags) => tags.map((tag) => tag.toLowerCase()), // normalize tags
    },
    reactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reaction" }],
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
