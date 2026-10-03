import { create } from "zustand";
import * as storage from "../utils/storage";
import axiosInstance from "../config/axiosInstance";

const useAuthStore = create((set, get) => ({
  token: storage.getToken(),
  role: storage.getRole(),
  status: "idle",
  error: null,

  isAuthenticated: () => Boolean(get().token),

  login: async ({ username, password }) => {
    set({ status: "loading", error: null });
    try {
      const response = await axiosInstance.post("/login", {
        username,
        password,
      });

      const { token, role } = response.data;

      storage.setToken(token);
      storage.setRole(role);
      set({ token, role, status: "succeeded", error: null });

      console.log("Login success:", token, role); // ✅ Debugging
      return true;
    } catch (error) {
      let message = "Login failed";
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      set({ status: "failed", error: message });
      throw new Error(message);
    }
  },

  logout: () => {
    storage.clearStorage();
    set({ token: null, role: null, status: "idle", error: null });
  },

  initialize: () => {
    const token = storage.getToken();
    const role = storage.getRole();
    if (token) {
      set({ token, role });
    }
  },
}));

export default useAuthStore;