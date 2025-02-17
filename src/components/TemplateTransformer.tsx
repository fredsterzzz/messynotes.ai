/** @jsxImportSource react */
import { useState } from 'react';

interface Template {
  id: string;
  name: string;
  description: string;
  example: string;
}

interface Tone {
  id: string;
  name: string;
  description: string;
}

interface TemplateTransformerProps {
  initialText?: string;
  onTransform: (text: string) => void;
}

export const TEMPLATES: Template[] = [
  {
    id: 'business',
    name: 'Business Report',
    description: 'Transform notes into a professional business report',
    example: 'Meeting notes -> Structured business report'
  },
  {
    id: 'academic',
    name: 'Academic Paper',
    description: 'Convert notes into academic format',
    example: 'Research notes -> Academic paper'
  },
  {
    id: 'creative',
    name: 'Creative Writing',
    description: 'Transform notes into creative content',
    example: 'Ideas -> Creative story'
  }
];

export const TONES: Tone[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Formal and business-appropriate'
  },
  {
    id: 'casual',
    name: 'Casual',
    description: 'Relaxed and conversational'
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Scholarly and research-oriented'
  }
];

export function TemplateTransformer({ initialText = '', onTransform }: TemplateTransformerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [selectedTone, setSelectedTone] = useState(TONES[0]);
  const [text, setText] = useState(initialText);

  const handleTemplateChange = (templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
    }
  };

  const handleToneChange = (toneId: string) => {
    const tone = TONES.find(t => t.id === toneId);
    if (tone) {
      setSelectedTone(tone);
    }
  };

  const handleTransform = () => {
    if (!text.trim()) return;
    
    const transformedText = `${selectedTemplate.name} (${selectedTone.name})\n\n${text}`;
    onTransform(transformedText);
  };

  return (
    <div className="template-transformer">
      <div className="controls">
        <div className="template-select">
          <label htmlFor="template">Template</label>
          <select
            id="template"
            value={selectedTemplate.id}
            onChange={(e) => handleTemplateChange(e.target.value)}
          >
            {TEMPLATES.map(template => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          <p className="description">{selectedTemplate.description}</p>
        </div>

        <div className="tone-select">
          <label htmlFor="tone">Tone</label>
          <select
            id="tone"
            value={selectedTone.id}
            onChange={(e) => handleToneChange(e.target.value)}
          >
            {TONES.map(tone => (
              <option key={tone.id} value={tone.id}>
                {tone.name}
              </option>
            ))}
          </select>
          <p className="description">{selectedTone.description}</p>
        </div>
      </div>

      <div className="text-input">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here..."
        />
      </div>

      <button
        onClick={handleTransform}
        disabled={!text.trim()}
        className="transform-button"
      >
        Transform
      </button>
    </div>
  );
}
