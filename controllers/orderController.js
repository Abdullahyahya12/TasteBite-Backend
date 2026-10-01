const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");

// ==========================================
// CREATE ORDER
// ==========================================

const createOrder = async (req, res) => {
  try {
    const {
      items,
      orderType,
      customerPhone,
      deliveryAddress,
      deliveryCity,
      paymentMethod,
    } = req.body;

    // -----------------------------
    // Validate items
    // -----------------------------

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    // -----------------------------
    // Validate order type
    // -----------------------------

    const allowedOrderTypes = [
      "delivery",
      "pickup",
    ];

    if (!allowedOrderTypes.includes(orderType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order type",
      });
    }

    // -----------------------------
    // Validate phone
    // -----------------------------

    if (!customerPhone) {
      return res.status(400).json({
        success: false,
        message: "Customer phone number is required",
      });
    }

    // -----------------------------
    // Validate delivery information
    // -----------------------------

    if (orderType === "delivery") {
      if (!deliveryAddress || !deliveryCity) {
        return res.status(400).json({
          success: false,
          message:
            "Delivery address and city are required for delivery orders",
        });
      }
    }

    // -----------------------------
    // Validate payment method
    // -----------------------------

    const allowedPaymentMethods = [
      "Cash on Delivery",
      "Cash",
      "Card",
      "Online",
    ];

    if (!allowedPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    // -----------------------------
    // Verify menu items
    // -----------------------------

    const menuItemIds = items.map(
      (item) => item.menuItem || item._id
    );

    const menuItems = await MenuItem.find({
      _id: { $in: menuItemIds },
    });

    if (menuItems.length !== items.length) {
      return res.status(400).json({
        success: false,
        message: "One or more menu items were not found",
      });
    }

    // -----------------------------
    // Calculate subtotal
    // -----------------------------

    let subtotal = 0;

    const orderItems = [];

    for (const item of items) {
      const menuItemId =
        item.menuItem || item._id;

      const menuItem = menuItems.find(
        (menu) =>
          menu._id.toString() ===
          menuItemId.toString()
      );

      if (!menuItem) {
        return res.status(400).json({
          success: false,
          message: "Menu item not found",
        });
      }

      if (!menuItem.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `${menuItem.name} is currently unavailable`,
        });
      }

      const quantity = Number(item.quantity);

      if (!quantity || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Invalid item quantity",
        });
      }

      const itemTotal =
        menuItem.price * quantity;

      subtotal += itemTotal;

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
        total: itemTotal,
      });
    }

    // -----------------------------
    // Delivery fee
    // -----------------------------

    const deliveryFee =
      orderType === "delivery"
        ? 150
        : 0;

    // -----------------------------
    // Total amount
    // -----------------------------

    const totalAmount =
      subtotal + deliveryFee;

    // -----------------------------
    // Create order
    // -----------------------------

    const order = await Order.create({
      user: req.user._id,

      customerName:
        req.user.name,

      customerEmail:
        req.user.email,

      customerPhone,

      items: orderItems,

      orderType,

      deliveryAddress:
        orderType === "delivery"
          ? deliveryAddress
          : "",

      deliveryCity:
        orderType === "delivery"
          ? deliveryCity
          : "",

      subtotal,

      deliveryFee,

      totalAmount,

      paymentMethod,

      paymentStatus: "Pending",

      orderStatus: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Create order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while creating order",
    });
  }
};


// ==========================================
// GET MY ORDERS
// ==========================================

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(
      "Get my orders error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching orders",
    });
  }
};


// ==========================================
// GET SINGLE ORDER
// ==========================================

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    ).populate(
      "user",
      "name email phone role"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Admin can view any order
    if (req.user.role === "admin") {
      return res.status(200).json({
        success: true,
        order,
      });
    }

    // User can only view own order
    if (
      order.user._id.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to view this order",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "Get order by ID error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching order",
    });
  }
};


// ==========================================
// GET ALL ORDERS - ADMIN
// ==========================================

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate(
        "user",
        "name email phone role"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(
      "Get all orders error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching all orders",
    });
  }
};


// ==========================================
// UPDATE ORDER STATUS - ADMIN
// ==========================================

const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Preparing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = status;

    // Delivered order = Paid
    if (status === "Delivered") {
      order.paymentStatus = "Paid";
    }

    // Cancelled order
    if (
      status === "Cancelled" &&
      order.paymentStatus === "Paid"
    ) {
      order.paymentStatus = "Refunded";
    }

    const updatedOrder =
      await order.save();

    return res.status(200).json({
      success: true,
      message:
        "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(
      "Update order status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating order status",
    });
  }
};


// ==========================================
// CANCEL MY ORDER - USER
// ==========================================

const cancelMyOrder = async (
  req,
  res
) => {
  try {
    const order = await Order.findById(
      req.params.id
    );

    // -----------------------------
    // Check order
    // -----------------------------

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // -----------------------------
    // Check ownership
    // -----------------------------

    if (
      order.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to cancel this order",
      });
    }

    // -----------------------------
    // Check current status
    // -----------------------------

    const cancellableStatuses = [
      "Pending",
      "Confirmed",
    ];

    if (
      !cancellableStatuses.includes(
        order.orderStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This order can no longer be cancelled",
      });
    }

    // -----------------------------
    // Cancel order
    // -----------------------------

    order.orderStatus = "Cancelled";

    // If payment was already paid,
    // mark it as refunded
    if (
      order.paymentStatus === "Paid"
    ) {
      order.paymentStatus = "Refunded";
    }

    const updatedOrder =
      await order.save();

    return res.status(200).json({
      success: true,
      message:
        "Order cancelled successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(
      "Cancel my order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while cancelling order",
    });
  }
};


// ==========================================
// DELETE ORDER - ADMIN
// ==========================================

const deleteOrder = async (
  req,
  res
) => {
  try {
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Order deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while deleting order",
    });
  }
};


// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelMyOrder,
  deleteOrder,
};