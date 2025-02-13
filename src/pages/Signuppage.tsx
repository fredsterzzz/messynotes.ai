import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { stripePromise, STRIPE_PRICE_IDS } from '../config/stripe';
import { useAuth } from '../contexts/AuthContext';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  features: { name: string; included: boolean }[];
  priceId: string | null;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for trying out',
    price: '£0/forever',
    priceId: null, // Free plan doesn't need Stripe
    features: [
      { name: '5 transformations per month', included: true },
      { name: 'Basic AI tones', included: true },
      { name: 'Basic templates', included: true },
      { name: 'Text-only notes', included: true },
      { name: 'Up to 3 projects', included: true },
      { name: 'Basic export formats', included: true },
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'Great for personal use',
    price: '£9.99/month',
    priceId: STRIPE_PRICE_IDS.basic,
    features: [
      { name: '50 transformations per month', included: true },
      { name: 'Advanced AI tones', included: true },
      { name: 'All templates', included: true },
      { name: 'Text-only notes', included: true },
      { name: 'Up to 10 projects', included: true },
      { name: 'Export to PDF & Word', included: true },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Perfect for power users',
    price: '£14.99/month',
    priceId: STRIPE_PRICE_IDS.premium,
    features: [
      { name: '200 transformations per month', included: true },
      { name: 'All AI tones & templates', included: true },
      { name: 'All note types', included: true },
      { name: 'Up to 100 projects', included: true },
      { name: 'All export formats', included: true },
      { name: 'Image generation', included: true },
      { name: 'Up to 5 team members', included: true },
      { name: 'Custom templates', included: true },
    ],
  },
  {
    id: 'team',
    name: 'Team',
    description: 'Best for teams',
    price: '£49.99/month',
    priceId: STRIPE_PRICE_IDS.team,
    features: [
      { name: '1000 transformations per month', included: true },
      { name: 'All AI tones & templates', included: true },
      { name: 'All note types', included: true },
      { name: 'Unlimited projects', included: true },
      { name: 'All export formats', included: true },
      { name: 'Image generation', included: true },
      { name: 'Up to 20 team members', included: true },
      { name: 'Custom templates', included: true },
      { name: 'Dedicated support', included: true },
    ],
  },
];

export default function SignupPage() {
  const { plan: planId } = useParams<{ plan?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectedPlan = plans.find((p) => p.id === planId) || plans[0];

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        // Create or redirect to Stripe checkout
        const stripe = await stripePromise;
        if (!stripe) throw new Error('Stripe failed to initialize');

        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            priceId: selectedPlan.priceId,
            userId: result.user.uid,
            userEmail: result.user.email,
          }),
        });

        const session = await response.json();

        // Redirect to Stripe checkout
        const { error } = await stripe.redirectToCheckout({
          sessionId: session.id,
        });

        if (error) {
          setError(error.message);
        }
      }
    } catch (err: any) {
      console.error('Error during signup:', err);
      setError(err.message || 'Failed to sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If user is already logged in, redirect to dashboard
  if (user) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign up for {selectedPlan.name}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {selectedPlan.description}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? (
                'Signing in...'
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.367,1.332-1.459,2.424-2.791,2.791v1.909h1.909c2.159,0,3.818-1.659,3.818-3.818c0-2.159-1.659-3.818-3.818-3.818h-3.536C13.4,10.242,12.545,11.097,12.545,12.151z M12,7.636c-2.159,0-3.818,1.659-3.818,3.818c0,2.159,1.659,3.818,3.818,3.818c1.054,0,1.909-0.855,1.909-1.909s-0.855-1.909-1.909-1.909S9.818,11.097,9.818,12.151s0.855,1.909,1.909,1.909c0.366,0,0.706-0.098,1-0.269v1.909C12.493,15.812,12.247,15.818,12,15.818c-3.213,0-5.727-2.514-5.727-5.727S8.787,4.364,12,4.364s5.727,2.514,5.727,5.727H12V7.636z"></path>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Plan Features
                  </span>
                </div>
              </div>

              <ul className="mt-6 space-y-4">
                {selectedPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-500"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-700">{feature.name}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}