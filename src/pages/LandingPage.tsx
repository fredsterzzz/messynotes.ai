import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Shield, Users } from 'lucide-react';

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
              to="/dashboard"
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Get Started Free
            </Link>
            <a
              href="#pricing"
              className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              View Pricing
            </a>
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
      <div id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
            <p className="text-gray-600 mt-4">Choose the plan that's right for you</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">Free</h3>
              <p className="text-3xl font-bold mb-4">£0<span className="text-sm text-gray-600">/mo</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Sparkles className="h-5 w-5 text-green-500 mr-2" />
                  <span>5 transformations/month</span>
                </li>
                <li className="flex items-center">
                  <Sparkles className="h-5 w-5 text-green-500 mr-2" />
                  <span>Basic templates</span>
                </li>
              </ul>
              <Link
                to="/dashboard"
                className="block w-full py-2 px-4 bg-gray-100 text-center rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Basic Plan */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">Basic</h3>
              <p className="text-3xl font-bold mb-4">£9.99<span className="text-sm text-gray-600">/mo</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Sparkles className="h-5 w-5 text-green-500 mr-2" />
                  <span>50 transformations</span>
                </li>
                <li className="flex items-center">
                  <Sparkles className="h-5 w-5 text-green-500 mr-2" />
                  <span>All templates</span>
                </li>
                <li className="flex items-center">
                  <Sparkles className="h-5 w-5 text-green-500 mr-2" />
                  <span>Basic support</span>
                </li>
              </ul>
              <Link
                to="/dashboard"
                className="block w-full py-2 px-4 bg-indigo-600 text-center rounded-lg text-white hover:bg-indigo-700 transition-colors"
              >
                Start Trial
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-indigo-600 p-8 rounded-xl shadow-lg text-white transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm py-1 px-4 rounded-full">
                  Popular
                </span>
              </div>
              <h3 className="text-xl font-bold mb-4">Premium</h3>
              <p className="text-3xl font-bold mb-4">£14.99<span className="text-sm opacity-75">/mo</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Sparkles className="h-5 w-5 text-white mr-2" />
                  <span>Unlimited transformations</span>
                </li>
                <li className="flex items-center">
                  <Sparkles className="h-5 w-5 text-white mr-2" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <Sparkles className="h-5 w-5 text-white mr-2" />
                  <span>Advanced analytics</span>
                </li>
              </ul>
              <Link
                to="/dashboard"
                className="block w-full py-2 px-4 bg-white text-center rounded-lg text-indigo-600 hover:bg-gray-100 transition-colors"
              >
                Start Trial
              </Link>
            </div>

            {/* Team Plan */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">Team</h3>
              <p className="text-3xl font-bold mb-4">£49.99<span className="text-sm text-gray-600">/mo</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Sparkles className="h-5 w-5 text-green-500 mr-2" />
                  <span>Unlimited team members</span>
                </li>
                <li className="flex items-center">
                  <Sparkles className="h-5 w-5 text-green-500 mr-2" />
                  <span>Team collaboration</span>
                </li>
                <li className="flex items-center">
                  <Sparkles className="h-5 w-5 text-green-500 mr-2" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center">
                  <Sparkles className="h-5 w-5 text-green-500 mr-2" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Link
                to="/dashboard"
                className="block w-full py-2 px-4 bg-gray-900 text-center rounded-lg text-white hover:bg-gray-800 transition-colors"
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

export default LandingPage