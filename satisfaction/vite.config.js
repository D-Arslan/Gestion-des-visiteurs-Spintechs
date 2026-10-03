import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,       // écoute sur 0.0.0.0 = toutes les adresses IP de la machine
    port: 5174,       // ou 5174 selon ton choix
    strictPort: true, // empêche Vite de changer le port automatiquement
  },
})
