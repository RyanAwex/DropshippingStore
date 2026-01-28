import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],

      // --- ADD TO CART ---
  addToCart: (product, selectedOptions = {}, quantity = 1) => {
    // 1. Generate a Unique ID for this specific variation
    // Example: "1-Color:Sand-Size:M"
    const optionsKey = Object.entries(selectedOptions)
      .sort()
      .map(([key, val]) => `${key}:${val}`)
      .join("-");
    
    const uniqueId = `${product.id}-${optionsKey}`;

    const newItem = {
      cartId: uniqueId, // Used as key in the list
      productId: product.id,
      title: product.title,
      price: parseFloat(product.price),
      image: product.images?.[0] || null, // Store first image
      selectedOptions, 
      quantity,
    };

    set((state) => {
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.cartId === uniqueId
      );

      if (existingItemIndex > -1) {
        // Item exists? Just increase quantity
        const updatedItems = [...state.cartItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return { cartItems: updatedItems };
      } else {
        // New item? Add to list
        return { cartItems: [...state.cartItems, newItem] };
      }
    });

    // Persist changes is handled by persist middleware
  },

  // --- REMOVE FROM CART ---
  removeFromCart: (cartId) => {
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.cartId !== cartId),
    }));
  },

  // --- UPDATE QUANTITY ---
  updateQuantity: (cartId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(cartId);
      return;
    }

    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.cartId === cartId ? { ...item, quantity } : item
      ),
    }));
  },

  // --- CLEAR CART ---
  clearCart: () => {
    set({ cartItems: [] });
  },

  // --- GETTERS ---
  getCartTotal: () => {
    return get().cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  },

  getCartItemCount: () => {
    return get().cartItems.reduce((count, item) => count + item.quantity, 0);
  },
}),
    {
      name: 'vraxia-cart',
    }
  )
);