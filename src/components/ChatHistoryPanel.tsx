import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Typography,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { chatHistoryService } from '../services/chatHistoryService';
import type { ChatHistory } from '../services/chatHistoryService';

interface ChatHistoryPanelProps {
  activeHistoryId: string | null;
  onSelectHistory: (historyId: string) => void;
  onNewChat: () => void;
  messagesCount?: number;
}

const ChatHistoryPanel = ({
  activeHistoryId,
  onSelectHistory,
  onNewChat,
  messagesCount,
}: ChatHistoryPanelProps) => {
  const [histories, setHistories] = useState<ChatHistory[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingHistoryId, setEditingHistoryId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingHistoryId, setDeletingHistoryId] = useState<string | null>(null);

  const loadHistories = () => {
    const allHistories = chatHistoryService.getAllNonEmptyHistories();
    setHistories(allHistories);
  };

  useEffect(() => {
    loadHistories();
  }, []);

  // Reload histories when active history changes or messages are added
  useEffect(() => {
    loadHistories();
  }, [activeHistoryId, messagesCount]);

  const handleNewChat = () => {
    onNewChat();
    loadHistories();
  };

  const handleSelectHistory = (historyId: string) => {
    onSelectHistory(historyId);
  };

  const handleEditClick = (historyId: string, currentTitle: string) => {
    setEditingHistoryId(historyId);
    setEditTitle(currentTitle);
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (editingHistoryId && editTitle.trim()) {
      chatHistoryService.updateHistoryTitle(editingHistoryId, editTitle.trim());
      loadHistories();
      setEditDialogOpen(false);
      setEditingHistoryId(null);
      setEditTitle('');
    }
  };

  const handleDeleteClick = (historyId: string) => {
    setDeletingHistoryId(historyId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingHistoryId) {
      chatHistoryService.deleteHistory(deletingHistoryId);
      loadHistories();
      
      // If deleted history was active, trigger new chat
      if (deletingHistoryId === activeHistoryId) {
        onNewChat();
      }
      
      setDeleteDialogOpen(false);
      setDeletingHistoryId(null);
    }
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Check if the active history is empty
  const activeHistory = activeHistoryId 
    ? chatHistoryService.getHistoryById(activeHistoryId)
    : null;
  const isActiveHistoryEmpty = activeHistory ? activeHistory.messages.length === 0 : false;

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" component="h2">
            Chat History
          </Typography>
        </Box>

        {/* History List */}
        <Box sx={{ 
          flexGrow: 1, 
          overflowY: 'auto',
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
        }}>
          {histories.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                p: 3,
              }}
            >
              <Typography variant="body2" color="text.secondary" align="center">
                No chat history yet.
                <br />
                Start a new conversation!
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {histories.map((history) => (
                <Box key={history.id}>
                  <ListItem
                    disablePadding
                    secondaryAction={
                      <Box>
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(history.id, history.title);
                          }}
                          sx={{ mr: 0.5 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(history.id);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemButton
                      selected={history.id === activeHistoryId}
                      onClick={() => handleSelectHistory(history.id)}
                      sx={{
                        pr: 10, // Make room for action buttons
                      }}
                    >
                      <ListItemText
                        primary={history.title}
                        secondary={`${formatDate(history.updatedAt)} • ${
                          history.messages.length
                        } message${history.messages.length !== 1 ? 's' : ''}`}
                        primaryTypographyProps={{
                          noWrap: true,
                          sx: { fontWeight: history.id === activeHistoryId ? 600 : 400 },
                        }}
                        secondaryTypographyProps={{
                          noWrap: true,
                          fontSize: '0.75rem',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </Box>
              ))}
            </List>
          )}
        </Box>

        {/* New Chat Button */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewChat}
            disabled={isActiveHistoryEmpty}
          >
            New Chat
          </Button>
          {isActiveHistoryEmpty && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 1, textAlign: 'center' }}
            >
              Please send a message before creating a new chat
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Chat Title</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleEditSave();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" disabled={!editTitle.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Chat History</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this chat history? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChatHistoryPanel;
