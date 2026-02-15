import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, LoginResponse } from "@/types";
import { api } from "@/lib/api";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      _hasHydrated: false,

      login: async (email: string, password: string) => {
        const response = await api.post<LoginResponse>("/auth/login", {
          email,
          password,
        });
        const { accessToken, user } = response.data;

        localStorage.setItem("accessToken", accessToken);

        set({
          user,
          accessToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        localStorage.removeItem("accessToken");
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },

      setUser: (user) => set({ user }),

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },

      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
