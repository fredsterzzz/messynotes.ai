import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, XCircle, Zap, Code, FileText, 
  Image as ImageIcon, MessageCircle, Users, Brain,
  Sparkles, Workflow, Bot, Lock, Cloud, Star
} from 'lucide-react';
import { PLAN_FEATURES } from '../contexts/SubscriptionContext';
import BackButton from '../components/BackButton';

const FeatureShowcase = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <div className="relative group">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
    <div className="relative p-6 bg-white ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
      <Icon className="w-8 h-8 text-indigo-600" />
      <div className="space-y-2">
        <p className="text-slate-800 font-medium">{title}</p>
        <p className="text-slate-600 text-sm">{description}</p>
      </div>
    </div>
  </div>
);

const ComingSoonFeature = ({ icon: Icon, title }: { icon: any; title: string }) => (
  <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-indigo-600" />
    </div>
    <h3 className="text-sm font-medium text-gray-900">{title}</h3>
  </div>
);

const PricingTier = ({ 
  name, 
  price, 
  features, 
  isPopular = false,
  onSelect 
}: { 
  name: string;
  price: string | null;
  features: { name: string; included: boolean }[];
  isPopular?: boolean;
  onSelect: () => void;
}) => {
  const initialFeatures = features.slice(0, 4);
  const expandedFeatures = features.slice(4);

  return (
    <div 
      className={`group relative p-8 bg-white rounded-2xl shadow-xl border ${
        isPopular ? 'border-purple-600 scale-105' : 'border-gray-200'
      } hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2`}
    >
      {isPopular && (
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
          <div className="inline-block px-4 py-1 text-sm font-semibold text-white bg-purple-600 rounded-full shadow-lg">
            Most Popular
          </div>
        </div>
      )}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{name}</h3>
        <div className="mt-4 flex items-baseline justify-center gap-x-2">
          {price ? (
            <>
              <span className="text-5xl font-bold tracking-tight text-purple-900">£{price}</span>
              <span className="text-sm font-semibold leading-6 tracking-wide text-purple-600">/mo</span>
            </>
          ) : (
            <span className="text-2xl font-semibold text-purple-900">Contact Us</span>
          )}
        </div>
      </div>

      <ul role="list" className="mt-8 space-y-4">
        {initialFeatures.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            {feature.included ? (
              <CheckCircle2 className="h-5 w-5 flex-none text-purple-600" />
            ) : (
              <XCircle className="h-5 w-5 flex-none text-gray-400" />
            )}
            <span className={`text-sm ${feature.included ? 'text-gray-600' : 'text-gray-400'}`}>
              {feature.name}
            </span>
          </li>
        ))}
        
        <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{ maxHeight: '0', opacity: '0', transform: 'translateY(-10px)' }}>
          <div className="group-hover:block group-hover:animate-expand">
            {expandedFeatures.map((feature, index) => (
              <li key={index} className="flex items-center gap-3 mt-4">
                {feature.included ? (
                  <CheckCircle2 className="h-5 w-5 flex-none text-purple-600" />
                ) : (
                  <XCircle className="h-5 w-5 flex-none text-gray-400" />
                )}
                <span className={`text-sm ${feature.included ? 'text-gray-600' : 'text-gray-400'}`}>
                  {feature.name}
                </span>
              </li>
            ))}
          </div>
        </div>
      </ul>

      <button
        onClick={onSelect}
        className={`mt-8 w-full rounded-lg px-4 py-3 text-sm font-semibold 
          ${isPopular
            ? 'bg-purple-600 text-white hover:bg-purple-500'
            : 'bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50'
          } 
          transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105`}
      >
        {price ? 'Get Started' : 'Contact Sales'}
      </button>
    </div>
  );
};

export default function SignupPage() {
  const navigate = useNavigate();

  const handleSelectPlan = (plan: string) => {
    if (plan === 'enterprise') {
      window.location.href = 'mailto:sales@messynotes.ai?subject=Enterprise Plan Inquiry';
      return;
    }
    navigate('/auth/signup', { state: { selectedPlan: plan } });
  };

  const plans = [
    {
      name: 'Free',
      price: '0',
      features: [
        { name: `${PLAN_FEATURES.free.transformationsPerMonth} transformations per month`, included: true },
        { name: 'Basic AI tones', included: true },
        { name: 'Basic templates', included: true },
        { name: `Up to ${PLAN_FEATURES.free.maxNoteLength} characters per note`, included: true },
        { name: `${PLAN_FEATURES.free.maxProjects} projects`, included: true },
        { name: 'Export to PDF and TXT', included: true },
        { name: 'Advanced AI tones', included: false },
        { name: 'Image generation', included: false },
        { name: 'Team collaboration', included: false },
      ],
    },
    {
      name: 'Basic',
      price: '7.99',
      features: [
        { name: `${PLAN_FEATURES.basic.transformationsPerMonth} transformations per month`, included: true },
        { name: 'Advanced AI tones', included: true },
        { name: 'Advanced templates', included: true },
        { name: `Up to ${PLAN_FEATURES.basic.maxNoteLength} characters per note`, included: true },
        { name: `${PLAN_FEATURES.basic.maxProjects} projects`, included: true },
        { name: 'Export to PDF, TXT, and DOCX', included: true },
        { name: 'Priority email support', included: true },
        { name: 'Image generation', included: false },
        { name: 'Team collaboration', included: false },
      ],
    },
    {
      name: 'Premium',
      price: '14.99',
      features: [
        { name: `${PLAN_FEATURES.premium.transformationsPerMonth} transformations per month`, included: true },
        { name: 'All AI tones', included: true },
        { name: 'All templates', included: true },
        { name: `Up to ${PLAN_FEATURES.premium.maxNoteLength} characters per note`, included: true },
        { name: `${PLAN_FEATURES.premium.maxProjects} projects`, included: true },
        { name: 'Export to all formats', included: true },
        { name: 'Image generation', included: true },
        { name: `Up to ${PLAN_FEATURES.premium.teamMembers} team members`, included: true },
        { name: 'Custom branding', included: true },
      ],
    },
    {
      name: 'Enterprise',
      price: null,
      features: [
        { name: `${PLAN_FEATURES.enterprise.transformationsPerMonth}+ transformations per month`, included: true },
        { name: 'All AI tones & templates', included: true },
        { name: 'Unlimited note length', included: true },
        { name: 'Unlimited projects', included: true },
        { name: 'All export formats', included: true },
        { name: 'Image generation', included: true },
        { name: `Up to ${PLAN_FEATURES.enterprise.teamMembers} team members`, included: true },
        { name: 'Custom branding', included: true },
        { name: 'API access', included: true },
        { name: 'Dedicated support', included: true },
      ],
    },
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Transformation",
      description: "Transform messy notes into polished content using advanced AI technology."
    },
    {
      icon: Sparkles,
      title: "Multiple Writing Styles",
      description: "Choose from various tones and styles to match your content needs."
    },
    {
      icon: FileText,
      title: "Smart Templates",
      description: "Pre-built templates for various content types, from business reports to creative writing."
    },
    {
      icon: ImageIcon,
      title: "Image Processing",
      description: "Extract and process text from images with high accuracy."
    },
    {
      icon: MessageCircle,
      title: "Collaborative Editing",
      description: "Work together with your team in real-time on documents."
    },
    {
      icon: Workflow,
      title: "Workflow Integration",
      description: "Seamlessly integrate with your existing tools and workflows."
    }
  ];

  const comingSoonFeatures = [
    { icon: Bot, title: "AI Meeting Assistant" },
    { icon: Lock, title: "Enhanced Security" },
    { icon: Cloud, title: "Cloud Integration" },
    { icon: Code, title: "API Access" },
    { icon: Users, title: "Team Analytics" },
    { icon: Star, title: "Custom AI Models" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <Helmet>
        <title>Choose Your Plan - MessyNotes.ai</title>
      </Helmet>

      <style>
        {`
          @keyframes expand {
            0% {
              max-height: 0;
              opacity: 0;
              transform: translateY(-10px);
            }
            100% {
              max-height: 500px;
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .group:hover .overflow-hidden {
            max-height: 500px !important;
            opacity: 1 !important;
            transform: translateY(0) !important;
          }
          
          .animate-expand {
            animation: expand 0.3s ease-out forwards;
          }
        `}
      </style>

      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-purple-600 cursor-pointer" onClick={() => navigate('/')}>MessyNotes.ai</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <button
                onClick={() => navigate('/pricing')}
                className="border-purple-500 text-purple-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Pricing
              </button>
              <a
                href="mailto:contact@messynotes.ai"
                className="border-transparent text-gray-500 hover:border-purple-500 hover:text-purple-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
              >
                Contact
              </a>
              <button
                onClick={() => navigate('/about')}
                className="border-transparent text-gray-500 hover:border-purple-500 hover:text-purple-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
              >
                About
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
        <BackButton />
        
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h1 className="text-4xl font-bold text-purple-900 sm:text-5xl mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg leading-8 text-purple-800">
            Transform your messy notes into polished content with our AI-powered platform.
            Select a plan that matches your requirements and start creating professional content today.
          </p>
        </div>

        <div className="isolate mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mb-24">
          {plans.map((plan) => (
            <PricingTier
              key={plan.name}
              name={plan.name}
              price={plan.price}
              features={plan.features}
              isPopular={plan.name === 'Premium'}
              onSelect={() => handleSelectPlan(plan.name.toLowerCase())}
            />
          ))}
        </div>

        <div className="mx-auto max-w-4xl text-center mb-16">
          <h2 className="text-3xl font-bold text-purple-900 sm:text-4xl mb-4">
            What We Offer
          </h2>
          <p className="text-lg leading-8 text-purple-800">
            Discover the powerful features that make MessyNotes.ai the perfect solution for your content needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {features.map((feature) => (
            <FeatureShowcase
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        <div className="mx-auto max-w-4xl text-center mb-16">
          <h2 className="text-3xl font-bold text-purple-900 sm:text-4xl mb-4">
            Coming Soon
          </h2>
          <p className="text-lg leading-8 text-purple-800">
            We're constantly innovating to bring you the best features. Here's what's coming next.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {comingSoonFeatures.map((feature) => (
            <ComingSoonFeature
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
}