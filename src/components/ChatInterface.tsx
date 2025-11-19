import { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInput('');

    // TODO: Integrate with LLM API
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
      height: { xs: 'calc(100vh - 200px)', sm: 'calc(100vh - 250px)', md: '70vh' },
      width: '100%'
    }}>
      {/* Messages Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          mb: 2,
          p: 2,
          bgcolor: 'background.default',
          borderRadius: 1,
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
          messages.map((message) => (
            <Card
              key={message.id}
              sx={{
                mb: 2,
              ml: message.role === 'user' ? 'auto' : 0,
              mr: message.role === 'assistant' ? 'auto' : 0,
              maxWidth: { xs: '90%', sm: '85%', md: '80%' },
                bgcolor: message.role === 'user' ? 'primary.light' : 'background.paper',
              }}
            >
              <CardContent>
                <Typography
                  variant="body1"
                  color={message.role === 'user' ? 'white' : 'text.primary'}
                >
                  {message.content}
                </Typography>
              </CardContent>
            </Card>
          ))
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
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={!input.trim()}
          sx={{ alignSelf: 'flex-end' }}
        >
          <SendIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default ChatInterface;
