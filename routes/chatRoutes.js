const express = require("express");

const {
  chatWithBot,
} = require("../controllers/chatController");

const router = express.Router();

// =========================
// TasteBite Chatbot Route
// =========================

router.post("/", chatWithBot);

module.exports = router;