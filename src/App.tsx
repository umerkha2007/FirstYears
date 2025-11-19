import { useState, useEffect } from 'react';
import { Container, Box, Alert } from '@mui/material';
import Layout from './components/Layout';
import ProfileSetup from './components/ProfileSetup';
import ChatInterface from './components/ChatInterface';
import KidProfiles from './components/KidProfiles';
import WelcomeTutorial from './components/WelcomeTutorial';
import { useProfile } from './contexts/ProfileContext';
import { useKidProfile } from './contexts/KidProfileContext';
import { kidProfilesService } from './services/kidProfilesService';
import './App.css';

type ViewType = 'setup' | 'kidProfiles' | 'chat';

const TUTORIAL_SHOWN_KEY = 'firstyears_tutorial_shown';

function App() {
  const { isSetupComplete, refreshProfileData } = useProfile();
  const { hasKidProfiles, refreshKidProfiles } = useKidProfile();
  const [currentView, setCurrentView] = useState<ViewType>('setup');
  const [isEditing, setIsEditing] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // Determine which view to show on mount
    if (!isSetupComplete()) {
      setCurrentView('setup');
    } else if (!hasKidProfiles) {
      setCurrentView('kidProfiles');
    } else {
      setCurrentView('chat');
    }
  }, [isSetupComplete, hasKidProfiles]);

  const handleSetupComplete = () => {
    // Refresh profile data and navigate appropriately
    refreshProfileData();
    refreshKidProfiles(); // Refresh kid profiles to pick up newly created profile
    const wasEditing = isEditing;
    setIsEditing(false);
    
    // Re-check hasKidProfiles after refresh
    const currentHasKidProfiles = kidProfilesService.hasKidProfiles();
    
    if (!currentHasKidProfiles) {
      setCurrentView('kidProfiles');
    } else {
      setCurrentView('chat');
      
      // Show tutorial only if this is the first time completing setup (not editing)
      if (!wasEditing) {
        const tutorialShown = localStorage.getItem(TUTORIAL_SHOWN_KEY);
        if (!tutorialShown) {
          // Small delay to let the chat view render first
          setTimeout(() => {
            setShowTutorial(true);
          }, 500);
        }
      }
    }
  };

  const handleSettingsClick = () => {
    // Navigate to ProfileSetup in editing mode
    setIsEditing(true);
    setCurrentView('setup');
  };

  const handleManageKidsClick = () => {
    setCurrentView('kidProfiles');
  };

  const handleBackToChat = () => {
    refreshKidProfiles();
    if (hasKidProfiles) {
      setCurrentView('chat');
      
      // Show tutorial if coming from kid profiles page for the first time
      const tutorialShown = localStorage.getItem(TUTORIAL_SHOWN_KEY);
      if (!tutorialShown) {
        setTimeout(() => {
          setShowTutorial(true);
        }, 500);
      }
    } else {
      // If there are no kid profiles, stay on kid profiles page
      setCurrentView('kidProfiles');
    }
  };

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem(TUTORIAL_SHOWN_KEY, 'true');
  };

  const handleShowTutorial = () => {
    setShowTutorial(true);
  };

  const showChatHistory = currentView === 'chat';
  const showKidSelector = currentView === 'chat' && hasKidProfiles;

  return (
    <Layout 
      onSettingsClick={showChatHistory ? handleSettingsClick : undefined}
      onManageKidsClick={showChatHistory ? handleManageKidsClick : undefined}
      onHelpClick={showChatHistory ? handleShowTutorial : undefined}
      showChatHistory={showChatHistory}
      showKidSelector={showKidSelector}
    >
      <Container 
        maxWidth="lg" 
        sx={{ 
          width: '100%',
          px: { xs: 2, sm: 3, md: 4 }
        }}
      >
        <Box sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          {currentView === 'setup' && (
            <ProfileSetup onSetupComplete={handleSetupComplete} isEditing={isEditing} />
          )}
          
          {currentView === 'kidProfiles' && (
            <>
              {!hasKidProfiles && isSetupComplete() && (
                <Alert severity="info" sx={{ mb: 3 }}>
                  Please add at least one kid profile to start using the chat.
                </Alert>
              )}
              <KidProfiles onBack={hasKidProfiles ? handleBackToChat : undefined} />
            </>
          )}
          
          {currentView === 'chat' && hasKidProfiles && (
            <ChatInterface />
          )}
        </Box>
      </Container>

      {/* Welcome Tutorial */}
      <WelcomeTutorial open={showTutorial} onClose={handleCloseTutorial} />
    </Layout>
  );
}

export default App;
