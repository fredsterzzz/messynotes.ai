/** @jsxImportSource react */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { STRIPE_PRICE_IDS } from '../config/stripe';

interface SignupError {
  message: string;
}

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  const selectedPlan = plans.find((p) => p.id === planId) || plans[0];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a Stripe customer and subscription
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          priceId: selectedPlan.priceId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      const { sessionId } = await response.json();
      navigate(`/dashboard?session_id=${sessionId}`);
    } catch (err) {
      const error = err as SignupError;
      setError(error.message);
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

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

          <form onSubmit={handleSignup}>
            <div className="space-y-6">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>
            </div>
          </form>

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
  );
}