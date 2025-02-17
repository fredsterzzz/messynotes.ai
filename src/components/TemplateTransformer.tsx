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
    content: `[Opening]
[Problem Statement]
[Solution]
[Benefits]
[Call to Action]
[Closing]`
  },
  {
    id: 'marketing-email',
    name: 'Marketing Email',
    content: `[Subject Line]
[Greeting]
[Opening Hook]
[Main Message]
[Value Proposition]
[Call to Action]
[Signature]`
  },
  {
    id: 'social-post',
    name: 'Social Media Post',
    content: `[Attention-Grabbing Hook]
[Main Message]
[Benefit 1]
[Benefit 2]
[Benefit 3]
[Call to Action]`
  }
];

// Tone transformations
export const TONE_TRANSFORMATIONS: Record<string, (text: string) => string> = {
  professional: (text: string) => {
    return text
      .replace('[Opening]', 'Dear [Name],\n\nI hope this proposal finds you well.')
      .replace('[Problem Statement]', 'Our analysis has identified key challenges in your current process.')
      .replace('[Solution]', 'We propose a comprehensive solution that addresses these challenges.')
      .replace('[Benefits]', 'This solution will provide measurable improvements in efficiency and ROI.')
      .replace('[Call to Action]', 'Let\'s schedule a meeting to discuss this proposal in detail.')
      .replace('[Closing]', 'Thank you for your time and consideration.\n\nBest regards,\n[Your Name]');
  },
  persuasive: (text: string) => {
    return text
      .replace('[Opening Hook]', 'Discover the game-changing opportunity...')
      .replace('[Main Message]', 'This could be the solution you\'ve been searching for.')
      .replace('[Value Proposition]', 'Imagine achieving your goals with half the effort.')
      .replace('[Call to Action]', 'Take the first step toward success - click now!')
      .replace('[Attention-Grabbing Hook]', '🚀 Transform Your Results Today!')
      .replace('[Benefit 1]', 'Dramatic improvement in results')
      .replace('[Benefit 2]', 'Competitive advantage')
      .replace('[Benefit 3]', 'Proven success rate');
  }
};

export function TemplateTransformer({ selectedTemplate, tone, onTransform }: TemplateTransformerProps) {
  const [transformedText, setTransformedText] = useState('');

  const handleTransform = () => {
    let result = selectedTemplate.content;

    // Apply tone transformation if available
    if (TONE_TRANSFORMATIONS[tone]) {
      result = TONE_TRANSFORMATIONS[tone](result);
    }

    setTransformedText(result);
    onTransform(result);
  };

  return (
    <div className="template-transformer">
      <button onClick={handleTransform} className="transform-button">
        Transform Template
      </button>
      {transformedText && (
        <div className="transformed-text">
          <h3>Transformed Text:</h3>
          <pre>{transformedText}</pre>
        </div>
      )}
    </div>
  );
}

export default TemplateTransformer;
