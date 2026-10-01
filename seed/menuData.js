const menuItems = [

  // =========================
  // BURGERS
  // =========================

  {
    name: "Classic Beef Burger",
    category: "Burgers",
    price: 900,
    rating: 4.9,
    description:
      "Juicy grilled beef patty with cheddar cheese, fresh lettuce, tomato, pickles, and special sauce.",
    image: "/images/burger-classic.webp",
    isFeatured: true,
    isAvailable: true,
  },

  {
    name: "Double Cheese Burger",
    category: "Burgers",
    price: 1050,
    rating: 4.8,
    description:
      "Two juicy beef patties layered with melted cheddar, caramelized onions, and signature sauce.",
    image: "/images/burger-double-cheese.webp",
    isFeatured: true,
    isAvailable: true,
  },

  {
    name: "Crispy Chicken Burger",
    category: "Burgers",
    price: 850,
    rating: 4.7,
    description:
      "Crispy golden chicken fillet with lettuce, fresh tomato, and creamy house dressing.",
    image: "/images/burger-crispy-chicken.webp",
    isFeatured: false,
    isAvailable: true,
  },

  {
    name: "BBQ Bacon Burger",
    category: "Burgers",
    price: 1150,
    rating: 4.9,
    description:
      "Grilled beef patty topped with crispy bacon, cheddar cheese, caramelized onions, and smoky BBQ sauce.",
    image: "/images/burger-bbq.webp",
    isFeatured: true,
    isAvailable: true,
  },

  {
    name: "Spicy Jalapeno Burger",
    category: "Burgers",
    price: 950,
    rating: 4.6,
    description:
      "Spicy beef burger with jalapenos, pepper jack cheese, crispy onions, and spicy sauce.",
    image: "/images/burger-jalapeno.webp",
    isFeatured: false,
    isAvailable: true,
  },

  // =========================
  // PIZZA
  // =========================

  {
    name: "Italian Margherita Pizza",
    category: "Pizza",
    price: 1200,
    rating: 4.8,
    description:
      "Crispy Italian crust topped with tomato sauce, fresh mozzarella, and aromatic basil.",
    image: "/images/pizza-margherita.webp",
    isFeatured: true,
    isAvailable: true,
  },

  {
    name: "Pepperoni Pizza",
    category: "Pizza",
    price: 1300,
    rating: 4.9,
    description:
      "Classic pizza topped with rich tomato sauce, mozzarella cheese, and premium pepperoni.",
    image: "/images/pizza-pepperoni.webp",
    isFeatured: true,
    isAvailable: true,
  },

  {
    name: "BBQ Chicken Pizza",
    category: "Pizza",
    price: 1350,
    rating: 4.8,
    description:
      "Smoky BBQ chicken combined with mozzarella, red onions, herbs, and BBQ drizzle.",
    image: "/images/pizza-bbq-chicken.webp",
    isFeatured: true,
    isAvailable: true,
  },

  {
    name: "Four Cheese Pizza",
    category: "Pizza",
    price: 1450,
    rating: 4.7,
    description:
      "A rich blend of mozzarella, cheddar, parmesan, and blue cheese on a crispy crust.",
    image: "/images/pizza-four-cheese.webp",
    isFeatured: false,
    isAvailable: true,
  },

  {
    name: "Spicy Beef Pizza",
    category: "Pizza",
    price: 1350,
    rating: 4.7,
    description:
      "Crispy pizza topped with seasoned beef, jalapenos, mozzarella, onions, and chili sauce.",
    image: "/images/pizza-spicy-beef.webp",
    isFeatured: false,
    isAvailable: true,
  },

  // =========================
  // PASTA
  // =========================

  {
    name: "Creamy Chicken Pasta",
    category: "Pasta",
    price: 1050,
    rating: 4.9,
    description:
      "Creamy pasta with grilled chicken, parmesan cheese, fresh herbs, and black pepper.",
    image: "/images/pasta-chicken.webp",
    isFeatured: true,
    isAvailable: true,
  },

  {
    name: "Chicken Alfredo",
    category: "Pasta",
    price: 1100,
    rating: 4.8,
    description:
      "Tender grilled chicken tossed with perfectly cooked pasta in a rich Alfredo sauce.",
    image: "/images/pasta-alfredo.webp",
    isFeatured: true,
    isAvailable: true,
  },

  {
    name: "Creamy Mushroom Pasta",
    category: "Pasta",
    price: 950,
    rating: 4.6,
    description:
      "Silky cream sauce with sauteed mushrooms, parmesan cheese, garlic, and Italian herbs.",
    image: "/images/pasta-mushroom..webp",
    isFeatured: false,
    isAvailable: true,
  },

  {
    name: "Spicy Arrabbiata Pasta",
    category: "Pasta",
    price: 900,
    rating: 4.7,
    description:
      "Classic Italian pasta with spicy tomato sauce, garlic, chili flakes, and fresh basil.",
    image: "/images/pasta-arrabbiata.webp",
    isFeatured: false,
    isAvailable: true,
  },

  // =========================
  // CHICKEN
  // =========================

  {
    name: "Grilled Chicken",
    category: "Chicken",
    price: 1350,
    rating: 4.8,
    description:
      "Tender grilled chicken served with roasted vegetables and creamy mashed potatoes.",
    image: "/images/chicken-grilled.webp",
    isFeatured: false,
    isAvailable: true,
  },

  {
    name: "Herb Grilled Chicken",
    category: "Chicken",
    price: 1450,
    rating: 4.9,
    description:
      "Tender chicken grilled with aromatic herbs and served with seasonal vegetables.",
    image: "/images/chicken-herb.webp",
    isFeatured: true,
    isAvailable: true,
  },

  {
    name: "Crispy Chicken Strips",
    category: "Chicken",
    price: 950,
    rating: 4.7,
    description:
      "Golden crispy chicken strips served with seasoned fries and creamy dipping sauce.",
    image: "/images/chicken-strips.webp",
    isFeatured: false,
    isAvailable: true,
  },

  {
    name: "Spicy Grilled Chicken",
    category: "Chicken",
    price: 1250,
    rating: 4.8,
    description:
      "Juicy grilled chicken marinated with spicy herbs and served with roasted vegetables.",
    image: "/images/chicken-spicy.webp",
    isFeatured: true,
    isAvailable: true,
  },

  // =========================
  // APPETIZERS
  // =========================

  {
    name: "Loaded French Fries",
    category: "Appetizers",
    price: 550,
    rating: 4.7,
    description:
      "Crispy golden fries loaded with cheddar cheese, herbs, and our signature sauce.",
    image: "/images/fries.webp",
    isFeatured: true,
    isAvailable: true,
  },

  {
    name: "Chicken Wings",
    category: "Appetizers",
    price: 800,
    rating: 4.8,
    description:
      "Crispy chicken wings tossed in your choice of spicy, BBQ, or classic sauce.",
    image: "/images/wings.webp",
    isFeatured: true,
    isAvailable: true,
  },

  {
    name: "Garlic Bread",
    category: "Appetizers",
    price: 450,
    rating: 4.6,
    description:
      "Freshly baked garlic bread topped with butter, herbs, and parmesan cheese.",
    image: "/images/garlic-bread.webp",
    isFeatured: false,
    isAvailable: true,
  },

  // =========================
  // DESSERTS
  // =========================

  {
    name: "Chocolate Lava Cake",
    category: "Desserts",
    price: 650,
    rating: 4.9,
    description:
      "Warm chocolate cake with a rich molten center, served with creamy vanilla ice cream.",
    image: "/images/lava-cake.webp",
    isFeatured: true,
    isAvailable: true,
  },

  {
    name: "Classic Cheesecake",
    category: "Desserts",
    price: 600,
    rating: 4.8,
    description:
      "Smooth and creamy cheesecake with a buttery biscuit base and fresh berry topping.",
    image: "/images/cheesecake.webp",
    isFeatured: false,
    isAvailable: true,
  },

  {
    name: "Caramel Brownie",
    category: "Desserts",
    price: 550,
    rating: 4.7,
    description:
      "Rich chocolate brownie topped with warm caramel sauce and a scoop of vanilla ice cream.",
    image: "/images/brownie.webp",
    isFeatured: false,
    isAvailable: true,
  },

  // =========================
  // DRINKS
  // =========================

  {
    name: "Fresh Lemonade",
    category: "Drinks",
    price: 350,
    rating: 4.7,
    description:
      "Refreshing homemade lemonade prepared with fresh lemons and a touch of sweetness.",
    image: "/images/lemonade.webp",
    isFeatured: false,
    isAvailable: true,
  },

  {
    name: "Classic Milkshake",
    category: "Drinks",
    price: 500,
    rating: 4.8,
    description:
      "Thick and creamy milkshake made with premium ice cream and your choice of flavor.",
    image: "/images/milkshake.webp",
    isFeatured: true,
    isAvailable: true,
  },

  {
    name: "Iced Coffee",
    category: "Drinks",
    price: 450,
    rating: 4.6,
    description:
      "Smooth chilled coffee served over ice with creamy milk and a hint of sweetness.",
    image: "/images/iced-coffee.webp",
    isFeatured: false,
    isAvailable: true,
  },

  {
    name: "Fresh Orange Juice",
    category: "Drinks",
    price: 400,
    rating: 4.8,
    description:
      "Freshly squeezed orange juice packed with natural flavor and refreshing citrus notes.",
    image: "/images/orange-juice.webp",
    isFeatured: true,
    isAvailable: true,
  },
];

module.exports = menuItems;