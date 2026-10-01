
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

// Allow frontend development server
app.use(
  cors({
    origin: [
      "http://localhost:5173",
    ],
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
// Start Server
// =========================

const PORT =
  process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Start Express server
    app.listen(
      PORT,
      () => {
        console.log(
          `TasteBite server running on http://localhost:${PORT}`
        );

        console.log("");
        console.log(
          "Available API routes:"
        );
        console.log(
          "Auth:    /api/auth"
        );
        console.log(
          "Menu:    /api/menu"
        );
        console.log(
          "Orders:  /api/orders"
        );
        console.log(
          "Contact: /api/contact"
        );
        console.log(
          "Chatbot: /api/chat"
        );
      }
    );
  } catch (error) {
    console.error(
      "Failed to start TasteBite server:",
      error.message
    );

    process.exit(1);
  }
};

startServer();

