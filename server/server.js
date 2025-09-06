// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import breakroomRoutes from "./routes/breakRoomRoutes.js";
// import commentRoutes from "./routes/commentRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root route
app.get("/", (req, res) => res.json({ message: "API is running..." }));

// Routes
app.use("/api/auth", authRoutes); // login & registration
app.use("/api/users", userRoutes); // admin-only user management
app.use("/api/posts", postRoutes);
// app.use("/api/comments", commentRoutes);
app.use("/api/jobs", jobRoutes); // job CRUD + public GET
app.use("/api/breakrooms", breakroomRoutes);

// 404 fallback
app.use((req, res, next) =>
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` })
);

// Error middleware
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
