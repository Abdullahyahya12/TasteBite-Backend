const express = require("express");

const {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");

const {
  protect,
  admin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =========================
// Public Routes
// =========================

// Get all menu items
router.get("/", getAllMenuItems);

// Get single menu item
router.get("/:id", getMenuItemById);

// =========================
// Admin Routes
// =========================

// Create menu item
router.post(
  "/",
  protect,
  admin,
  createMenuItem
);

// Update menu item
router.put(
  "/:id",
  protect,
  admin,
  updateMenuItem
);

// Delete menu item
router.delete(
  "/:id",
  protect,
  admin,
  deleteMenuItem
);

module.exports = router;