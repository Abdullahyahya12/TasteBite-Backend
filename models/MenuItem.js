const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    // =========================
    // Menu Item Name
    // =========================

    name: {
      type: String,
      required: [true, "Menu item name is required"],
      trim: true,
      minlength: [2, "Menu item name must be at least 2 characters"],
      maxlength: [100, "Menu item name cannot exceed 100 characters"],
    },

    // =========================
    // Description
    // =========================

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    // =========================
    // Price
    // =========================

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    // =========================
    // Category
    // =========================

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      enum: [
        "Burgers",
        "Pizza",
        "Pasta",
        "Chicken",
        "Appetizers",
        "Rice",
        "Desserts",
        "Drinks",
        "Salads",
        "Other",
      ],
    },

    // =========================
    // Image
    // =========================

    image: {
      type: String,
      default: "",
      trim: true,
    },

    // =========================
    // Availability
    // =========================

    isAvailable: {
      type: Boolean,
      default: true,
    },

    // =========================
    // Featured Item
    // =========================

    isFeatured: {
      type: Boolean,
      default: false,
    },

    // =========================
    // Rating
    // =========================

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

module.exports = MenuItem;