import OpenAI from 'openai';

// Initialize OpenAI client with server-side API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { notes, selectedTemplate, selectedTone } = req.body;

    if (!notes || !selectedTemplate || !selectedTone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create a prompt that explains the transformation task
    const prompt = `Transform the following notes into a ${selectedTemplate} format using a ${selectedTone} tone.
    
Template type: ${selectedTemplate}
Tone: ${selectedTone}

Original notes:
${notes}

Please maintain the following:
1. Keep the core information and key points
2. Adapt the language and style to match the ${selectedTone} tone
3. Structure the content according to ${selectedTemplate} format
4. Ensure the output is well-organized and professional`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert content transformer that helps users convert their messy notes into well-structured, professionally formatted content.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    return res.status(200).json({ 
      transformedContent: completion.choices[0].message.content 
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return res.status(500).json({ 
      error: 'Error transforming content',
      message: error.message 
    });
  }
}
