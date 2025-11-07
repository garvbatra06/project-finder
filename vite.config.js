import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allow network access
  },
  preview: {
    host: true,
    allowedHosts: [
      "campus-project-finder-wvit.onrender.com", // keep Render if you still use it
      "project-finder.vercel.app",               // Vercel domain
    ],
  },
});
