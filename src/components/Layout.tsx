import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import type { ReactNode } from 'react';
import Header from './Header';
import ChatHistoryPanel from './ChatHistoryPanel';
import { useChat } from '../contexts/ChatContext';

interface LayoutProps {
  children: ReactNode;
  onSettingsClick?: () => void;
  onManageKidsClick?: () => void;
  onHelpClick?: () => void;
  showChatHistory?: boolean;
  showKidSelector?: boolean;
}

const DRAWER_WIDTH = 280;

const Layout = ({ 
  children, 
  onSettingsClick, 
  onManageKidsClick,
  onHelpClick,
  showChatHistory = false,
  showKidSelector = false,
}: LayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { activeHistoryId, loadHistory, createNewChat, messages } = useChat();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSelectHistory = (historyId: string) => {
    loadHistory(historyId);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleNewChat = () => {
    createNewChat();
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = showChatHistory ? (
    <ChatHistoryPanel
      activeHistoryId={activeHistoryId}
      onSelectHistory={handleSelectHistory}
      onNewChat={handleNewChat}
      messagesCount={messages.length}
    />
  ) : null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
      <Header 
        onSettingsClick={onSettingsClick}
        onManageKidsClick={onManageKidsClick}
        onHelpClick={onHelpClick}
        onMenuClick={handleDrawerToggle}
        showMenuButton={showChatHistory && isMobile}
        showKidSelector={showKidSelector}
      />
      
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden', minHeight: 0 }}>
        {/* Chat History Sidebar - Desktop */}
        {showChatHistory && !isMobile && (
          <Box
            data-tutorial-id="chat-history-sidebar"
            sx={{
              width: DRAWER_WIDTH,
              flexShrink: 0,
              borderRight: 1,
              borderColor: 'divider',
              overflow: 'hidden',
              height: '100%',
            }}
          >
            {drawer}
          </Box>
        )}

        {/* Chat History Sidebar - Mobile Drawer */}
        {showChatHistory && isMobile && (
          <Drawer
            variant="temporary"
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better mobile performance
            }}
            sx={{
              '& .MuiDrawer-paper': {
                width: DRAWER_WIDTH,
                boxSizing: 'border-box',
              },
            }}
          >
            {drawer}
          </Drawer>
        )}

        {/* Main Content */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: { xs: 1, sm: 2, md: 3 }, 
            width: '100%',
            overflow: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
