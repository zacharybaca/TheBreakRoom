import express from "express";
import {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
} from "../controllers/postController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create post
router.post("/", protect, createPost);

// Get all posts
router.get("/", protect, getPosts);

// Get post by Id
router.get("/:id", protect, getPostById);

// Update post
router.put("/:id", protect, updatePost);

// Delete post
router.delete("/:id", protect, deletePost);
