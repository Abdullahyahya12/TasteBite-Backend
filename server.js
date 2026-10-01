const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const contactRoutes = require("./routes/contactRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

/* =========================
   CORS CONFIGURATION
========================= */

const allowedOrigins = [
  "http://localhost:5173",
  "https://taste-bite-restaurant.vercel.app",
  process.env.FRONTEND_URL?.replace(/\/+$/, ""),
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an origin
      // such as server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/+$/, "");

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      console.error(
        `CORS blocked origin: ${origin}`
      );

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

    credentials: true,
  })
);

/* =========================
   BODY PARSER
========================= */

app.use(
  express.json({
    limit: "10kb",
  })
);

/* =========================
   DATABASE CONNECTION
========================= */

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

/* =========================
   ROOT ROUTE
========================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TasteBite API is running successfully!",
  });
});

/* =========================
   API ROUTES
========================= */

app.use("/api/auth", authRoutes);

app.use("/api/menu", menuRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/contact", contactRoutes);

app.use("/api/chat", chatRoutes);

/* =========================
   404 HANDLER
========================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* =========================
   ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
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
});

/* =========================
   LOCAL SERVER
========================= */

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  const startServer = async () => {
    try {
      await connectDB();

      app.listen(PORT, () => {
        console.log(
          `TasteBite server running on http://localhost:${PORT}`
        );

        console.log("");

        console.log("Available API routes:");
        console.log("Auth:    /api/auth");
        console.log("Menu:    /api/menu");
        console.log("Orders:  /api/orders");
        console.log("Contact: /api/contact");
        console.log("Chatbot: /api/chat");
      });
    } catch (error) {
      console.error(
        "Failed to start TasteBite server:",
        error.message
      );

      process.exit(1);
    }
  };

  startServer();
}

module.exports = app;