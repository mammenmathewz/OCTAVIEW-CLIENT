import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
      alias: {
        '@': path.resolve(__dirname), // Points to the project root
      },
      
  },
  css: {
    postcss: './postcss.config.js',
  },
});
