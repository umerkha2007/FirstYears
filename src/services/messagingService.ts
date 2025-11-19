/**
 * Messaging Service
 * Handles all LLM API communication
 */

import { sendMessageToLLM, generateSystemPrompt } from './llmService';
import type { ChildProfile, ParentProfile } from '../contexts/ProfileContext';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  error?: boolean;
}

export interface SendMessageRequest {
  message: string;
  childProfile: ChildProfile;
  parentProfile?: ParentProfile;
  apiKey: string;
  provider: string;
  conversationHistory?: ChatMessage[];
}

export interface SendMessageResponse {
  message: ChatMessage;
  error?: string;
}

class MessagingService {
  /**
   * Send a message to the LLM and get a response
   */
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    try {
      // Call the LLM service with conversation history and parent profile
      const response = await sendMessageToLLM(
        {
          userMessage: request.message,
          childProfile: request.childProfile,
          parentProfile: request.parentProfile,
          conversationHistory: request.conversationHistory,
        },
        request.apiKey,
        request.provider
      );

      // Create the assistant message
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        error: !!response.error,
      };

      return {
        message: assistantMessage,
        error: response.error,
      };
    } catch (error) {
      console.error('Error in MessagingService:', error);
      
      // Return an error message
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your message. Please try again.',
        timestamp: new Date(),
        error: true,
      };

      return {
        message: errorMessage,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Generate the system prompt for the conversation
   */
  getSystemPrompt(childProfile: ChildProfile, parentProfile?: ParentProfile): string {
    return generateSystemPrompt(childProfile, parentProfile);
  }

  /**
   * Create a user message object
   */
  createUserMessage(content: string): ChatMessage {
    return {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
  }

  /**
   * Validate API configuration
   */
  validateConfig(provider: string, apiKey: string): { valid: boolean; error?: string } {
    if (!provider || provider.trim() === '') {
      return { valid: false, error: 'Provider is required' };
    }

    if (!apiKey || apiKey.trim() === '') {
      return { valid: false, error: 'API key is required' };
    }

    return { valid: true };
  }
}

// Export singleton instance
export const messagingService = new MessagingService();

// Export class for testing
export default MessagingService;
