import { create } from "zustand";
import supabase from "../utils/supabase";

export const useProductStore = create((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  // Fetch all products from Supabase
  fetchProducts: async () => {
    // Don't fetch if already loaded
    if (get().products.length > 0 && !get().error) return;
    
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Normalize category to array
      const normalizedProducts = (data || []).map((p) => ({
        ...p,
        stock: p.stock !== undefined ? p.stock : 0,
        category: Array.isArray(p.category) ? p.category : [p.category].filter(Boolean),
      }));

      set({ products: normalizedProducts, isLoading: false });
    } catch (error) {
      console.error("Error fetching products:", error.message);
      set({ error: error.message, isLoading: false });
    }
  },

  // Force refresh products
  refreshProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const normalizedProducts = (data || []).map((p) => ({
        ...p,
        stock: p.stock !== undefined ? p.stock : 0,
        category: Array.isArray(p.category) ? p.category : [p.category].filter(Boolean),
      }));

      set({ products: normalizedProducts, isLoading: false });
    } catch (error) {
      console.error("Error fetching products:", error.message);
      set({ error: error.message, isLoading: false });
    }
  },

  // Get a single product by ID
  getProductById: (id) => {
    return get().products.find((p) => p.id == id);
  },

  // Add a new product
  addProduct: async (productData) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .insert(productData)
        .select()
        .single();

      if (error) throw error;

      const normalizedProduct = {
        ...data,
        stock: data.stock !== undefined ? data.stock : 0,
        category: Array.isArray(data.category) ? data.category : [data.category].filter(Boolean),
      };

      set((state) => ({
        products: [normalizedProduct, ...state.products],
      }));

      return { success: true, data: normalizedProduct };
    } catch (error) {
      console.error("Error adding product:", error.message);
      return { success: false, error: error.message };
    }
  },

  // Update an existing product
  updateProduct: async (id, productData) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      const normalizedProduct = {
        ...data,
        stock: data.stock !== undefined ? data.stock : 0,
        category: Array.isArray(data.category) ? data.category : [data.category].filter(Boolean),
      };

      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? normalizedProduct : p
        ),
      }));

      return { success: true, data: normalizedProduct };
    } catch (error) {
      console.error("Error updating product:", error.message);
      return { success: false, error: error.message };
    }
  },

  // Delete a product
  deleteProduct: async (id) => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;

      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));

      return { success: true };
    } catch (error) {
      console.error("Error deleting product:", error.message);
      return { success: false, error: error.message };
    }
  },
}));
