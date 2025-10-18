import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    proxy: {
      "/jconnect": "https://jconnect-server.onrender.com",
      "/img": "https://jconnect-server.onrender.com",
      "/files": "https://jconnect-server.onrender.com",
    },
  },
  plugins: [tailwindcss(), react()],
  base: "/",
});
