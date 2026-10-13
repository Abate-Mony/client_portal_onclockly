import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    // Fixed rather than left to Vite's auto-increment — work.wk already
    // defaults to 5173, and this port is what's allowlisted in the
    // backend's CORS config (server.ts's ALLOWED_ORIGINS).
    port: 5174,
  },
})
