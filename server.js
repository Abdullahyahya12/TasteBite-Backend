const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

// =========================
// Import Routes
// =========================

const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const contactRoutes = require("./routes/contactRoutes");
const chatRoutes = require("./routes/chatRoutes");

// =========================
// Initialize Express
// =========================

const app = express();

// =========================
// Middleware
// =========================

// Allow frontend development and production servers
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an origin
      // such as server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    },
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// Parse JSON request bodies
app.use(
  express.json({
    limit: "10kb",
  })
);

// =========================
// Database Connection
// =========================

// Connect to MongoDB
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error(
      "MongoDB connection error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// =========================
// Health Check
// =========================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TasteBite API is running successfully!",
  });
});

// =========================
// API Routes
// =========================

// Authentication
app.use(
  "/api/auth",
  authRoutes
);

// Menu
app.use(
  "/api/menu",
  menuRoutes
);

// Orders
app.use(
  "/api/orders",
  orderRoutes
);

// Contact
app.use(
  "/api/contact",
  contactRoutes
);

// Simple Rule-Based Chatbot
app.use(
  "/api/chat",
  chatRoutes
);

// =========================
// 404 - Route Not Found
// =========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// =========================
// Global Error Handler
// =========================

app.use(
  (err, req, res, next) => {
    console.error(
      "Server error:",
      err.message
    );

    if (res.headersSent) {
      return next(err);
    }

    res.status(err.status || 500).json({
      success: false,
      message:
        err.status === 400
          ? "Invalid request data"
          : "Internal server error",
    });
  }
);

// =========================
// Export Express App
// =========================

// Vercel will handle the server
module.exports = app;