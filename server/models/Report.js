import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    // The user who is submitting the report
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // What is being reported? (Post, Comment, or User)
    targetType: {
      type: String,
      enum: ["Post", "Comment", "User"],
      required: true
    },

    // The specific ID of that item
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'targetType' // Dynamically refs the targetType field
    },

    // Why are they reporting it?
    reason: {
      type: String,
      enum: [
        "Harassment",
        "Hate Speech",
        "Workplace Privacy Violation",
        "Spam",
        "Misinformation",
        "Other"
      ],
      required: true
    },

    description: {
      type: String,
      maxlength: 500,
      trim: true
    },

    // Admin review status
    status: {
      type: String,
      enum: ["pending", "reviewed", "dismissed", "action_taken"],
      default: "pending"
    },

    // Tracking who handled the report
    adminNotes: { type: String }
  },
  { timestamps: true }
);

// Indexes for fast searching in your Admin Dashboard
reportSchema.index({ status: 1 });
reportSchema.index({ targetId: 1 });

export default mongoose.model("Report", reportSchema);
