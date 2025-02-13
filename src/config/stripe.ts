import { loadStripe } from '@stripe/stripe-js';

const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
if (!stripeKey) {
  throw new Error('Missing VITE_STRIPE_PUBLIC_KEY environment variable');
}

console.log('Initializing Stripe with key:', `${stripeKey.slice(0, 7)}...${stripeKey.slice(-4)}`);

export const stripePromise = loadStripe(stripeKey);

// Price IDs for different subscription tiers
export const STRIPE_PRICE_IDS = {
  basic: import.meta.env.VITE_STRIPE_BASIC_PRICE_ID!,
  premium: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID!,
  team: import.meta.env.VITE_STRIPE_TEAM_PRICE_ID!,
} as const;
