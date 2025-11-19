import { useState, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import Layout from './components/Layout';
import ProfileSetup from './components/ProfileSetup';
import ChatInterface from './components/ChatInterface';
import { useProfile } from './contexts/ProfileContext';
import './App.css';

function App() {
  const { isSetupComplete, refreshProfileData } = useProfile();
  const [showSetup, setShowSetup] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Check setup completion on mount
    setShowSetup(!isSetupComplete());
  }, [isSetupComplete]);

  const handleSetupComplete = () => {
    // Refresh profile data and switch to chat
    refreshProfileData();
    setShowSetup(false);
    setIsEditing(false);
  };

  const handleSettingsClick = () => {
    // Navigate to ProfileSetup in editing mode
    setIsEditing(true);
    setShowSetup(true);
  };

  return (
    <Layout 
      onSettingsClick={showSetup ? undefined : handleSettingsClick}
      showChatHistory={!showSetup}
    >
      <Container 
        maxWidth="lg" 
        sx={{ 
          width: '100%',
          px: { xs: 2, sm: 3, md: 4 }
        }}
      >
        <Box sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          {showSetup ? (
            <ProfileSetup onSetupComplete={handleSetupComplete} isEditing={isEditing} />
          ) : (
            <ChatInterface />
          )}
        </Box>
      </Container>
    </Layout>
  );
}

export default App;
