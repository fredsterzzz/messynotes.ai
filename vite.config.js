import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_STRIPE_PUBLIC_KEY': JSON.stringify(import.meta.env.VITE_STRIPE_PUBLIC_KEY),
    'import.meta.env.VITE_STRIPE_BASIC_PRICE_ID': JSON.stringify(import.meta.env.VITE_STRIPE_BASIC_PRICE_ID),
    'import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID': JSON.stringify(import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID),
    'import.meta.env.VITE_STRIPE_TEAM_PRICE_ID': JSON.stringify(import.meta.env.VITE_STRIPE_TEAM_PRICE_ID),
  },
})
