import React, { useState } from 'react';
import { transformTemplate } from '../services/openai';
import './Transform.css';

export default function Transform() {
  const [template, setTemplate] = useState('');
  const [data, setData] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTransform = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Parse the data string as JSON
      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch (e) {
        throw new Error('Invalid JSON data format');
      }

      const transformedContent = await transformTemplate(template, parsedData);
      setResult(transformedContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Transform error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transform-container">
      <h1>Transform Template</h1>
      
      <div className="input-section">
        <h2>Template</h2>
        <textarea
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          placeholder="Enter your template here..."
        />
      </div>

      <div className="input-section">
        <h2>Data (JSON format)</h2>
        <textarea
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder="Enter your data in JSON format..."
        />
      </div>

      <button 
        onClick={handleTransform}
        disabled={loading || !template || !data}
      >
        {loading ? 'Transforming...' : 'Transform'}
      </button>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {result && (
        <div className="result-section">
          <h2>Result</h2>
          <div className="result-content">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
