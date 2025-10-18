import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    proxy: {
      "/jconnect": "http://localhost:3000",
      "/img": "http://localhost:3000",
      "/files": "http://localhost:3000",
    },
  },
  plugins: [tailwindcss(), react()],
});
