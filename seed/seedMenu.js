const dotenv = require("dotenv");

const connectDB = require("../config/db");
const MenuItem = require("../models/MenuItem");
const menuItems = require("./menuData");

dotenv.config();

// =========================
// Seed Menu
// =========================

const seedMenu = async () => {
  try {
    await connectDB();

    console.log("Clearing existing menu items...");

    await MenuItem.deleteMany({});

    console.log("Existing menu items removed.");

    console.log("Adding menu items...");

    const createdItems = await MenuItem.insertMany(menuItems);

    console.log(
      `${createdItems.length} menu items inserted successfully!`
    );

    console.log("Menu seeding completed successfully.");

    process.exit(0);
  } catch (error) {
    console.error("Menu seeding failed:", error);

    process.exit(1);
  }
};

seedMenu();