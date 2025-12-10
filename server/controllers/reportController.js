import Report from "../models/Report.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

export const createReport = async (req, res) => {
  try {
    const { targetType, targetId, reason, description } = req.body;
    const reporter = req.user._id;

    // 1. Prevent double reporting by the same person
    const existing = await Report.findOne({ reporter, targetId });
    if (existing) {
      return res.status(400).json({ message: "You have already reported this content." });
    }

    // 2. Save the report
    const newReport = await Report.create({
      reporter,
      targetType,
      targetId,
      reason,
      description
    });

    // 3. Increment reportCount on the target item
    let TargetModel;
    if (targetType === "Post") TargetModel = Post;
    if (targetType === "Comment") TargetModel = Comment;

    if (TargetModel) {
      const item = await TargetModel.findByIdAndUpdate(
        targetId,
        { $inc: { reportCount: 1 } },
        { new: true }
      );

      // Auto-flag logic: hide post if more than 5 reports
      if (item && item.reportCount >= 5) {
        item.isFlagged = true;
        await item.save();
      }
    }

    res.status(201).json({ success: true, message: "Report submitted." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
