import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8060",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Active l'envoi des cookies (si utilisé)
});

// Intercepteur de requête
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { status } = error.response || {};
    
    if (status === 401 || status === 403) {
      // Supprime le token et redirige vers /login pour les erreurs 401/403
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }
    
    return Promise.reject(error);
  }
);

export default instance;