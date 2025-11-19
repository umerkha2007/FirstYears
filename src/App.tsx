import { useState, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import Layout from './components/Layout';
import ProfileSetup from './components/ProfileSetup';
import ChatInterface from './components/ChatInterface';
import { useProfile } from './contexts/ProfileContext';
import './App.css';

function App() {
  const { isSetupComplete } = useProfile();
  const [showSetup, setShowSetup] = useState(true);

  useEffect(() => {
    setShowSetup(!isSetupComplete());
  }, [isSetupComplete]);

  return (
    <Layout>
      <Container 
        maxWidth="lg" 
        sx={{ 
          width: '100%',
          px: { xs: 2, sm: 3, md: 4 }
        }}
      >
        <Box sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          {showSetup ? (
            <ProfileSetup />
          ) : (
            <ChatInterface />
          )}
        </Box>
      </Container>
    </Layout>
  );
}

export default App;
