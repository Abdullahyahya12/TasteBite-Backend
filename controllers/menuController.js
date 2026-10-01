const MenuItem = require("../models/MenuItem");

// =========================
// Create Menu Item
// =========================

const createMenuItem = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      isAvailable,
      isFeatured,
      rating,
    } = req.body || {};

    if (
      !name ||
      !description ||
      price === undefined ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, description, price and category are required",
      });
    }

    const menuItem = await MenuItem.create({
      name: name.trim(),
      description: description.trim(),
      price,
      category,
      image: image ? image.trim() : "",
      isAvailable:
        isAvailable !== undefined ? isAvailable : true,
      isFeatured:
        isFeatured !== undefined ? isFeatured : false,
      rating: rating !== undefined ? rating : 0,
    });

    return res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      menuItem,
    });
  } catch (error) {
    console.error("Create menu item error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating menu item",
    });
  }
};

// =========================
// Get All Menu Items
// =========================

const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: menuItems.length,
      menuItems,
    });
  } catch (error) {
    console.error("Get menu items error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching menu items",
    });
  }
};

// =========================
// Get Single Menu Item
// =========================

const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    return res.status(200).json({
      success: true,
      menuItem,
    });
  } catch (error) {
    console.error("Get menu item error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching menu item",
    });
  }
};

// =========================
// Update Menu Item
// =========================

const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(
      req.params.id
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    const {
      name,
      description,
      price,
      category,
      image,
      isAvailable,
      isFeatured,
      rating,
    } = req.body || {};

    if (name !== undefined) {
      menuItem.name = name.trim();
    }

    if (description !== undefined) {
      menuItem.description = description.trim();
    }

    if (price !== undefined) {
      menuItem.price = price;
    }

    if (category !== undefined) {
      menuItem.category = category;
    }

    if (image !== undefined) {
      menuItem.image = image.trim();
    }

    if (isAvailable !== undefined) {
      menuItem.isAvailable = isAvailable;
    }

    if (isFeatured !== undefined) {
      menuItem.isFeatured = isFeatured;
    }

    if (rating !== undefined) {
      menuItem.rating = rating;
    }

    const updatedMenuItem = await menuItem.save();

    return res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      menuItem: updatedMenuItem,
    });
  } catch (error) {
    console.error("Update menu item error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating menu item",
    });
  }
};

// =========================
// Delete Menu Item
// =========================

const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(
      req.params.id
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    await menuItem.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error("Delete menu item error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting menu item",
    });
  }
};

module.exports = {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
};