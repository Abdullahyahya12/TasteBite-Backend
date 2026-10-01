const express = require("express");

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const {
  protect,
  admin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================

router.post(
  "/register",
  registerUser
);

router.post(
  "/login",
  loginUser
);

router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/reset-password/:token",
  resetPassword
);

// ==========================================
// PROTECTED ROUTES
// ==========================================

router.get(
  "/me",
  protect,
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Authenticated user",
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
      },
    });
  }
);

// ==========================================
// ADMIN TEST ROUTE
// ==========================================

router.get(
  "/admin-test",
  protect,
  admin,
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Welcome Admin!",
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
      },
    });
  }
);

module.exports = router;