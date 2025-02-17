import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getStripe } from '../config/stripe';
import './Pricing.css';

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

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

      console.log('💳 Selected plan:', plan);

      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Failed to initialize payment system');
      }

      console.log('💳 Creating checkout session for price:', plan.priceId);

      // Create checkout session
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const data = await response.json();
      console.log('💳 Checkout session created:', data);

      // Redirect to checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('❌ Checkout error:', err);
      setError(err.message || 'Something went wrong with the checkout process');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pricing-container">
      <h1>Choose Your Plan</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="pricing-grid">
        {plans.map((plan) => (
          <div key={plan.id} className="pricing-card">
            <h2>{plan.name}</h2>
            <p className="price">{plan.price}</p>
            <p className="description">{plan.description}</p>
            <ul className="features">
              {plan.features?.map((feature, index) => (
                <li key={index} className={feature.included ? 'included' : 'not-included'}>
                  {feature.included ? '✓' : '✕'} {feature.name}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handlePlanSelection(plan)}
              disabled={loading}
              className="subscribe-button"
            >
              {loading ? 'Processing...' : 'Subscribe Now'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
