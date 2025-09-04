import express from "express";
import { addReaction, removeReaction, getReactionsForPost } from "../controllers/reactionController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", requireAuth, addReaction);
router.delete("/remove", requireAuth, removeReaction);
router.get("/:postId", getReactionsForPost);

export default router;
