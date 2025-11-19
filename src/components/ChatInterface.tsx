import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChat } from '../contexts/ChatContext';
import { useProfile } from '../contexts/ProfileContext';
import { useKidProfile } from '../contexts/KidProfileContext';
import { messagingService } from '../services/messagingService';
import type { ChatMessage } from '../services/messagingService';

const ChatInterface = () => {
  const [input, setInput] = useState('');
  const { messages, addMessage, isLoading, setIsLoading } = useChat();
  const { parentProfile, apiKey, provider } = useProfile();
  const { activeKidProfile } = useKidProfile();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Validate that we have the necessary profile and API config
    if (!activeKidProfile || !apiKey || !provider) {
      // This shouldn't happen if ProfileSetup is working correctly
      console.error('Missing profile or API configuration');
      return;
    }

    // Validate API configuration
    const validation = messagingService.validateConfig(provider, apiKey);
    if (!validation.valid) {
      console.error('Invalid API configuration:', validation.error);
      return;
    }

    // Create and add user message
    const userMessage = messagingService.createUserMessage(input);
    addMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      // Send message to LLM
      const response = await messagingService.sendMessage({
        message: input,
        childProfile: activeKidProfile,
        parentProfile: parentProfile || undefined,
        apiKey: apiKey,
        provider: provider,
        conversationHistory: messages,
      });

      // Add assistant message
      addMessage(response.message);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your message. Please try again.',
        timestamp: new Date(),
        error: true,
      };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: { xs: '80vh', md: '75vh' },
      width: '100%'
    }}>
      {/* Messages Area */}
      <Box
        ref={messagesContainerRef}
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          mb: 2,
          p: 2,
          bgcolor: 'background.default',
          borderRadius: 1,
          // Custom scrollbar styling
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            },
          },
          // Firefox scrollbar styling
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0, 0, 0, 0.2) transparent',
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Typography variant="body1" color="text.secondary">
              Ask me anything about parenting your little one! 👶
            </Typography>
          </Box>
        ) : (
          <>
            {messages.map((message) => (
              <Card
                key={message.id}
                sx={{
                  mb: 2,
                  ml: message.role === 'user' ? 'auto' : 0,
                  mr: message.role === 'assistant' ? 'auto' : 0,
                  maxWidth: { xs: '90%', sm: '85%', md: '80%' },
                  bgcolor: message.error 
                    ? 'error.light' 
                    : message.role === 'user' 
                    ? 'primary.light' 
                    : 'background.paper',
                }}
              >
                <CardContent>
                  {message.error && (
                    <Alert severity="error" sx={{ mb: 1 }}>
                      Error sending message
                    </Alert>
                  )}
                  {message.role === 'assistant' ? (
                    <Box
                      sx={{
                        '& h1': { fontSize: '1.5rem', fontWeight: 600, mt: 2, mb: 1 },
                        '& h2': { fontSize: '1.3rem', fontWeight: 600, mt: 2, mb: 1 },
                        '& h3': { fontSize: '1.1rem', fontWeight: 600, mt: 1.5, mb: 0.75 },
                        '& p': { mb: 1 },
                        '& ul, & ol': { pl: 3, mb: 1 },
                        '& li': { mb: 0.5 },
                        '& blockquote': {
                          borderLeft: '4px solid',
                          borderColor: 'primary.main',
                          pl: 2,
                          py: 0.5,
                          my: 1,
                          bgcolor: 'action.hover',
                        },
                        '& code': {
                          bgcolor: 'action.hover',
                          px: 0.5,
                          py: 0.25,
                          borderRadius: 0.5,
                          fontSize: '0.9em',
                        },
                        '& pre': {
                          bgcolor: 'action.hover',
                          p: 2,
                          borderRadius: 1,
                          overflow: 'auto',
                          mb: 1,
                        },
                        '& table': {
                          borderCollapse: 'collapse',
                          width: '100%',
                          mb: 2,
                        },
                        '& th, & td': {
                          border: '1px solid',
                          borderColor: 'divider',
                          px: 1,
                          py: 0.5,
                          textAlign: 'left',
                        },
                        '& th': {
                          bgcolor: 'action.hover',
                          fontWeight: 600,
                        },
                        '& hr': {
                          my: 2,
                          borderColor: 'divider',
                        },
                        '& a': {
                          color: 'primary.main',
                        },
                      }}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </Box>
                  ) : (
                    <Typography
                      variant="body1"
                      color="black"
                    >
                      {message.content}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <CircularProgress size={30} />
              </Box>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>

      {/* Input Area */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Ask a question about your child..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          variant="outlined"
          size="small"
          disabled={isLoading}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          sx={{ alignSelf: 'flex-end' }}
        >
          {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </Paper>
    </Box>
  );
};

export default ChatInterface;
