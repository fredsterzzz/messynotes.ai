import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Check for API key
if (!process.env.VITE_OPENAI_API_KEY) {
  console.error('OpenAI API key is missing. Please add VITE_OPENAI_API_KEY to your .env file.');
}

export type Message = {
  role: 'user' | 'system' | 'assistant';
  content: string;
};

export async function generateResponse(messages: Message[]) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 1000
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw error;
  }
}

export async function generateTitle(content: string) {
  try {
    const messages: Message[] = [
      {
        role: 'system',
        content: 'You are a helpful assistant that generates concise, descriptive titles.'
      },
      {
        role: 'user',
        content: `Generate a short, descriptive title for this content: ${content}`
      }
    ];

    const title = await generateResponse(messages);
    return title?.replace(/["']/g, '') || 'Untitled';
  } catch (error) {
    console.error('Error generating title:', error);
    return 'Untitled';
  }
}

export async function generateTags(content: string) {
  try {
    const messages: Message[] = [
      {
        role: 'system',
        content: 'You are a helpful assistant that generates relevant tags for content.'
      },
      {
        role: 'user',
        content: `Generate 3-5 relevant tags for this content: ${content}`
      }
    ];

    const tagsResponse = await generateResponse(messages);
    const tags = tagsResponse?.split(',').map(tag => tag.trim()) || [];
    return tags.filter(tag => tag.length > 0);
  } catch (error) {
    console.error('Error generating tags:', error);
    return [];
  }
}

export async function transformTemplate(template: string, data: Record<string, any>) {
  try {
    const messages: Message[] = [
      {
        role: 'system',
        content: 'You are a helpful assistant that transforms templates using provided data.'
      },
      {
        role: 'user',
        content: `Transform this template using the provided data:
Template: ${template}
Data: ${JSON.stringify(data, null, 2)}`
      }
    ];

    return await generateResponse(messages);
  } catch (error) {
    console.error('Error transforming template:', error);
    throw error;
  }
}