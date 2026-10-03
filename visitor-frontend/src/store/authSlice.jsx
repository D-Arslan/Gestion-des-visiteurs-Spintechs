import { create } from "zustand";
import axios from "../config/axiosInstance";

const useAuthStore = create((set) => ({
  token: localStorage.getItem("token") || null,
  role: localStorage.getItem("role") || null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,

  login: async (credentials) => {
  set({ status: "loading", error: null });
  
  try {
    const response = await axios.post("/auth/login", {
      username: credentials.username, // Utilisez directement credentials.username
      password: credentials.password
    });
    
    const { token, role } = response.data;
    
    // Supprimez la normalisation du rôle
    localStorage.setItem("token", token);
    localStorage.setItem("role", role); // Stockez le rôle exact (ROLE_ADMIN/ROLE_USER)
    
    set({ 
      token,
      role,
      status: "succeeded",
      error: null
    });
    
    return true;
    } catch (error) {
      let errorMessage = "Login failed";
      
      if (error.response) {
        // Handle API response errors
        errorMessage = error.response.data?.message || 
                      `Error: ${error.response.status}`;
      } else if (error.request) {
        // Handle network errors
        errorMessage = "Network error - cannot reach server";
      }
      
      set({ 
        status: "failed",
        error: errorMessage
      });
      
      throw errorMessage;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    set({ 
      token: null,
      role: null,
      status: "idle",
      error: null
    });
  },

  // Optional: Initialize state from storage
  initialize: () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
      set({ token, role });
    }
  }
}));

export default useAuthStore;