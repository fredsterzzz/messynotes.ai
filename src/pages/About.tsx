import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Sparkles, 
  FileText, 
  Code, 
  MessageCircle, 
  Bot, 
  Lock, 
  Cloud, 
  Star
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <div className="relative group">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
    <div className="relative p-6 bg-white ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6 group-hover:bg-purple-50 transition-colors">
      <Icon className="w-8 h-8 text-purple-600 group-hover:text-purple-700" />
      <div className="space-y-2">
        <p className="text-slate-800 font-medium group-hover:text-purple-900">{title}</p>
        <p className="text-slate-600 text-sm">{description}</p>
      </div>
    </div>
  </div>
);

export default function About() {
  const navigate = useNavigate();

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
      icon: Code,
      title: "API Integration",
      description: "Easy integration with your existing tools and workflows."
    },
    {
      icon: MessageCircle,
      title: "Collaborative Editing",
      description: "Work together with your team in real-time on documents."
    }
  ];

  const upcomingFeatures = [
    { icon: Bot, title: "AI Meeting Assistant" },
    { icon: Lock, title: "Enhanced Security" },
    { icon: Cloud, title: "Cloud Integration" },
    { icon: Star, title: "Custom AI Models" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <Helmet>
        <title>About Us - MessyNotes.ai</title>
      </Helmet>

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
                className="border-transparent text-gray-500 hover:border-purple-500 hover:text-purple-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
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
                className="border-purple-500 text-purple-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                About
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-purple-900 mb-4">About MessyNotes.ai</h1>
          <p className="text-lg text-purple-800 max-w-3xl mx-auto">
            We're revolutionizing the way people transform their messy notes into polished content using the power of artificial intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-purple-900 mb-4">Coming Soon</h2>
          <p className="text-lg text-purple-800 max-w-3xl mx-auto">
            We're constantly working on new features to make MessyNotes.ai even better.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {upcomingFeatures.map((feature) => (
            <div key={feature.title} className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all hover:bg-purple-50">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-sm font-medium text-purple-900">{feature.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}