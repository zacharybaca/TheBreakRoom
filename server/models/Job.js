import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    category: { type: String, trim: true }, // optional, but helps grouping jobs later
  },
  { timestamps: true },
);

// Normalize title before saving
jobSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.title = this.title.trim();
  }
  next();
});

// Clean response
function removeSensitive(doc, ret) {
  delete ret.__v;
  return ret;
}
jobSchema.set("toJSON", { transform: removeSensitive });
jobSchema.set("toObject", { transform: removeSensitive });

export default mongoose.model("Job", jobSchema);
