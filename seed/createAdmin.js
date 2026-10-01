const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("../models/User");

dotenv.config();

const ADMIN_EMAIL = "mabdullah332w@gmail.com";
const ADMIN_PASSWORD = "Abdullahyahya1@";
const ADMIN_NAME = "Abdullah Yahya";

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully!");

    const normalizedEmail = ADMIN_EMAIL.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (existingUser) {
      existingUser.name = ADMIN_NAME;
      existingUser.role = "admin";
      existingUser.isActive = true;

      // Update password as well
      const salt = await bcrypt.genSalt(10);

      existingUser.password = await bcrypt.hash(
        ADMIN_PASSWORD,
        salt
      );

      await existingUser.save();

      console.log("Existing user updated successfully!");
      console.log("Admin role assigned.");
      console.log(`Admin email: ${normalizedEmail}`);

      return;
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      ADMIN_PASSWORD,
      salt
    );

    const admin = await User.create({
      name: ADMIN_NAME,
      email: normalizedEmail,
      phone: "",
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    console.log("New admin created successfully!");
    console.log(`Admin ID: ${admin._id}`);
    console.log(`Admin email: ${admin.email}`);
  } catch (error) {
    console.error("Create admin error:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

createAdmin();