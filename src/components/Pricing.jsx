import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import './Pricing.css';

// Debug logging
console.log('Stripe Public Key:', import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Initialize Stripe with the public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debug: Log when component mounts
  useEffect(() => {
    console.log('Pricing component mounted');
    console.log('Environment variables:', {
      publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
      basicPriceId: import.meta.env.VITE_STRIPE_BASIC_PRICE_ID,
      premiumPriceId: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID,
      teamPriceId: import.meta.env.VITE_STRIPE_TEAM_PRICE_ID
    });
  }, []);

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      description: 'Perfect for getting started',
      priceId: import.meta.env.VITE_STRIPE_BASIC_PRICE_ID
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      description: 'For growing businesses',
      priceId: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID
    },
    {
      id: 'team',
      name: 'Team Plan',
      description: 'Best for teams',
      priceId: import.meta.env.VITE_STRIPE_TEAM_PRICE_ID
    }
  ];

  const handleCheckout = async (priceId) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Starting checkout for priceId:', priceId);
      
      // Get Stripe instance
      const stripe = await stripePromise;
      console.log('Stripe loaded:', !!stripe);
      
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      console.log('Fetching checkout session...');
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();
      console.log('Checkout session response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      console.log('Redirecting to checkout...');
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId
      });

      if (error) {
        console.error('Redirect error:', error);
        throw error;
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          {error}
          <button 
            className="error-dismiss" 
            onClick={() => setError(null)}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pricing-container">
      <div className="pricing-grid">
        {plans.map((plan) => (
          <div key={plan.id} className="plan">
            <h3>{plan.name}</h3>
            <p className="plan-description">{plan.description}</p>
            <button
              className={`subscribe-button ${loading ? 'loading' : ''}`}
              onClick={() => handleCheckout(plan.priceId)}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Subscribe Now'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
