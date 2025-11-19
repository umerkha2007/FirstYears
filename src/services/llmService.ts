import type { ChildProfile } from '../contexts/ProfileContext';

interface LLMRequest {
  userMessage: string;
  childProfile: ChildProfile;
}

interface LLMResponse {
  content: string;
  error?: string;
}

export const generateSystemPrompt = (childProfile: ChildProfile): string => {
  const age = calculateAge(childProfile.dateOfBirth);
  
  return `You are a helpful parenting assistant for FirstYears, an app designed to help parents during their child's first year.

Context about the child:
- Name: ${childProfile.name}
- Age: ${formatAge(age)}
- Medical History: ${childProfile.medicalHistory || 'None provided'}

Please provide evidence-based parenting advice tailored to this child's age and circumstances. Always remind parents to consult with their pediatrician for medical concerns.`;
};

const calculateAge = (dateOfBirth: string) => {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - dob.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return {
    months: Math.floor(diffDays / 30),
    weeks: Math.floor(diffDays / 7),
    days: diffDays,
  };
};

const formatAge = (age: { months: number; weeks: number; days: number }): string => {
  if (age.months < 1) {
    if (age.weeks < 1) {
      return `${age.days} day${age.days !== 1 ? 's' : ''} old`;
    }
    return `${age.weeks} week${age.weeks !== 1 ? 's' : ''} old`;
  }
  
  if (age.months < 12) {
    return `${age.months} month${age.months !== 1 ? 's' : ''} old`;
  }
  
  return '1 year old';
};

export const sendMessageToLLM = async (
  request: LLMRequest,
  apiKey: string,
  provider: string
): Promise<LLMResponse> => {
  try {
    // This is a placeholder implementation
    // You'll need to implement specific API calls based on the provider
    
    const systemPrompt = generateSystemPrompt(request.childProfile);
    
    // Example for OpenAI-compatible APIs
    if (provider.toLowerCase().includes('openai') || provider.toLowerCase().includes('gpt')) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: request.userMessage },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        content: data.choices[0].message.content,
      };
    }
    
    // Add more provider implementations here (Anthropic, Google, etc.)
    
    return {
      content: 'API integration not yet implemented for this provider. Please check the service file.',
      error: 'Provider not supported',
    };
  } catch (error) {
    console.error('Error calling LLM API:', error);
    return {
      content: 'Sorry, there was an error processing your request. Please check your API key and try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
