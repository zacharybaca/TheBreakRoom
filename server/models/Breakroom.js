import mongoose from "mongoose";

const breakroomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },

    // Job types this breakroom is related to (optional)
    jobTags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],

    // Members in this breakroom
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Breakroom", breakroomSchema);
