const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelMyOrder,
  deleteOrder,
} = require("../controllers/orderController");

const {
  protect,
  admin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Create order
router.post(
  "/",
  protect,
  createOrder
);

// Get user's orders
router.get(
  "/my-orders",
  protect,
  getMyOrders
);

// Cancel user's own order
router.put(
  "/:id/cancel",
  protect,
  cancelMyOrder
);

// Get single order
router.get(
  "/:id",
  protect,
  getOrderById
);

// Admin - get all orders
router.get(
  "/",
  protect,
  admin,
  getAllOrders
);

// Admin - update order status
router.put(
  "/:id/status",
  protect,
  admin,
  updateOrderStatus
);

// Admin - delete order
router.delete(
  "/:id",
  protect,
  admin,
  deleteOrder
);

module.exports = router;