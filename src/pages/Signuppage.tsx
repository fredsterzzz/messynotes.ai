import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import SignupForm from '../components/SignupForm';
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
  const location = useLocation();

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

  const plan = location.state?.selectedPlan;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <Helmet>
        <title>Sign Up - MessyNotes.ai</title>
      </Helmet>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        <div className="flex justify-center">
          <SignupForm selectedPlan={plan || 'free'} />
        </div>
      </div>
    </div>
  );
}