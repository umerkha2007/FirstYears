import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { chatHistoryService } from '../services/chatHistoryService';
import type { ChatMessage } from '../services/messagingService';
import { useKidProfile } from './KidProfileContext';

interface ChatContextType {
  messages: ChatMessage[];
  activeHistoryId: string | null;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  addMessage: (message: ChatMessage) => void;
  loadHistory: (historyId: string) => void;
  createNewChat: () => void;
  refreshHistories: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { activeKidProfileId } = useKidProfile();

  // Initialize with an empty history or load existing empty one for active kid
  useEffect(() => {
    if (activeKidProfileId) {
      const emptyHistory = chatHistoryService.getOrCreateEmptyHistory(activeKidProfileId);
      setActiveHistoryId(emptyHistory.id);
      setMessages(emptyHistory.messages);
    } else {
      // No active kid profile, clear messages
      setActiveHistoryId(null);
      setMessages([]);
    }
  }, [activeKidProfileId]);

  const addMessage = (message: ChatMessage) => {
    if (!activeHistoryId || !activeKidProfileId) return;

    // Add message to state
    setMessages((prev) => [...prev, message]);

    // Save to history service
    chatHistoryService.addMessageToHistory(activeHistoryId, message);
  };

  const loadHistory = (historyId: string) => {
    const history = chatHistoryService.getHistoryById(historyId);
    if (history) {
      setActiveHistoryId(history.id);
      setMessages(history.messages);
    }
  };

  const createNewChat = () => {
    if (!activeKidProfileId) return;

    // Check if current history is empty
    if (activeHistoryId) {
      const currentHistory = chatHistoryService.getHistoryById(activeHistoryId);
      if (currentHistory && currentHistory.messages.length === 0) {
        // Already on an empty chat, no need to create new one
        return;
      }
    }

    // Create or get empty history for active kid
    const emptyHistory = chatHistoryService.getOrCreateEmptyHistory(activeKidProfileId);
    setActiveHistoryId(emptyHistory.id);
    setMessages(emptyHistory.messages);
  };

  const refreshHistories = () => {
    // This is called by components to trigger re-render when histories change
    if (activeHistoryId) {
      const history = chatHistoryService.getHistoryById(activeHistoryId);
      if (history) {
        setMessages(history.messages);
      }
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        activeHistoryId,
        isLoading,
        setIsLoading,
        addMessage,
        loadHistory,
        createNewChat,
        refreshHistories,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
