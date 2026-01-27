import { create } from "zustand";
import { persist } from "zustand/middleware";
import supabase from "../utils/supabase";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      isAdmin: false,
      error: null,
      isLoading: false,
      isCheckingAuth: true,
      message: null,

      signup: async (email, password, options = {}) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options,
          });
          if (error) throw error;
          set({
            user: data.user,
            isAuthenticated: !!data.user,
            isAdmin: data.user?.app_metadata?.role === "admin",
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error.message || "Error signing up",
            isLoading: false,
          });
          throw error;
        }
      },
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          set({
            isAuthenticated: true,
            user: data.user,
            isAdmin: data.user?.app_metadata?.role === "admin",
            error: null,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error.message || "Error logging in",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({
            user: null,
            isAuthenticated: false,
            isAdmin: false,
            error: null,
            isLoading: false,
          });
        } catch (error) {
          set({ error: "Error logging out", isLoading: false });
          throw error;
        }
      },
      verifyEmail: async (email, code) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.verifyOtp({
            email,
            token: code,
            type: "signup",
          });
          if (error) throw error;
          set({
            user: data.user,
            isAuthenticated: true,
            isAdmin: data.user?.app_metadata?.role === "admin",
            isLoading: false,
          });
          return data;
        } catch (error) {
          set({
            error: error.message || "Error verifying email",
            isLoading: false,
          });
          throw error;
        }
      },
      checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();
          if (error) throw error;
          set({
            user: session?.user || null,
            isAuthenticated: !!session,
            isAdmin: session?.user?.app_metadata?.role === "admin",
            isCheckingAuth: false,
          });
        } catch (error) {
          set({
            error: error.message || "Error checking auth",
            isCheckingAuth: false,
            isAuthenticated: false,
          });
        }
      },
      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
          });
          if (error) throw error;
          set({ message: "Password reset email sent", isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || "Error sending reset password email",
          });
          throw error;
        }
      },
      resetPassword: async (password) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase.auth.updateUser({ password });
          if (error) throw error;
          set({ message: "Password updated successfully", isLoading: false });
        } catch (error) {
          set({
            error: error.message || "Error resetting password",
            isLoading: false,
          });
          throw error;
        }
      },
      deleteAccount: async () => {
        set({ isLoading: true, error: null });
        try {
          // Note: Supabase deleteUser requires admin privileges
          const { error } = await supabase.auth.admin.deleteUser(
            supabase.auth.user.id,
          );
          if (error) throw error;
          set({
            user: null,
            isAuthenticated: false,
            isAdmin: false,
            error: null,
            isLoading: false,
          });
        } catch (error) {
          set({ error: "Error deleting account", isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    },
  ),
);
