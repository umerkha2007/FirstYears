/**
 * Chat History Service
 * Manages multiple chat histories and their messages
 */

import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage';
import type { ChatMessage } from './messagingService';

const STORAGE_KEY = 'firstyears_chat_histories';

export interface ChatHistory {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

class ChatHistoryService {
  /**
   * Load all chat histories from localStorage
   */
  loadAllHistories(): ChatHistory[] {
    const histories = loadFromLocalStorage<ChatHistory[]>(STORAGE_KEY);
    if (!histories) return [];

    // Convert date strings back to Date objects
    return histories.map((history) => ({
      ...history,
      createdAt: new Date(history.createdAt),
      updatedAt: new Date(history.updatedAt),
      messages: history.messages.map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }));
  }

  /**
   * Save all chat histories to localStorage
   */
  private saveAllHistories(histories: ChatHistory[]): boolean {
    try {
      saveToLocalStorage(STORAGE_KEY, histories);
      return true;
    } catch (error) {
      console.error('Failed to save chat histories:', error);
      return false;
    }
  }

  /**
   * Create a new chat history
   */
  createNewHistory(): ChatHistory {
    const newHistory: ChatHistory = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const histories = this.loadAllHistories();
    histories.unshift(newHistory); // Add to beginning
    this.saveAllHistories(histories);

    return newHistory;
  }

  /**
   * Get a specific chat history by ID
   */
  getHistoryById(id: string): ChatHistory | null {
    const histories = this.loadAllHistories();
    return histories.find((h) => h.id === id) || null;
  }

  /**
   * Add a message to a chat history
   */
  addMessageToHistory(historyId: string, message: ChatMessage): boolean {
    const histories = this.loadAllHistories();
    const historyIndex = histories.findIndex((h) => h.id === historyId);

    if (historyIndex === -1) return false;

    histories[historyIndex].messages.push(message);
    histories[historyIndex].updatedAt = new Date();

    // Update title based on first user message
    if (
      histories[historyIndex].title === 'New Chat' &&
      message.role === 'user' &&
      histories[historyIndex].messages.length === 1
    ) {
      histories[historyIndex].title = this.generateTitle(message.content);
    }

    return this.saveAllHistories(histories);
  }

  /**
   * Delete a chat history
   */
  deleteHistory(historyId: string): boolean {
    const histories = this.loadAllHistories();
    const filteredHistories = histories.filter((h) => h.id !== historyId);

    if (filteredHistories.length === histories.length) {
      return false; // History not found
    }

    return this.saveAllHistories(filteredHistories);
  }

  /**
   * Update chat history title
   */
  updateHistoryTitle(historyId: string, newTitle: string): boolean {
    const histories = this.loadAllHistories();
    const historyIndex = histories.findIndex((h) => h.id === historyId);

    if (historyIndex === -1) return false;

    histories[historyIndex].title = newTitle;
    histories[historyIndex].updatedAt = new Date();

    return this.saveAllHistories(histories);
  }

  /**
   * Clear all messages from a chat history
   */
  clearHistoryMessages(historyId: string): boolean {
    const histories = this.loadAllHistories();
    const historyIndex = histories.findIndex((h) => h.id === historyId);

    if (historyIndex === -1) return false;

    histories[historyIndex].messages = [];
    histories[historyIndex].title = 'New Chat';
    histories[historyIndex].updatedAt = new Date();

    return this.saveAllHistories(histories);
  }

  /**
   * Check if there's an empty chat history
   */
  hasEmptyHistory(): boolean {
    const histories = this.loadAllHistories();
    return histories.some((h) => h.messages.length === 0);
  }

  /**
   * Get the most recent empty history or create one
   */
  getOrCreateEmptyHistory(): ChatHistory {
    const histories = this.loadAllHistories();
    const emptyHistory = histories.find((h) => h.messages.length === 0);

    if (emptyHistory) {
      return emptyHistory;
    }

    return this.createNewHistory();
  }

  /**
   * Get all non-empty chat histories sorted by updated date
   */
  getAllNonEmptyHistories(): ChatHistory[] {
    const histories = this.loadAllHistories();
    return histories
      .filter((h) => h.messages.length > 0)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  /**
   * Generate a title from the first message
   */
  private generateTitle(content: string): string {
    // Take first 50 characters and trim
    const maxLength = 50;
    const trimmed = content.trim();

    if (trimmed.length <= maxLength) {
      return trimmed;
    }

    // Find last space before max length
    const lastSpace = trimmed.lastIndexOf(' ', maxLength);
    if (lastSpace > 0) {
      return trimmed.substring(0, lastSpace) + '...';
    }

    return trimmed.substring(0, maxLength) + '...';
  }

  /**
   * Export all chat histories as JSON
   */
  exportAllHistories(): string | null {
    const histories = this.loadAllHistories();
    try {
      return JSON.stringify(histories, null, 2);
    } catch (error) {
      console.error('Failed to export chat histories:', error);
      return null;
    }
  }

  /**
   * Import chat histories from JSON
   */
  importHistories(jsonString: string): boolean {
    try {
      const histories = JSON.parse(jsonString) as ChatHistory[];
      return this.saveAllHistories(histories);
    } catch (error) {
      console.error('Failed to import chat histories:', error);
      return false;
    }
  }

  /**
   * Clear all chat histories
   */
  clearAllHistories(): boolean {
    return this.saveAllHistories([]);
  }
}

// Export singleton instance
export const chatHistoryService = new ChatHistoryService();

// Export class for testing
export default ChatHistoryService;
