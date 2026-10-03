import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,        // permet l'accès depuis d'autres appareils
    port: 5173,        // ici tu peux mettre 5174 si le 5173 est utilisé ailleurs
    strictPort: true,  // empêche de changer automatiquement le port
  },
});
