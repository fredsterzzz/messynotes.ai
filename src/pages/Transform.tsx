import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { transformTemplate } from '../services/openai';
import { useSubscription } from '../contexts/SubscriptionContext';

// Define available templates
const TEMPLATES = [
  {
    id: 'business-proposal',
    name: 'Business Proposal',
    fields: [
      { key: 'companyName', label: 'Company Name' },
      { key: 'objective', label: 'Objective' },
      { key: 'valueProposition', label: 'Value Proposition' },
      { key: 'benefits', label: 'Benefits' },
      { key: 'investment', label: 'Investment' },
      { key: 'timeline', label: 'Timeline' }
    ]
  },
  {
    id: 'marketing-email',
    name: 'Marketing Email',
    fields: [
      { key: 'mainOffer', label: 'Main Offer' },
      { key: 'name', label: 'Recipient Name' },
      { key: 'openingHook', label: 'Opening Hook' },
      { key: 'benefits', label: 'Benefits' },
      { key: 'callToAction', label: 'Call to Action' }
    ]
  },
  {
    id: 'social-post',
    name: 'Social Media Post',
    fields: [
      { key: 'hook', label: 'Hook' },
      { key: 'mainMessage', label: 'Main Message' },
      { key: 'callToAction', label: 'Call to Action' },
      { key: 'hashtags', label: 'Hashtags' }
    ]
  }
];

const TONES = [
  { id: 'professional', name: 'Professional' },
  { id: 'friendly', name: 'Friendly' },
  { id: 'persuasive', name: 'Persuasive' },
  { id: 'casual', name: 'Casual' }
];

export default function Transform() {
  const { user } = useAuth();
  const { canTransform, useTransformation } = useSubscription();
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [selectedTone, setSelectedTone] = useState(TONES[0].id);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [transformedText, setTransformedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFieldChange = (key: string, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }));
  };

  const handleTransform = async () => {
    if (!canTransform()) {
      setError('You have reached your monthly transformation limit. Please upgrade your plan to continue.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await transformTemplate(
        selectedTemplate.id,
        selectedTone,
        fields
      );
      setTransformedText(result);
      useTransformation();
    } catch (err: any) {
      setError(err.message || 'Failed to transform template. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Please sign in to access templates
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">Transform Your Text</h1>
          
          <div className="mt-8 space-y-6">
            {/* Template Selection */}
            <div>
              <label htmlFor="template" className="block text-sm font-medium text-gray-700">
                Select Template
              </label>
              <select
                id="template"
                value={selectedTemplate.id}
                onChange={(e) => {
                  const newTemplate = TEMPLATES.find(t => t.id === e.target.value) || TEMPLATES[0];
                  setSelectedTemplate(newTemplate);
                  setFields({}); // Reset fields when template changes
                }}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {TEMPLATES.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tone Selection */}
            <div>
              <label htmlFor="tone" className="block text-sm font-medium text-gray-700">
                Select Tone
              </label>
              <select
                id="tone"
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {TONES.map((tone) => (
                  <option key={tone.id} value={tone.id}>
                    {tone.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Template Fields */}
            <div className="bg-white shadow sm:rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Fill in Template Details</h3>
              <div className="space-y-4">
                {selectedTemplate.fields.map((field) => (
                  <div key={field.key}>
                    <label htmlFor={field.key} className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      id={field.key}
                      value={fields[field.key] || ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                ))}
              </div>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                onClick={handleTransform}
                disabled={isLoading}
                className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Transforming...' : 'Transform Text'}
              </button>
            </div>

            {/* Transformed Text */}
            {transformedText && (
              <div className="bg-white shadow sm:rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Transformed Text</h3>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        const element = document.createElement('a');
                        const file = new Blob([transformedText], {type: 'text/plain'});
                        element.href = URL.createObjectURL(file);
                        element.download = `${selectedTemplate.name}-${selectedTone}.txt`;
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(transformedText);
                      }}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <textarea
                  value={transformedText}
                  readOnly
                  className="w-full h-64 p-4 border border-gray-300 rounded-md shadow-inner focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
