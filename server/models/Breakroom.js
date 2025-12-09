import mongoose from "mongoose";

const breakroomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, maxlength: 500 }, // Add limits to prevent spam
    vibe: { type: String },
    accent: {
      color: { type: String, required: true },
      vibe: { type: String, required: true },
    },
    iconURL: { type: String },

    // Keep this, it's useful for filtering
    jobTags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],

    // TRACK COUNT ONLY instead of full array
    memberCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Virtual to find members if needed (expensive, use carefully)
breakroomSchema.virtual("membersList", {
  ref: "User",
  localField: "_id",
  foreignField: "breakrooms",
});

export default mongoose.model("Breakroom", breakroomSchema);
