import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState } from "../types/auth.types";

interface AuthStore extends AuthState {
  login: (token: string, username: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      username: null,
      isAuthenticated: false,

      login: (token, username) => {
        localStorage.setItem("brainly_token", token);
        localStorage.setItem("brainly_username", username);
        set({ token, username, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem("brainly_token");
        localStorage.removeItem("brainly_username");
        set({ token: null, username: null, isAuthenticated: false });
      },
    }),
    {
      name: "brainly_auth",
      partialize: (state) => ({
        token: state.token,
        username: state.username,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
