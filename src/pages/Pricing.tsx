/** @jsxImportSource react */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { STRIPE_PRICE_IDS } from '../config/stripe';

interface PricingTier {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  priceId: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$9/month',
    description: 'Perfect for individuals and small projects',
    features: [
      'Up to 100 notes',
      'Basic AI transformations',
      'Email support',
      'Basic templates'
    ],
    priceId: STRIPE_PRICE_IDS.BASIC
  },
  {
    id: 'pro',
    name: 'Professional',
    price: '$29/month',
    description: 'For professionals and growing teams',
    features: [
      'Unlimited notes',
      'Advanced AI transformations',
      'Priority support',
      'Custom templates',
      'Advanced analytics'
    ],
    priceId: STRIPE_PRICE_IDS.PRO
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$99/month',
    description: 'For large organizations and teams',
    features: [
      'Everything in Pro',
      'Custom AI models',
      'Dedicated support',
      'API access',
      'SSO & advanced security',
      'Custom integrations'
    ],
    priceId: STRIPE_PRICE_IDS.ENTERPRISE
  }
];

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubscribe = async (tier: PricingTier) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: tier.priceId,
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`,
          email: user?.email || undefined
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      navigate(`/checkout?session=${sessionId}`);
    } catch (err) {
      console.error('Subscription error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pricing-container">
      <h1>Choose Your Plan</h1>
      {error && <div className="error-message">{error}</div>}
      
      <div className="pricing-grid">
        {pricingTiers.map((tier) => (
          <div key={tier.id} className="pricing-card">
            <h2>{tier.name}</h2>
            <p className="price">{tier.price}</p>
            <p className="description">{tier.description}</p>
            <ul className="features">
              {tier.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe(tier)}
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