import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, DocumentData } from 'firebase/firestore';
import { stripePromise } from '../config/stripe';
import './Pricing.css';

interface Feature {
  name: string;
  included: boolean;
}

interface Plan extends DocumentData {
  id: string;
  name: string;
  price: string;
  description: string;
  priceId: string;
  isFree?: boolean;
  features?: Feature[];
}

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
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
        })) as Plan[];
        setPlans(plansData);
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('Failed to load pricing plans');
      }
    };

    fetchPlans();
  }, []);

  const handlePlanSelection = async (plan: Plan) => {
    if (plan.isFree) {
      navigate('/dashboard');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Failed to initialize payment system');
      }

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

      // Redirect to checkout
      const { error: checkoutError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId
      });

      if (checkoutError) {
        throw checkoutError;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong with the checkout process');
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
