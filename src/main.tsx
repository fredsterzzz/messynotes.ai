import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Debug: Log environment variables at app startup
console.log('🔑 Stripe Public Key:', import.meta.env.VITE_STRIPE_PUBLIC_KEY);
console.log('📦 All Environment Variables:', import.meta.env);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
