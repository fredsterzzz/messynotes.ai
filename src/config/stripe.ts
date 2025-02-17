import { loadStripe } from '@stripe/stripe-js';

// Stripe price IDs for different subscription plans
export const STRIPE_PRICE_IDS = {
  BASIC: process.env.VITE_STRIPE_BASIC_PRICE_ID || '',
  PRO: process.env.VITE_STRIPE_PRO_PRICE_ID || '',
  ENTERPRISE: process.env.VITE_STRIPE_ENTERPRISE_PRICE_ID || ''
};

const stripeKey = process.env.VITE_STRIPE_PUBLIC_KEY;
if (!stripeKey) {
  throw new Error('Missing VITE_STRIPE_PUBLIC_KEY environment variable');
}

export const stripePromise = loadStripe(stripeKey);
