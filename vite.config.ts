import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      buffer: "buffer",
      stream: "stream-browserify",
      util: "util",
      process: "process/browser",
      assert: "assert",
      os: "os-browserify",
      crypto: "crypto-browserify",
    },
  },
  define: {
    global: "window",
  },
  css: {
    postcss: "./postcss.config.js",
  },
  build: {
    chunkSizeWarningLimit: 800, // Increase limit to avoid warnings (Default: 500)
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.split("node_modules/")[1].split("/")[0]; // Creates separate chunks for dependencies
          }
        },
      },
    },
  },
});
