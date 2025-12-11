// server.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import http from "http";
import { Server as SocketServer } from "socket.io";
import rateLimit from "express-rate-limit";

// Config & Database
import connectDB from "./config/db.js";
import "./config/passport/index.js"; // Passport config
import { errorMiddleware } from "./middleware/errorMiddleware.js";

// Routes Imports
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import breakroomRoutes from "./routes/breakroomRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

// -- CONFIGURATION --
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars - Using path.join is safer for finding the file relative to this script
// This assumes .env is in the same folder as server.js.
// If your .env is in the root (one level up), change to: path.join(__dirname, "../.env")
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const server = http.createServer(app);

// 1. CORS CONFIGURATION (Critical for Cookies/Auth)
// Add your frontend URLs here. 5173 is standard for Vite.
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL, // Reads from your .env if set
].filter(Boolean); // Removes undefined values

// 2. Socket.IO with CORS
const io = new SocketServer(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true, // <--- CRITICAL: Allows cookies/headers
  },
});

// Attach Socket.IO instance to each request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// 3. Express CORS Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
  },
  credentials: true, // <--- CRITICAL: Allows cookies to be sent back and forth
}));

// Standard Middleware
app.use(express.json());
app.use(cookieParser());

// -- FILESYSTEM --
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
app.use("/uploads", express.static(uploadsDir));

// -- RATE LIMITING --
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per window
  message: {
    message: "Too many login/register attempts from this IP, please try again after 15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
});
// Apply rate limiting to auth routes
app.use("/api/auth", authLimiter);

// -- ROUTES --
app.get("/", (req, res) => res.json({ message: "API is running..." }));

app.use("/api/auth", authRoutes);       // Login/Register
app.use("/api/users", userRoutes);      // Admin Management
app.use("/api/posts", postRoutes);      // Feed
app.use("/api/comments", commentRoutes);// Comments (New)
app.use("/api/jobs", jobRoutes);        // Job Titles
app.use("/api/breakrooms", breakroomRoutes); // Rooms
app.use("/api/reports", reportRoutes);  // Moderation (New)

// 404 Fallback
app.use((req, res) =>
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` }),
);

// Error Middleware (Must be last)
app.use(errorMiddleware);

// -- SOCKET.IO LOGIC --
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

// -- START SERVER --
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
