import { create } from "zustand";
import supabase from "../utils/supabase";

export const useOrderStore = create((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,

  // Fetch all orders from Supabase
  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      set({ orders: data || [], isLoading: false });
    } catch (error) {
      console.error("Error fetching orders:", error.message);
      set({ error: error.message, isLoading: false });
    }
  },

  // Get a single order by ID
  getOrderById: (id) => {
    return get().orders.find((o) => o.id === id);
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
      }));

      return { success: true, data };
    } catch (error) {
      console.error("Error updating order status:", error.message);
      return { success: false, error: error.message };
    }
  },

  // Delete an order
  deleteOrder: async (id) => {
    try {
      const { error } = await supabase.from("orders").delete().eq("id", id);

      if (error) throw error;

      set((state) => ({
        orders: state.orders.filter((o) => o.id !== id),
      }));

      return { success: true };
    } catch (error) {
      console.error("Error deleting order:", error.message);
      return { success: false, error: error.message };
    }
  },

  // Get order statistics
  getOrderStats: () => {
    const orders = get().orders;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum, o) => sum + (Number(o.total_price) || 0),
      0,
    );
    const pendingOrders = orders.filter(
      (o) => !o.status || o.status === "pending",
    ).length;
    const completedOrders = orders.filter(
      (o) => o.status === "delivered",
    ).length;

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
    };
  },

  // Subscribe to real-time order updates
  subscribeToOrders: () => {
    const channel = supabase
      .channel("orders-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;

          set((state) => {
            let updatedOrders = [...state.orders];

            if (eventType === "INSERT") {
              // Add new order at the beginning (since we order by created_at desc)
              updatedOrders = [newRecord, ...updatedOrders];
            } else if (eventType === "UPDATE") {
              // Update existing order
              updatedOrders = updatedOrders.map((order) =>
                order.id === newRecord.id ? newRecord : order,
              );
            } else if (eventType === "DELETE") {
              // Remove deleted order
              updatedOrders = updatedOrders.filter(
                (order) => order.id !== oldRecord.id,
              );
            }

            return { orders: updatedOrders };
          });
        },
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(channel);
    };
  },
}));
