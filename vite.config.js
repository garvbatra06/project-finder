import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
    include: [
      "firebase/app",
      "firebase/auth",
      "firebase/firestore",
      "firebase/analytics"
    ],
  },
  define: {
    global: "window", // ✅ fixes some env mismatches
  },
});
