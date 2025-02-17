import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pricing.css';

// Debug: Log when component mounts
export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Debug: Log when component mounts
  useEffect(() => {
    console.log('Pricing component mounted');
  }, []);

  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: '$0/mo',
      description: 'Try it out',
      features: [
        '10 AI transformations per month',
        'Basic templates',
        'Community support'
      ],
      isFree: true
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
      priceId: 'price_1Qs7HCLK65TTfVqUFxzp0do5'
    },
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
      priceId: 'price_1Qs7GWLK65TTfVqUDVqWgAM5'
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
      priceId: 'price_1Qs7GxLK65TTfVqUyR4UOsEd'
    }
  ];

  const handlePlanSelection = async (plan) => {
    if (plan.isFree) {
      navigate('/dashboard');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Initialize Stripe globally
      const stripe = window.Stripe('pk_live_51QrnqvLK65TTfVqUYAMEPVuEwRXvDXXJJkzuBDDRWz6RrZBBHV8KpX9VgUPqhHXhgF2B2VgQKmW9XZvYjY8X6Z00009WKBpXXX');

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          priceId: plan.priceId,
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`
        }),
      });

      const data = await response.json();

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
      setError(err.message || 'Something went wrong with the checkout process');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pricing-container">
      <h2>Choose Your Plan</h2>
      <div className="pricing-grid">
        {plans.map((plan) => (
          <div key={plan.id} className={`pricing-card ${plan.id === 'premium' ? 'featured' : ''}`}>
            {plan.id === 'premium' && <div className="featured-badge">Most Popular</div>}
            <h3>{plan.name}</h3>
            <p className="price">{plan.price}</p>
            <p className="description">{plan.description}</p>
            <ul className="features">
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button
              onClick={() => handlePlanSelection(plan)}
              disabled={loading}
              className={`${loading ? 'loading' : ''} ${plan.id === 'premium' ? 'featured-button' : ''}`}
            >
              {loading ? 'Processing...' : plan.isFree ? 'Try Now' : 'Subscribe'}
            </button>
          </div>
        ))}
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
