import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// This configuration uses Vite's built-in environment variable handling
export default defineConfig({
  plugins: [react()],
  // Environment variables are automatically handled by Vite
  // No need to manually define them here
})
