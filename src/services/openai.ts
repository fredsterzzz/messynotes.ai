import OpenAI from 'openai';

// Check for API key
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.error('OpenAI API key is missing. Please add VITE_OPENAI_API_KEY to your .env file.');
}

// OpenAI service wrapper
export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export async function callOpenAI(messages: Message[], options: ChatCompletionOptions = {}) {
  try {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        ...options,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error calling OpenAI API');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

interface TemplateData {
  type: string;
  content: string;
  placeholders: string[];
}

// Define template types and their specific requirements
const templates: Record<string, TemplateData> = {
  'business-proposal': {
    type: 'Business Proposal',
    content: '[Company Name] is seeking to [objective]. Our solution will [value proposition]...',
    placeholders: ['Company Name', 'Objective', 'Value Proposition', 'Benefits', 'Investment', 'Timeline']
  },
  'marketing-email': {
    type: 'Marketing Email',
    content: 'Subject: [Main Offer]\n\nDear [Name],\n\n[Opening Hook]...',
    placeholders: ['Main Offer', 'Name', 'Opening Hook', 'Benefits', 'Call to Action']
  },
  'social-post': {
    type: 'Social Media Post',
    content: '🎯 [Hook]\n\n[Main Message]\n\n[Call to Action]\n\n#[Hashtags]',
    placeholders: ['Hook', 'Main Message', 'Call to Action', 'Hashtags']
  }
};

// Define tone characteristics
const toneCharacteristics: Record<string, string> = {
  professional: 'formal, business-appropriate language, clear value propositions, data-driven statements',
  friendly: 'warm, conversational, approachable, using personal pronouns, emoticons where appropriate',
  persuasive: 'compelling, action-oriented, emphasizing benefits, creating urgency, strong calls to action',
  casual: 'relaxed, informal, conversational, using contractions and simple language'
};

export async function transformTemplate(
  templateId: string,
  tone: string,
  replacements: Record<string, string>
) {
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured. Please add your API key to the .env file.');
  }

  try {
    const template = templates[templateId];
    if (!template) {
      throw new Error('Invalid template ID');
    }

    const toneDesc = toneCharacteristics[tone] || toneCharacteristics.professional;

    const prompt = `
Transform the following template into a complete text using the provided replacements.
Use a ${tone} tone that is ${toneDesc}.

Template Type: ${template.type}
Required Elements: ${template.placeholders.join(', ')}

Replacements:
${Object.entries(replacements)
  .map(([key, value]) => `${key}: ${value}`)
  .join('\n')}

Do not ask questions or provide explanations. Simply transform the template maintaining its structure but adapting the language and style to match the requested tone. Ensure all placeholders are replaced with appropriate content.`;

    const messages = [
      {
        role: 'system',
        content: 'You are a professional content transformer. Your job is to take templates and transform them based on the specified tone while maintaining their structure and purpose. Do not ask questions or provide explanations - only output the transformed content.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const completion = await callOpenAI(messages, {
      model: 'gpt-4-turbo-preview',
      temperature: 0.7,
      max_tokens: 1000
    });

    return completion.choices[0].message.content || '';
  } catch (error) {
    console.error('Error transforming template:', error);
    throw error;
  }
}