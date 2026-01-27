import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    category: {
      type: String,
      enum: ["Bug Report", "Account Issue", "Feature Request", "Other"],
      default: "Other",
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    adminResponse: {
      type: String, // If you want to reply directly in the ticket
    },
  },
  { timestamps: true }
);

// Index for Admins to quickly find Open tickets
supportTicketSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("SupportTicket", supportTicketSchema);
