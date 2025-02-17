import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import './Pricing.css';

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [plans, setPlans] = useState([]);
  const [stripe, setStripe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Stripe
    const initStripe = async () => {
      const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
      console.log('Stripe key available:', !!stripeKey);
      
      if (!stripeKey) {
        console.error('Stripe public key not found in environment variables');
        setError('Payment system configuration error');
        return;
      }

      if (window.Stripe) {
        try {
          const stripeInstance = window.Stripe(stripeKey);
          console.log('Stripe initialized successfully');
          setStripe(stripeInstance);
        } catch (err) {
          console.error('Failed to initialize Stripe:', err);
          setError('Failed to initialize payment system');
        }
      } else {
        console.error('Stripe.js not loaded');
        setError('Payment system not loaded');
      }
    };

    initStripe();
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const db = getFirestore();
        const plansCollection = collection(db, 'plans');
        const plansSnapshot = await getDocs(plansCollection);
        const plansData = plansSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPlans(plansData);
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('Failed to load pricing plans');
      }
    };

    fetchPlans();
  }, []);

  const handlePlanSelection = async (plan) => {
    if (plan.isFree) {
      navigate('/dashboard');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (!stripe) {
        throw new Error('Payment system not initialized');
      }

      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          priceId: plan.priceId,
          successUrl: window.location.origin + '/dashboard?success=true',
          cancelUrl: window.location.origin + '/pricing?canceled=true'
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
              disabled={loading || !stripe}
              className={`${loading ? 'loading' : ''} ${plan.id === 'premium' ? 'featured-button' : ''}`}
            >
              {loading ? 'Processing...' : !stripe ? 'Loading...' : plan.isFree ? 'Try Now' : 'Subscribe'}
            </button>
          </div>
        ))}
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
