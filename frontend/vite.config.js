import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  envPrefix: 'VITE_', // Allows access to VITE_* variables from .env
  build: {
    outDir: 'dist', // Matches Render's publish directory
    assetsDir: 'assets',
  },
  server: {
    port: 5173, // Matches local dev port
    open: true, // Opens browser automatically
  },
})
