import React, { useState } from 'react';

interface Template {
  id: string;
  name: string;
  content: string;
}

interface TemplateTransformerProps {
  selectedTemplate: Template;
  tone: string;
  onTransform: (transformedText: string) => void;
}

// Sample templates with different types of content
export const TEMPLATES: Template[] = [
  {
    id: 'business-proposal',
    name: 'Business Proposal',
    content: `[Company Name]
[Address]
[City, State ZIP]

Dear [Recipient Name],

I am writing to propose a business opportunity that I believe will be mutually beneficial for both our organizations.

[Value Proposition]

Key Benefits:
- [Benefit 1]
- [Benefit 2]
- [Benefit 3]

Investment: [Amount]
Timeline: [Duration]

I look forward to discussing this proposal in detail.

Best regards,
[Your Name]`
  },
  {
    id: 'marketing-email',
    name: 'Marketing Email',
    content: `Subject: [Attention-Grabbing Headline]

Hi [Name],

Hope you're having a great day!

[Opening Hook]

[Main Offer/Value Proposition]

[Benefits/Features]

[Call to Action]

Best,
[Your Name]`
  },
  {
    id: 'social-post',
    name: 'Social Media Post',
    content: `🎯 [Attention-Grabbing Hook]

[Main Message]

[Value Proposition]

[Call to Action]

#[Hashtag1] #[Hashtag2] #[Hashtag3]`
  }
];

// Tone transformations based on selected style
const TONE_TRANSFORMATIONS: Record<string, (text: string) => string> = {
  professional: (text: string) => {
    return text
      .replace('[Opening Hook]', 'I trust this email finds you well.')
      .replace('[Main Message]', 'We are pleased to announce a significant advancement in our offerings.')
      .replace('[Value Proposition]', 'Our solution provides measurable benefits and proven results.')
      .replace('[Call to Action]', 'Please contact us to schedule a consultation.')
      .replace('[Attention-Grabbing Hook]', 'Introducing a Revolutionary Business Solution')
      .replace('[Benefit 1]', 'Increased operational efficiency')
      .replace('[Benefit 2]', 'Cost optimization')
      .replace('[Benefit 3]', 'Enhanced market positioning');
  },
  friendly: (text: string) => {
    return text
      .replace('[Opening Hook]', 'Hey there! 👋')
      .replace('[Main Message]', "We've got something exciting to share with you!")
      .replace('[Value Proposition]', "Here's how we can make your life easier...")
      .replace('[Call to Action]', "Don't miss out - join us today!")
      .replace('[Attention-Grabbing Hook]', '✨ Get Ready for Something Amazing!')
      .replace('[Benefit 1]', 'Save time and effort')
      .replace('[Benefit 2]', 'Enjoy peace of mind')
      .replace('[Benefit 3]', 'Join our amazing community');
  },
  persuasive: (text: string) => {
    return text
      .replace('[Opening Hook]', 'Discover the game-changing opportunity...')
      .replace('[Main Message]', 'This could be the solution you've been searching for.')
      .replace('[Value Proposition]', 'Imagine achieving your goals with half the effort.')
      .replace('[Call to Action]', 'Take the first step toward success - click now!')
      .replace('[Attention-Grabbing Hook]', '🚀 Transform Your Results Today!')
      .replace('[Benefit 1]', 'Dramatic improvement in results')
      .replace('[Benefit 2]', 'Competitive advantage')
      .replace('[Benefit 3]', 'Proven success rate');
  }
};

export function TemplateTransformer({ selectedTemplate, tone, onTransform }: TemplateTransformerProps) {
  const [transformedText, setTransformedText] = useState(selectedTemplate.content);

  const transformTemplate = () => {
    if (TONE_TRANSFORMATIONS[tone]) {
      const transformed = TONE_TRANSFORMATIONS[tone](selectedTemplate.content);
      setTransformedText(transformed);
      onTransform(transformed);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">{selectedTemplate.name}</h3>
        <button
          onClick={transformTemplate}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Transform Text
        </button>
      </div>
      
      <div className="mt-4">
        <textarea
          value={transformedText}
          onChange={(e) => setTransformedText(e.target.value)}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          rows={10}
        />
      </div>
    </div>
  );
}

export default TemplateTransformer;
