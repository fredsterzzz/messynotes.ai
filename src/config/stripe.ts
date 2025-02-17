import { loadStripe } from '@stripe/stripe-js';

const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
console.log(' [stripe.ts] Raw Stripe Key:', stripeKey);

if (!stripeKey) {
  console.error(' [stripe.ts] Missing VITE_STRIPE_PUBLIC_KEY environment variable');
  throw new Error('Missing VITE_STRIPE_PUBLIC_KEY environment variable');
}

// Initialize Stripe only once
let stripeInstance: any = null;

export const getStripe = async () => {
  if (!stripeInstance) {
    stripeInstance = await loadStripe(stripeKey);
    if (!stripeInstance) {
      console.error(' [stripe.ts] Failed to initialize Stripe');
      throw new Error('Failed to initialize Stripe');
    }
    console.log(' [stripe.ts] Stripe initialized successfully');
  }
  return stripeInstance;
};

// Price IDs for different subscription tiers
export const STRIPE_PRICE_IDS = {
  basic: import.meta.env.VITE_STRIPE_BASIC_PRICE_ID!,
  premium: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID!,
  team: import.meta.env.VITE_STRIPE_TEAM_PRICE_ID!,
} as const;
