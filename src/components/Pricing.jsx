import React, { useState } from 'react';
import './Pricing.css';

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      description: 'Perfect for getting started',
      priceId: 'price_1Qs7GWLK65TTfVqUDVqWgAM5'
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      description: 'For growing businesses',
      priceId: 'price_1Qs7GxLK65TTfVqUyR4UOsEd'
    },
    {
      id: 'team',
      name: 'Team Plan',
      description: 'Best for teams',
      priceId: 'price_1Qs7HCLK65TTfVqUFxzp0do5'
    }
  ];

  const handleCheckout = async (priceId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
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
