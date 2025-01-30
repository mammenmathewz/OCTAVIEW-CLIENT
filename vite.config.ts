import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      buffer: 'buffer',
      stream: 'stream-browserify',
      util: 'util',
      process: 'process/browser',
      assert: 'assert',
      os: 'os-browserify',
      crypto: 'crypto-browserify', // Add crypto-polyfill
    },
  },
  define: {
    global: 'window', // Define global as window for browser environment
  },
  css: {
    postcss: './postcss.config.js',
  },
});
