/** @jsxImportSource react */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TemplateTransformer, TEMPLATES, TONE_TRANSFORMATIONS } from '../components/TemplateTransformer';

export default function Transform() {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [selectedTone, setSelectedTone] = useState('professional');
  const [transformedText, setTransformedText] = useState('');
  const navigate = useNavigate();

  const handleTemplateChange = (event) => {
    const template = TEMPLATES.find(t => t.id === event.target.value);
    if (template) {
      setSelectedTemplate(template);
    }
  };

  const handleToneChange = (event) => {
    setSelectedTone(event.target.value);
  };

  const handleTransform = (text) => {
    setTransformedText(text);
  };

  return (
    <div className="transform-page">
      <h1>Transform Text</h1>
      
      <div className="template-selection">
        <label>
          Select Template:
          <select value={selectedTemplate.id} onChange={handleTemplateChange}>
            {TEMPLATES.map(template => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="tone-selection">
        <label>
          Select Tone:
          <select value={selectedTone} onChange={handleToneChange}>
            {Object.keys(TONE_TRANSFORMATIONS).map(tone => (
              <option key={tone} value={tone}>
                {tone.charAt(0).toUpperCase() + tone.slice(1)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <TemplateTransformer
        selectedTemplate={selectedTemplate}
        tone={selectedTone}
        onTransform={handleTransform}
      />

      {transformedText && (
        <div className="preview">
          <h2>Preview</h2>
          <pre>{transformedText}</pre>
        </div>
      )}
    </div>
  );
}
