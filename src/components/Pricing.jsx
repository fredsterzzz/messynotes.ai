import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import './Pricing.css';

// Initialize Stripe with the public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: '$9.99/mo',
      description: 'Perfect for getting started',
      features: [
        '50 AI transformations per month',
        'Basic templates',
        'Email support'
      ],
      priceId: import.meta.env.VITE_STRIPE_BASIC_PRICE_ID
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: '$19.99/mo',
      description: 'For growing businesses',
      features: [
        'Unlimited AI transformations',
        'All templates',
        'Priority support',
        'Advanced customization'
      ],
      priceId: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID
    },
    {
      id: 'team',
      name: 'Team Plan',
      price: '$49.99/mo',
      description: 'Best for teams',
      features: [
        'Everything in Premium',
        'Team collaboration',
        'Admin dashboard',
        'API access'
      ],
      priceId: import.meta.env.VITE_STRIPE_TEAM_PRICE_ID
    }
  ];

  const handleCheckout = async (priceId) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Starting checkout with priceId:', priceId);
      
      // Get Stripe instance
      const stripe = await stripePromise;
      console.log('Stripe loaded:', !!stripe);
      
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      console.log('Creating checkout session...');
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
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pricing-container">
      <h2>Choose Your Plan</h2>
      <div className="pricing-grid">
        {plans.map((plan) => (
          <div key={plan.id} className="pricing-card">
            <h3>{plan.name}</h3>
            <p className="price">{plan.price}</p>
            <p className="description">{plan.description}</p>
            <ul className="features">
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout(plan.priceId)}
              disabled={loading}
              className={loading ? 'loading' : ''}
            >
              {loading ? 'Processing...' : 'Subscribe'}
            </button>
          </div>
        ))}
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
