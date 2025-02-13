import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { stripePromise, STRIPE_PRICE_IDS } from '../config/stripe';

// Simple check icon component
const CheckIcon = () => (
  <svg
    className="h-6 w-5 flex-none text-indigo-600"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
      clipRule="evenodd"
    />
  </svg>
);

const tiers = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for trying out',
    priceMonthly: '£0',
    priceInterval: 'forever',
    priceId: null, // Free plan doesn't need Stripe
    features: [
      '5 transformations per month',
      'Basic AI tones',
      'Basic templates',
      'Text-only notes',
      'Up to 3 projects',
      'Basic export formats',
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'Great for personal use',
    priceMonthly: '£9.99',
    priceInterval: 'month',
    priceId: STRIPE_PRICE_IDS.basic,
    features: [
      '50 transformations per month',
      'Advanced AI tones',
      'All templates',
      'Text-only notes',
      'Up to 10 projects',
      'Export to PDF & Word',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Perfect for power users',
    priceMonthly: '£14.99',
    priceInterval: 'month',
    priceId: STRIPE_PRICE_IDS.premium,
    popular: true,
    features: [
      '200 transformations per month',
      'All AI tones & templates',
      'All note types',
      'Up to 100 projects',
      'All export formats',
      'Image generation',
      'Up to 5 team members',
      'Custom templates',
    ],
  },
  {
    id: 'team',
    name: 'Team',
    description: 'Best for teams',
    priceMonthly: '£49.99',
    priceInterval: 'month',
    priceId: STRIPE_PRICE_IDS.team,
    features: [
      '1000 transformations per month',
      'All AI tones & templates',
      'All note types',
      'Unlimited projects',
      'All export formats',
      'Image generation',
      'Up to 20 team members',
      'Custom templates',
      'Dedicated support',
    ],
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSelectPlan = async (tier: typeof tiers[0]) => {
    try {
      setError(null);
      setLoading(true);

      if (!user) {
        // If user is not logged in, redirect to signup page with plan
        navigate(`/signup/${tier.id}`);
        return;
      }

      // Extract price ID from the full price ID
      const priceIdParts = tier.priceId.split('_');
      const shortPriceId = priceIdParts[priceIdParts.length - 1];

      // Construct Stripe Checkout URL
      const params = new URLSearchParams({
        'api_key': import.meta.env.VITE_STRIPE_PUBLIC_KEY,
        'client_reference_id': user.uid,
        'customer_email': user.email,
        'line_items[0][price]': tier.priceId,
        'line_items[0][quantity]': '1',
        'mode': 'subscription',
        'success_url': encodeURIComponent('http://localhost:5173/dashboard?success=true'),
        'cancel_url': encodeURIComponent('http://localhost:5173/pricing?canceled=true')
      });

      // Redirect to Stripe Checkout
      const checkoutUrl = `https://checkout.stripe.com/c/pay/${shortPriceId}?${params.toString()}`;
      console.log('Redirecting to:', checkoutUrl);
      window.location.href = checkoutUrl;
      
    } catch (err: any) {
      console.error('Error selecting plan:', err);
      setError(err.message || 'Failed to process subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the right plan for&nbsp;you
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Choose a plan that best fits your needs. All plans include core features.
        </p>

        {error && (
          <div className="mx-auto mt-6 max-w-2xl rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier, tierIdx) => (
            <div
              key={tier.id}
              className={`flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10 ${
                tier.id === 'premium' ? 'lg:z-10 lg:rounded-b-none' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    id={tier.id}
                    className={`text-lg font-semibold leading-8 ${
                      tier.id === 'premium' ? 'text-indigo-600' : 'text-gray-900'
                    }`}
                  >
                    {tier.name}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    {tier.priceMonthly}
                  </span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">{tier.priceInterval}</span>
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleSelectPlan(tier)}
                disabled={loading}
                className={`mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  tier.id === 'premium'
                    ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600'
                    : 'bg-white text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Processing...' : user ? 'Subscribe now' : 'Get started'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}