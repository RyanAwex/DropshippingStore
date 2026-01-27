export const products = [
  {
    id: 1,
    category: "Apparel",
    title: "Structured Linen Chore Coat",
    price: 185.0,
    rating: 4.8,
    reviews: 124,
    stock: 25,
    description:
      "A timeless staple for the modern wardrobe. Crafted from heavyweight Belgian linen, this chore coat features a boxy, relaxed fit designed for layering. Finished with reinforced stitching and sustainable corozo buttons.",
    details: [
      "100% Belgian Linen",
      "Boxy, relaxed fit",
      "Three exterior patch pockets",
      "Made in Portugal",
    ],
    images: [
      "https://placehold.co/600x800/e0e0e0/333",
      "https://placehold.co/600x800/d4d4d4/333",
      "https://placehold.co/600x800/c0c0c0/333",
      "https://placehold.co/600x800/a0a0a0/333",
    ],
    options: [
      {
        type: "color",
        name: "Color",
        values: [
          { label: "Sand", value: "#E5E0D6" },
          { label: "Charcoal", value: "#374151" },
          { label: "Olive", value: "#566246" },
        ],
      },
      {
        type: "text",
        name: "Size",
        values: ["S", "M", "L", "XL", "XXL"],
      },
    ],
  },
  {
    id: 2,
    category: "Footwear",
    title: "Minimalist Leather Trainer",
    price: 210.0,
    rating: 4.9,
    reviews: 86,
    stock: 15,
    description:
      "Handcrafted in Italy from full-grain leather. Features a durable rubber sole and a cushioned footbed for all-day comfort.",
    details: [
      "Full-grain Italian leather",
      "Margom rubber sole",
      "Waxed cotton laces",
      "Hand-stitched construction",
    ],
    images: [
      "https://placehold.co/600x800/f5f5f5/333",
      "https://placehold.co/600x800/eaeaea/333",
      "https://placehold.co/600x800/dcdcdc/333",
    ],
    options: [
      {
        type: "color",
        name: "Colorway",
        values: [
          { label: "All White", value: "#ffffff" },
          { label: "Black/Gum", value: "#000000" },
          { label: "Grey Suede", value: "#808080" },
        ],
      },
      {
        type: "text", // Renders as square boxes
        name: "EU Size",
        values: ["39", "40", "41", "42", "43", "44", "45"],
      },
    ],
  },
  {
    id: 3,
    category: "Living",
    title: "Oslo Lounge Chair",
    price: 850.0,
    rating: 5.0,
    reviews: 42,
    stock: 8,
    description:
      "A mid-century inspired lounge chair with a solid wood frame and premium wool blend upholstery.",
    details: [
      "Solid Oak or Walnut frame",
      "High-density foam cushion",
      "Wool blend fabric (80% wool)",
      "No assembly required",
    ],
    images: [
      "https://placehold.co/600x800/e0e0e0/333",
      "https://placehold.co/600x800/d4d4d4/333",
    ],
    options: [
      {
        type: "text", // Renders as boxes containing text
        name: "Wood Finish",
        values: ["Natural Oak", "Dark Walnut", "Black Ash"],
      },
      {
        type: "color",
        name: "Upholstery",
        values: [
          { label: "Pebble Grey", value: "#b0b0b0" },
          { label: "Midnight Blue", value: "#191970" },
          { label: "Rust Orange", value: "#b7410e" },
        ],
      },
    ],
  },
  {
  id: 4,
  category: "Accessories",
  title: "Pro Noise-Canceling Headphones",
  price: 349.00,
  rating: 4.7,
  reviews: 215,
  stock: 30,
  description: "Industry-leading noise cancellation with 30-hour battery life and premium audio fidelity.",
  details: ["Active Noise Cancellation", "Transparency Mode", "USB-C Fast Charging", "Bluetooth 5.2"],
  images: [
    "https://placehold.co/600x800/1a1a1a/fff",
    "https://placehold.co/600x800/333333/fff",
  ],
  options: [
    {
      type: "color",
      name: "Finish",
      values: [
        { label: "Matte Black", value: "#1a1a1a" },
        { label: "Silver", value: "#e0e0e0" }
      ]
    },
    {
      type: "text",
      name: "Bundle",
      values: ["Standard", "Travel Kit (+ $50)"]
    }
  ]
},
  {
    id: 5,
    category: "Tech",
    title: "Smart Home Speaker",
    price: 129.0,
    rating: 4.6,
    reviews: 98,
    stock: 40,
    description:
      "Voice-controlled smart speaker with premium sound quality and seamless smart home integration.",
    details: [
      "360-degree sound",
      "Built-in voice assistant",
      "Multi-room audio support",
      "Compatible with major smart home platforms",
    ],
    images: [
      "https://placehold.co/600x800/000000/fff",
      "https://placehold.co/600x800/1a1a1a/fff",
    ],
    options: [
      {
        type: "color",
        name: "Color",
        values: [
          { label: "Charcoal", value: "#333333" },
          { label: "Heather Gray", value: "#b0b0b0" },
          { label: "Navy Blue", value: "#000080" },
        ],
      },
      {
        type: "text",
        name: "Storage",
        values: ["32GB", "64GB (+ $30)"],
      },
    ],
  },
  {
    id: 6,
    category: "Outdoors",
    title: "All-Weather Hiking Backpack",
    price: 199.0,
    rating: 4.9,
    reviews: 67,
    stock: 20,
    description:
      "Durable and spacious hiking backpack with weather-resistant materials and ergonomic design for all-day comfort.",
    details: [
      "Water-resistant fabric",
      "Multiple compartments and pockets",
      "Padded shoulder straps and back panel",
      "Hydration bladder compatible",
    ],
    images: [
      "https://placehold.co/600x800/4b5320/fff",
      "https://placehold.co/600x800/556b2f/fff",
    ],
    options: [
      {
        type: "color",
        name: "Color",
        values: [
          { label: "Forest Green", value: "#4b5320" },
          { label: "Desert Tan", value: "#d2b48c" },
          { label: "Midnight Black", value: "#000000" },
        ],
      },
      {
        type: "text",
        name: "Capacity",
        values: ["30L", "50L (+ $40)"],
      },
    ],
  },
  {
    id: 7,
    category: "Kitchen",
    title: "Professional Chef's Knife",
    price: 120.0,
    rating: 4.8,
    reviews: 150,
    stock: 12,
    description:
      "High-carbon stainless steel chef's knife with ergonomic handle for precision cutting and durability.",
    details: [
      "8-inch high-carbon stainless steel blade",
      "Ergonomic pakkawood handle",
      "Full tang construction",
      "Handcrafted in Japan",
    ],
    images: [
      "https://placehold.co/600x800/c0c0c0/333",
      "https://placehold.co/600x800/a0a0a0/333",
    ],
    options: [
      {
        type: "text",
        name: "Handle Material",
        values: ["Pakkawood", "Micarta (+ $20)"],
      },
      {
        type: "text",
        name: "Blade Finish",
        values: ["Polished", "Hammered (+ $15)"],
      },
    ],
  },
];