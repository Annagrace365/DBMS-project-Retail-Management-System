import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // ensure SPA routing works in development
    historyApiFallback: true, 
  },
  build: {
    outDir: 'dist',
  },
});
