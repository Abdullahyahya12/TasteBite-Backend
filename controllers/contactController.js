const ContactMessage = require("../models/ContactMessage");

// =========================
// Create Contact Message
// =========================

const createContactMessage = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
    } = req.body || {};

    // Required fields validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, subject and message are required",
      });
    }

    // Create message
    const contactMessage =
      await ContactMessage.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone ? phone.trim() : "",
        subject: subject.trim(),
        message: message.trim(),
      });

    return res.status(201).json({
      success: true,
      message:
        "Your message has been sent successfully",
      contactMessage,
    });
  } catch (error) {
    console.error(
      "Create contact message error:",
      error
    );

    // Mongoose validation error
    if (error.name === "ValidationError") {
      const validationMessage = Object.values(
        error.errors
      )
        .map((item) => item.message)
        .join(", ");

      return res.status(400).json({
        success: false,
        message: validationMessage,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Server error while sending your message",
    });
  }
};

module.exports = {
  createContactMessage,
};