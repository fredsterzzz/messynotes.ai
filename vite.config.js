import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VITE_STRIPE_PUBLIC_KEY': JSON.stringify(process.env.VITE_STRIPE_PUBLIC_KEY),
    'process.env.VITE_STRIPE_BASIC_PRICE_ID': JSON.stringify(process.env.VITE_STRIPE_BASIC_PRICE_ID),
    'process.env.VITE_STRIPE_PREMIUM_PRICE_ID': JSON.stringify(process.env.VITE_STRIPE_PREMIUM_PRICE_ID),
    'process.env.VITE_STRIPE_TEAM_PRICE_ID': JSON.stringify(process.env.VITE_STRIPE_TEAM_PRICE_ID),
  },
})
