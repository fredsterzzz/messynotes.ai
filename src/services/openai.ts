import OpenAI from 'openai';

// Check for API key
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.error('OpenAI API key is missing. Please add VITE_OPENAI_API_KEY to your .env file.');
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: apiKey || 'dummy-key', // Prevent initialization error
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
});

// Template prompts for different types of content
const templatePrompts = {
  business: "Transform these business notes into a professional, well-structured document:",
  personal: "Organize these personal notes into a clear and actionable format:",
  sales: "Convert these notes into compelling sales content:"
};

// Tone modifiers for different styles
const toneModifiers = {
  professional: "Use a professional and formal tone.",
  casual: "Use a casual and relaxed tone.",
  friendly: "Use a warm and approachable tone.",
  formal: "Use a highly formal and business-appropriate tone."
};

export async function transformNotes(notes: string, template: string, tone: string) {
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured. Please add your API key to the .env file.');
  }

  try {
    const templatePrompt = templatePrompts[template as keyof typeof templatePrompts] || templatePrompts.business;
    const toneModifier = toneModifiers[tone as keyof typeof toneModifiers] || toneModifiers.professional;

    const prompt = `${templatePrompt}

Notes:
${notes}

${toneModifier}

Please structure the output in a clear, readable format using appropriate headings, bullet points, or paragraphs as needed.`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert content organizer and writer, skilled at transforming messy notes into well-structured, professional content while maintaining the original meaning and intent."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-4-turbo-preview",
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || "Failed to transform notes";
  } catch (error) {
    console.error('Error transforming notes:', error);
    throw new Error('Failed to transform notes. Please try again.');
  }
}