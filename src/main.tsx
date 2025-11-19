import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ProfileProvider } from './contexts/ProfileContext';
import { KidProfileProvider } from './contexts/KidProfileContext';
import { ChatProvider } from './contexts/ChatContext';
import { theme } from './theme';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ProfileProvider>
        <KidProfileProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
        </KidProfileProvider>
      </ProfileProvider>
    </ThemeProvider>
  </StrictMode>,
);
