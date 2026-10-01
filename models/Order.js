const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: [true, "Menu item is required"],
    },

    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Item price is required"],
      min: [0, "Item price cannot be negative"],
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    // =========================
    // Customer
    // =========================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },

    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      maxlength: [100, "Customer name cannot exceed 100 characters"],
    },

    customerEmail: {
      type: String,
      required: [true, "Customer email is required"],
      trim: true,
      lowercase: true,
    },

    customerPhone: {
      type: String,
      required: [true, "Customer phone is required"],
      trim: true,
      maxlength: [20, "Phone number cannot exceed 20 characters"],
    },

    // =========================
    // Order Type
    // =========================

    orderType: {
      type: String,
      enum: ["delivery", "pickup"],
      default: "delivery",
    },

    // =========================
    // Order Items
    // =========================

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: function (items) {
          return items.length > 0;
        },
        message: "Order must contain at least one item",
      },
    },

    // =========================
    // Amounts
    // =========================

    subtotal: {
      type: Number,
      required: [true, "Subtotal is required"],
      min: [0, "Subtotal cannot be negative"],
    },

    deliveryFee: {
      type: Number,
      default: 0,
      min: [0, "Delivery fee cannot be negative"],
    },

    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },

    // =========================
    // Delivery / Pickup
    // =========================

    deliveryAddress: {
      type: String,
      default: "",
      trim: true,
      maxlength: [
        500,
        "Delivery address cannot exceed 500 characters",
      ],
    },

    deliveryCity: {
      type: String,
      default: "",
      trim: true,
      maxlength: [
        100,
        "Delivery city cannot exceed 100 characters",
      ],
    },

    deliveryNotes: {
      type: String,
      default: "",
      trim: true,
      maxlength: [
        500,
        "Delivery notes cannot exceed 500 characters",
      ],
    },

    // =========================
    // Payment
    // =========================

    paymentMethod: {
      type: String,
      enum: [
        "Cash on Delivery",
        "Card",
        "Online Payment",
      ],
      default: "Cash on Delivery",
    },

    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Paid",
        "Failed",
        "Refunded",
      ],
      default: "Pending",
    },

    // =========================
    // Order Status
    // =========================

    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Preparing",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;