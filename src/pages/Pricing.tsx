import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Check, Star, Crown, Users, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';

function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '£0',
      period: 'forever',
      description: 'Try the magic of AI note transformation',
      icon: Sparkles,
      features: [
        '5 transformations/month',
        'Basic AI tones',
        'Basic templates',
        'Text-only notes',
        'Up to 3 projects'
      ]
    },
    {
      name: 'Basic',
      price: '£9.99',
      period: 'per month',
      description: 'Perfect for personal productivity',
      icon: Star,
      features: [
        '50 transformations/month',
        'Advanced AI tones',
        'All templates',
        'Basic support',
        'Up to 10 projects',
        'Export to PDF & Word'
      ]
    },
    {
      name: 'Premium',
      price: '£14.99',
      period: 'per month',
      popular: true,
      description: 'Unlock unlimited potential',
      icon: Crown,
      features: [
        'Unlimited transformations',
        'All AI tones',
        'All templates',
        'Priority support',
        'Up to 100 projects',
        'Advanced analytics',
        'Image generation'
      ]
    },
    {
      name: 'Team',
      price: '£49.99',
      period: 'per month',
      description: 'Perfect for teams of any size',
      icon: Users,
      features: [
        'Everything in Premium',
        'Unlimited team members',
        'Team collaboration',
        'Advanced analytics',
        'Priority support',
        'Custom workspace',
        'Team usage insights'
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Pricing - MessyNotes.ai Plans & Features</title>
        <meta name="description" content="Choose the perfect MessyNotes.ai plan for your needs. From free basic features to premium enterprise solutions, transform your notes with our AI technology." />
      </Helmet>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <BackButton className="mb-6" />
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600">
            Choose the plan that's right for you or your team
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div key={plan.name} className={`relative bg-white rounded-lg shadow-sm overflow-hidden transform transition-all duration-200 hover:scale-105 ${
                plan.popular ? 'border-2 border-indigo-600 ring-2 ring-indigo-600 ring-opacity-50' : 'border border-gray-200'
              }`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                    <Icon className={`h-8 w-8 ${plan.popular ? 'text-indigo-600' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <Link
                    to="/signup"
                    className={`block w-full text-center px-6 py-3 rounded-md font-medium transition-colors ${
                      plan.popular
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {plan.name === 'Free' ? 'Get Started' : `Choose ${plan.name}`}
                  </Link>
                </div>
                <div className="px-6 pt-6 pb-8 bg-gray-50">
                  <p className="text-sm font-medium text-gray-900 mb-4">Plan includes:</p>
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Have questions?</h2>
          <p className="text-gray-600 mb-6">
            Contact us at{' '}
            <a href="mailto:contact@messynotes.ai" className="text-indigo-600 hover:text-indigo-700">
              contact@messynotes.ai
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default Pricing;