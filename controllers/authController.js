const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const User = require("../models/User");

// =========================
// Generate JWT Token
// =========================

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// =========================
// Email Transporter
// =========================

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// =========================
// Register User
// =========================

const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : "",
      password: hashedPassword,
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

// =========================
// Login User
// =========================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated",
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// =========================
// Forgot Password
// =========================

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select(
      "+resetPasswordToken +resetPasswordExpire"
    );

    // Do not reveal whether an account exists.
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    if (!user.isActive) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    // Generate random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before storing it in database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;

    // Token valid for 15 minutes
    user.resetPasswordExpire =
      Date.now() + 15 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const frontendUrl =
      process.env.FRONTEND_URL ||
      "http://localhost:5173";

    const resetUrl =
      `${frontendUrl}/reset-password/${resetToken}`;

    try {
      await transporter.sendMail({
        from: `"TasteBite" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "TasteBite - Password Reset",
        html: `
          <div style="
            max-width: 600px;
            margin: 0 auto;
            font-family: Arial, sans-serif;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            overflow: hidden;
          ">
            <div style="
              background: #111827;
              padding: 30px;
              text-align: center;
              color: white;
            ">
              <h1 style="margin: 0; font-size: 28px;">
                TasteBite
              </h1>

              <p style="
                margin: 8px 0 0;
                color: #d1d5db;
              ">
                Password Reset
              </p>
            </div>

            <div style="padding: 32px;">
              <h2 style="
                margin-top: 0;
                color: #111827;
              ">
                Reset Your Password
              </h2>

              <p style="
                color: #4b5563;
                line-height: 1.7;
              ">
                Hello ${user.name},
              </p>

              <p style="
                color: #4b5563;
                line-height: 1.7;
              ">
                We received a request to reset your TasteBite
                account password.
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a
                  href="${resetUrl}"
                  style="
                    display: inline-block;
                    padding: 14px 24px;
                    background: #f97316;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 10px;
                    font-weight: bold;
                  "
                >
                  Reset Password
                </a>
              </div>

              <p style="
                color: #6b7280;
                font-size: 14px;
                line-height: 1.6;
              ">
                This link will expire in 15 minutes.
              </p>

              <p style="
                color: #6b7280;
                font-size: 14px;
                line-height: 1.6;
              ">
                If you did not request a password reset,
                you can safely ignore this email.
              </p>
            </div>

            <div style="
              padding: 20px;
              background: #f9fafb;
              text-align: center;
              color: #9ca3af;
              font-size: 12px;
            ">
              © ${new Date().getFullYear()} TasteBite
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error(
        "Password reset email error:",
        emailError
      );

      // Remove token if email could not be sent
      user.resetPasswordToken = null;
      user.resetPasswordExpire = null;

      await user.save({
        validateBeforeSave: false,
      });

      return res.status(500).json({
        success: false,
        message:
          "Unable to send password reset email. Please try again later.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Server error while processing password reset request",
    });
  }
};

// =========================
// Reset Password
// =========================

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body || {};

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Reset token is required",
      });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and confirm password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    }).select(
      "+password +resetPasswordToken +resetPasswordExpire"
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Reset link is invalid or has expired",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    user.password = hashedPassword;

    // Invalidate reset token after successful reset
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Server error while resetting password",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};