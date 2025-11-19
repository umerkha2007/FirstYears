import type { ChildProfile, ParentProfile } from '../contexts/ProfileContext';
import type { ChatMessage } from './messagingService';
import { calculateAge as calculateChildAge, formatAge as formatChildAge } from '../utils/ageCalculator';

interface LLMRequest {
  userMessage: string;
  childProfile: ChildProfile;
  parentProfile?: ParentProfile;
  conversationHistory?: ChatMessage[];
}

interface LLMResponse {
  content: string;
  error?: string;
}

interface LLMRequestContext {
  context: {
    child: {
      name: string;
      dateOfBirth: string;
      age: {
        years: number;
        months: number;
        weeks: number;
        days: number;
        formatted: string;
      };
      medicalHistory: string;
    };
    parent?: {
      name: string;
      medicalHistory?: string;
    };
    conversationHistory: Array<{
      role: string;
      content: string;
      timestamp: string;
    }>;
    currentMessage: string;
    apiConfig: {
      provider: string;
      model: string;
      temperature: number;
      maxTokens: number;
    };
  };
  systemInstructions: {
    role: string;
    guidelines: string[];
    responseFormat: string;
    includeSections?: string[];
  };
}

export const generateSystemPrompt = (childProfile: ChildProfile): string => {
  const formattedAge = formatChildAge(childProfile.dateOfBirth);
  
  return `You are a helpful parenting assistant for FirstYears, an app designed to help parents during their child's first year.

Context about the child:
- Name: ${childProfile.name}
- Age: ${formattedAge}
- Medical History: ${childProfile.medicalHistory || 'None provided'}

Please provide evidence-based parenting advice tailored to this child's age and circumstances. Always remind parents to consult with their pediatrician for medical concerns.

Format your responses in Markdown for better readability. Use headings, lists, tables, bold/italic text, and other markdown features as appropriate for the content.`;
};

const buildRequestContext = (
  request: LLMRequest,
  provider: string,
  model: string = 'gpt-3.5-turbo'
): LLMRequestContext => {
  const age = calculateChildAge(request.childProfile.dateOfBirth);
  const formattedAge = formatChildAge(request.childProfile.dateOfBirth);
  
  const context: LLMRequestContext = {
    context: {
      child: {
        name: request.childProfile.name,
        dateOfBirth: request.childProfile.dateOfBirth,
        age: {
          years: age.years,
          months: age.months,
          weeks: age.weeks,
          days: age.days,
          formatted: formattedAge,
        },
        medicalHistory: request.childProfile.medicalHistory || 'None provided',
      },
      conversationHistory: (request.conversationHistory || []).map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
      })),
      currentMessage: request.userMessage,
      apiConfig: {
        provider,
        model,
        temperature: 0.7,
        maxTokens: 1000,
      },
    },
    systemInstructions: {
      role: 'parenting assistant for FirstYears app',
      guidelines: [
        'Provide evidence-based parenting advice',
        'Tailor responses to child\'s specific age and circumstances',
        'Always remind parents to consult pediatrician for medical concerns',
        'Be supportive and non-judgmental',
      ],
      responseFormat: 'markdown',
    },
  };

  // Add parent information if available
  if (request.parentProfile) {
    context.context.parent = {
      name: request.parentProfile.name,
      medicalHistory: request.parentProfile.medicalHistory,
    };
  }

  return context;
};

export const sendMessageToLLM = async (
  request: LLMRequest,
  apiKey: string,
  provider: string
): Promise<LLMResponse> => {
  try {
    // Build structured JSON context
    const requestContext = buildRequestContext(request, provider);
    
    // Generate system prompt with markdown formatting instructions
    const systemPrompt = generateSystemPrompt(request.childProfile);
    
    // Example for OpenAI-compatible APIs
    if (provider.toLowerCase().includes('openai') || provider.toLowerCase().includes('gpt')) {
      // Build messages array with conversation history
      const messages = [
        { role: 'system', content: systemPrompt },
        // Include conversation history
        ...(request.conversationHistory || []).map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        // Add current message with structured context
        { 
          role: 'user', 
          content: `${request.userMessage}

---
CONTEXT (JSON):
\`\`\`json
${JSON.stringify(requestContext, null, 2)}
\`\`\`

Please respond in Markdown format.`
        },
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: requestContext.context.apiConfig.model,
          messages: messages,
          temperature: requestContext.context.apiConfig.temperature,
          max_tokens: requestContext.context.apiConfig.maxTokens,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API request failed: ${response.statusText} - ${JSON.stringify(errorData)}`);
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
