// server.js
// ✅ Load environment variables FIRST
import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" });
import rateLimit from "express-rate-limit";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import http from "http";
import { Server as SocketServer } from "socket.io";
import "./config/passport/index.js";

import connectDB from "./config/db.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import breakroomRoutes from "./routes/breakroomRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

const io = new SocketServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Attach Socket.IO instance to each request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("📂 Created uploads directory:", uploadsDir);
  }
} catch (err) {
  console.error("⚠️ Failed to create uploads directory:", err.message);
}

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root route
app.get("/", (req, res) => res.json({ message: "API is running..." }));

/* RATE LIMITER CONFIGURATION */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per `window` (here, per 15 minutes)
  message: {
    message: "Too many login/register attempts from this IP, please try again after 15 minutes"
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests that start with /api/auth
app.use("/api/auth", authLimiter);

// Routes
app.use("/api/auth", authRoutes); // login & registration
app.use("/api/users", userRoutes); // admin-only user management
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/jobs", jobRoutes); // job CRUD + public GET
app.use("/api/breakrooms", breakroomRoutes);

// 404 fallback
app.use((req, res) =>
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` }),
);

// Error middleware
app.use(errorMiddleware);

// WebSocket Logic
io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });

  socket.on("chatMessage", (message) => {
    console.log("💬 Message received:", message);
    io.emit("chatMessage", message); // broadcast globally
  });

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`✅ User with ID: ${socket.id} joined room: ${room}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
    console.log(`📨 Message sent to room ${data.room}:`, data);
  });
});

// Start server
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      io.emit("server_ready", { status: "ok" });
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
