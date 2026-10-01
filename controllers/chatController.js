

const MenuItem = require("../models/MenuItem");

// =========================
// Helper: Normalize Message
// =========================

const normalizeText = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[?!.,]/g, " ");
};

// =========================
// Helper: Find Specific Menu Item
// =========================

const findMenuItem = async (message) => {
  const menuItems = await MenuItem.find({
    isAvailable: true,
  }).select("name price category");

  const normalizedMessage = normalizeText(message);

  // Exact menu item name match
  const exactMatch = menuItems.find((item) => {
    const itemName = normalizeText(item.name);

    return normalizedMessage.includes(itemName);
  });

  if (exactMatch) {
    return exactMatch;
  }

  // Partial word matching
  const partialMatch = menuItems.find((item) => {
    const itemWords = normalizeText(item.name)
      .split(" ")
      .filter((word) => word.length > 2);

    return itemWords.some((word) =>
      normalizedMessage.includes(word)
    );
  });

  return partialMatch || null;
};

// =========================
// Helper: Find Category
// =========================

const findCategory = (message) => {
  const normalizedMessage = normalizeText(message);

  const categories = [
    {
      keywords: [
        "burger",
        "burgers",
      ],
      category: "Burgers",
    },

    {
      keywords: [
        "pizza",
        "pizzas",
      ],
      category: "Pizza",
    },

    {
      keywords: [
        "pasta",
        "pastas",
      ],
      category: "Pasta",
    },

    {
      keywords: [
        "chicken",
      ],
      category: "Chicken",
    },

    {
      keywords: [
        "appetizer",
        "appetizers",
        "starter",
        "starters",
      ],
      category: "Appetizers",
    },

    {
      keywords: [
        "rice",
      ],
      category: "Rice",
    },

    {
      keywords: [
        "dessert",
        "desserts",
        "sweet",
        "sweets",
      ],
      category: "Desserts",
    },

    {
      keywords: [
        "drink",
        "drinks",
        "beverage",
        "beverages",
      ],
      category: "Drinks",
    },

    {
      keywords: [
        "salad",
        "salads",
      ],
      category: "Salads",
    },
  ];

  for (const item of categories) {
    const found = item.keywords.some((keyword) =>
      normalizedMessage.includes(keyword)
    );

    if (found) {
      return item.category;
    }
  }

  return null;
};

// =========================
// Main Chat Controller
// =========================

const chatWithBot = async (req, res) => {
  try {
    const { message } = req.body || {};

    // =========================
    // Validate Message
    // =========================

    if (
      !message ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const userMessage = normalizeText(message);

    let reply = "";

    // =========================
    // 1. Greeting
    // =========================

    if (
      userMessage === "hi" ||
      userMessage === "hello" ||
      userMessage === "hey" ||
      userMessage.includes("salam") ||
      userMessage.includes("assalam")
    ) {
      reply =
        "Hello! 👋 Welcome to TasteBite. How can I help you today?";
    }

    // =========================
    // 2. Opening Hours
    // =========================

    else if (
      userMessage.includes("opening") ||
      userMessage.includes("hours") ||
      userMessage.includes("timing") ||
      userMessage.includes("timings") ||
      userMessage.includes("open") ||
      userMessage.includes("close") ||
      userMessage.includes("closing")
    ) {
      reply =
        "Our opening hours are Monday–Thursday 11:00 AM–10:30 PM, Friday–Saturday 11:00 AM–11:30 PM, and Sunday 12:00 PM–10:00 PM. 🕐";
    }

    // =========================
    // 3. Location
    // =========================

    else if (
      userMessage.includes("location") ||
      userMessage.includes("address") ||
      userMessage.includes("where are you") ||
      userMessage.includes("where is") ||
      userMessage.includes("located")
    ) {
      reply =
        "TasteBite is located at Main Changa Manga Road, Chunian, Pakistan. 📍";
    }

    // =========================
    // 4. Contact
    // =========================

    else if (
      userMessage.includes("contact") ||
      userMessage.includes("phone") ||
      userMessage.includes("number") ||
      userMessage.includes("call")
    ) {
      reply =
        "You can contact TasteBite at +92 322 1060997. 📞";
    }

    // =========================
    // 5. Delivery
    // =========================

    else if (
      userMessage.includes("delivery") ||
      userMessage.includes("deliver") ||
      userMessage.includes("home delivery")
    ) {
      reply =
        "Yes! 🚗 TasteBite offers delivery. The standard delivery fee is Rs. 150.";
    }

    // =========================
    // 6. Pickup
    // =========================

    else if (
      userMessage.includes("pickup") ||
      userMessage.includes("pick up") ||
      userMessage.includes("takeaway") ||
      userMessage.includes("take away")
    ) {
      reply =
        "Yes! You can choose Pickup at checkout. There is no delivery fee for pickup orders.";
    }

    // =========================
    // 7. Payment
    // =========================

    else if (
      userMessage.includes("payment") ||
      userMessage.includes("pay") ||
      userMessage.includes("cash") ||
      userMessage.includes("card") ||
      userMessage.includes("cod")
    ) {
      reply =
        "We currently support Cash on Delivery and Card payment options. 💳";
    }

    // =========================
    // 8. Reservation
    // =========================

    else if (
      userMessage.includes("reservation") ||
      userMessage.includes("reserve") ||
      userMessage.includes("table") ||
      userMessage.includes("booking")
    ) {
      reply =
        "For table reservations, please contact us at +92 322 1060997 or send us a message through the Contact section. 📞";
    }

    // =========================
    // 9. Specific Menu Item
    // =========================

    else {
      const menuItem = await findMenuItem(
        message
      );

      if (menuItem) {
        const askingPrice =
          userMessage.includes("price") ||
          userMessage.includes("cost") ||
          userMessage.includes("how much") ||
          userMessage.includes("kitne") ||
          userMessage.includes("kitna") ||
          userMessage.includes("rate") ||
          userMessage.includes("pkr") ||
          userMessage.includes("rs");

        if (askingPrice) {
          reply = `${menuItem.name} is available for Rs. ${menuItem.price}. 🍽️`;
        } else {
          reply = `${menuItem.name} is currently available for Rs. ${menuItem.price}. Would you like to order it? 🍴`;
        }
      }

      // =========================
      // 10. Category Menu Search
      // =========================

      else {
        const category =
          findCategory(message);

        if (category) {
          const categoryItems =
            await MenuItem.find({
              category,
              isAvailable: true,
            })
              .select(
                "name price category"
              )
              .sort({
                name: 1,
              })
              .limit(10);

          if (categoryItems.length === 0) {
            reply = `We currently don't have any available items in ${category}.`;
          } else {
            const itemsText =
              categoryItems
                .map(
                  (item) =>
                    `${item.name} — Rs. ${item.price}`
                )
                .join(", ");

            reply = `Here are our available ${category.toLowerCase()}: ${itemsText}.`;
          }
        }

        // =========================
        // 11. General Menu
        // =========================

        else if (
          userMessage.includes("menu") ||
          userMessage.includes("food") ||
          userMessage.includes("dish") ||
          userMessage.includes("dishes") ||
          userMessage.includes("what do you have") ||
          userMessage.includes("what can i eat")
        ) {
          const menuItems =
            await MenuItem.find({
              isAvailable: true,
            })
              .select(
                "name price category"
              )
              .sort({
                category: 1,
                name: 1,
              })
              .limit(15);

          if (menuItems.length === 0) {
            reply =
              "Our menu is currently being updated. Please check again shortly.";
          } else {
            const menuText =
              menuItems
                .map(
                  (item) =>
                    `${item.name} — Rs. ${item.price}`
                )
                .join(", ");

            reply = `Here are some items from our menu: ${menuText}. You can view the complete menu on the website.`;
          }
        }

        // =========================
        // 12. Order Instructions
        // =========================

        else if (
          userMessage.includes("how to order") ||
          userMessage.includes("how can i order") ||
          userMessage.includes("place an order") ||
          userMessage.includes("order food") ||
          userMessage.includes("want to order")
        ) {
          reply =
            "To place an order, choose your food from the Menu, add items to your cart, open Checkout, select Delivery or Pickup, enter the required details, and confirm your order. 🍔";
        }

        // =========================
        // 13. Order Status
        // =========================

        else if (
          userMessage.includes("order status") ||
          userMessage.includes("my order") ||
          userMessage.includes("order update") ||
          userMessage.includes("where is my order")
        ) {
          reply =
            "You can check your latest order and its current status from the Order History section after logging into your TasteBite account. 📦";
        }

        // =========================
        // 14. Thanks
        // =========================

        else if (
          userMessage.includes("thank") ||
          userMessage.includes("thanks") ||
          userMessage.includes("thx")
        ) {
          reply =
            "You're very welcome! 😊 We look forward to serving you at TasteBite.";
        }

        // =========================
        // 15. Goodbye
        // =========================

        else if (
          userMessage === "bye" ||
          userMessage.includes("goodbye") ||
          userMessage.includes("see you")
        ) {
          reply =
            "Goodbye! 👋 Have a wonderful day and enjoy your TasteBite experience.";
        }

        // =========================
        // 16. Help
        // =========================

        else if (
          userMessage === "help" ||
          userMessage.includes("what can you do") ||
          userMessage.includes("help me")
        ) {
          reply =
            "I can help you with our menu, food prices, opening hours, location, delivery, pickup, payment methods, reservations, and ordering information. 😊";
        }

        // =========================
        // 17. Default Response
        // =========================

        else {
          reply =
            "I'm here to help with TasteBite's menu, prices, orders, delivery, opening hours, location, reservations, and contact information. What would you like to know?";
        }
      }
    }

    // =========================
    // Success Response
    // =========================

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error(
      "Chatbot error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Sorry, something went wrong. Please try again.",
    });
  }
};

module.exports = {
  chatWithBot,
};

