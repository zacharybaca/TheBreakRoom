import express from "express";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";
import {
  createTicket,
  getTickets,
  getMyTickets,
  updateTicket,
} from "../controllers/supportController.js";

const router = express.Router();

// User Routes
router.post("/", protect, createTicket);      // Submit a ticket
router.get("/me", protect, getMyTickets);     // View my history

// Admin Routes
router.get("/", protect, requireAdmin, getTickets);       // View all tickets
router.put("/:id", protect, requireAdmin, updateTicket);  // Reply/Close

export default router;
