import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Shield, Users, Check } from 'lucide-react';
import { PLAN_FEATURES } from '../contexts/SubscriptionContext';

function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-8">
            Transform Messy Notes into
            <span className="text-indigo-600"> Professional Content</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Using AI to turn your unorganized thoughts into clean, structured, and professional content in seconds.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/signup"
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              to="/pricing"
              className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Messynotes.ai?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-xl">
              <Zap className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Transform your notes into professional content in seconds using advanced AI.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <Shield className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">Your notes are encrypted and protected. We take privacy seriously.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <Users className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Team Ready</h3>
              <p className="text-gray-600">Perfect for individuals and teams of any size.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
            <p className="text-gray-600 mt-4">Choose the plan that's right for you</p>
            <Link
              to="/pricing"
              className="mt-8 inline-block px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              View All Plans
            </Link>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">£0</span>
                <span className="text-gray-600">/forever</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">{PLAN_FEATURES.free.transformationsPerMonth} transformations per month</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">Basic AI tones</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">Basic templates</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">Text-only notes</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">Up to {PLAN_FEATURES.free.maxProjects} projects</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">Basic export formats</span>
                </li>
              </ul>
              <Link
                to="/signup"
                className="block w-full py-3 px-4 rounded-md text-center text-sm font-semibold bg-gray-800 text-white hover:bg-gray-900"
              >
                Get Started
              </Link>
            </div>

            {/* Basic Plan */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">Basic</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">£9.99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">{PLAN_FEATURES.basic.transformationsPerMonth} transformations per month</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">Advanced AI tones</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">All templates</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">Text-only notes</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">Up to {PLAN_FEATURES.basic.maxProjects} projects</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">Export to PDF & Word</span>
                </li>
              </ul>
              <Link
                to="/signup?plan=basic"
                className="block w-full py-3 px-4 rounded-md text-center text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Get Started
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-white p-8 rounded-xl shadow-lg relative">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  Popular
                </span>
              </div>
              <h3 className="text-xl font-bold mb-4">Premium</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">£14.99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">{PLAN_FEATURES.premium.transformationsPerMonth} transformations per month</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">All AI tones & templates</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">All note types</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">Up to {PLAN_FEATURES.premium.maxProjects} projects</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">All export formats</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">Image generation</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">Up to {PLAN_FEATURES.premium.teamMembers} team members</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">Custom templates</span>
                </li>
              </ul>
              <Link
                to="/signup?plan=premium"
                className="block w-full py-3 px-4 rounded-md text-center text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Get Started
              </Link>
            </div>

            {/* Team Plan */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">Team</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">£49.99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">{PLAN_FEATURES.team.transformationsPerMonth} transformations per month</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">All AI tones & templates</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">All note types</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">Unlimited projects</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">All export formats</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">Image generation</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">Up to {PLAN_FEATURES.team.teamMembers} team members</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">Custom templates</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">API access</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">Dedicated support</span>
                </li>
              </ul>
              <Link
                to="/signup?plan=team"
                className="block w-full py-3 px-4 rounded-md text-center text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;