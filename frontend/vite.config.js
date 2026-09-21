import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // host: true expone el dev server en la LAN para poder abrirlo desde el movil.
    host: true,
    port: 5173,
    // allowedHosts: true acepta hostnames de tuneles (cloudflared, ngrok).
    allowedHosts: true,
    // El proxy hace que /api salga por el mismo origen que la app: una sola URL
    // que exponer al movil y cero problemas de CORS.
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
