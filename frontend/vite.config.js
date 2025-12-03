import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    strictPort: false,
    proxy: {
      // Node.js backend (existing)
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path // Only proxy /api routes, not root
      },
      // Python backend (for admin dashboard stats and alumni engagement)
      // Note: If Python backend runs on a different port, update target below
      '/api/stats': {
        target: 'http://localhost:3000', // Change to Python backend port if different
        changeOrigin: true,
        secure: false,
      },
      '/api/alumni': {
        target: 'http://localhost:3000', // Change to Python backend port if different
        changeOrigin: true,
        secure: false,
      }
    }
  },
  // Uncomment the base line below if deploying to GitHub Pages
  // base: '/your-repo-name/',
})

