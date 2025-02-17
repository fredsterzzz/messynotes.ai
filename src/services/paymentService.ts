import { loadStripe } from '@stripe/stripe-js';
import { getAuth, getFirestore, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth } from '../lib/firebase';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);
const API_URL = 'http://localhost:3001'; // Our Express backend

const db = getFirestore();

export class PaymentService {
  static async createSubscription(priceId: string) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User must be logged in to create a subscription');
      }

      // Call our backend to create a checkout session
      const response = await fetch(`${API_URL}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user.uid,
          email: user.email,
        }),
      });

      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  static async getSubscriptionStatus() {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be logged in to check subscription status');
    }

    // Get status from Firestore (this stays the same)
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);
    const userData = userDocSnap.data();
    return userData?.subscriptionStatus || 'inactive';
  }

  static async cancelSubscription(subscriptionId: string) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User must be logged in to cancel subscription');
      }

      const response = await fetch(`${API_URL}/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      });

      return await response.json();
    } catch (error: any) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  static async updateSubscription(subscriptionId: string, newPriceId: string) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User must be logged in to update subscription');
      }

      const response = await fetch(`${API_URL}/update-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId, newPriceId }),
      });

      return await response.json();
    } catch (error: any) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  static async handleSubscriptionSuccess(sessionId: string) {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be logged in');
    }

    // Update user's subscription status in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, {
      subscriptionStatus: 'active',
      lastUpdated: new Date(),
    });
  }
}
