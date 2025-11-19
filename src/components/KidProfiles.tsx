import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import { kidProfilesService, type KidProfile } from '../services/kidProfilesService';
import { formatAge } from '../utils/ageCalculator';

interface KidProfilesProps {
  onBack?: () => void;
}

const KidProfiles = ({ onBack }: KidProfilesProps) => {
  const [profiles, setProfiles] = useState<KidProfile[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<KidProfile | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<KidProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    medicalHistory: '',
  });

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = () => {
    const loadedProfiles = kidProfilesService.getAllKidProfilesSorted();
    setProfiles(loadedProfiles);
  };

  const handleOpenDialog = (profile?: KidProfile) => {
    if (profile) {
      setEditingProfile(profile);
      setFormData({
        name: profile.name,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender || '',
        medicalHistory: profile.medicalHistory || '',
      });
    } else {
      setEditingProfile(null);
      setFormData({
        name: '',
        dateOfBirth: '',
        gender: '',
        medicalHistory: '',
      });
    }
    setError(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProfile(null);
    setFormData({
      name: '',
      dateOfBirth: '',
      gender: '',
      medicalHistory: '',
    });
    setError(null);
  };

  const handleSaveProfile = () => {
    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.dateOfBirth) {
      setError('Date of birth is required');
      return;
    }

    // Check if date is not in the future
    const selectedDate = new Date(formData.dateOfBirth);
    if (selectedDate > new Date()) {
      setError('Date of birth cannot be in the future');
      return;
    }

    if (editingProfile) {
      // Update existing profile
      const success = kidProfilesService.updateKidProfile(editingProfile.id, {
        name: formData.name.trim(),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender || undefined,
        medicalHistory: formData.medicalHistory.trim(),
      });

      if (success) {
        loadProfiles();
        handleCloseDialog();
      } else {
        setError('Failed to update profile');
      }
    } else {
      // Create new profile
      const newProfile = kidProfilesService.createKidProfile(
        formData.name.trim(),
        formData.dateOfBirth,
        formData.gender || undefined,
        formData.medicalHistory.trim()
      );

      if (newProfile) {
        loadProfiles();
        handleCloseDialog();
      } else {
        setError('Failed to create profile');
      }
    }
  };

  const handleDeleteClick = (profile: KidProfile) => {
    setProfileToDelete(profile);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (profileToDelete) {
      const success = kidProfilesService.deleteKidProfile(profileToDelete.id);
      if (success) {
        loadProfiles();
      }
    }
    setDeleteDialogOpen(false);
    setProfileToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setProfileToDelete(null);
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Manage Kid Profiles
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Kid
          </Button>
          {onBack && (
            <Button variant="outlined" onClick={onBack}>
              Back to Chat
            </Button>
          )}
        </Box>
      </Box>

      {profiles.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <PersonIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No kid profiles yet
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Add your first kid profile to start tracking their development
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Your First Kid
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {profiles.map((profile) => (
            <Card key={profile.id}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" component="h2">
                      {profile.name}
                    </Typography>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(profile)}
                        aria-label="edit"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(profile)}
                        aria-label="delete"
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Date of Birth
                    </Typography>
                    <Typography variant="body1">
                      {new Date(profile.dateOfBirth).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={formatAge(profile.dateOfBirth)}
                      color="primary"
                      size="small"
                    />
                  </Box>

                  {profile.medicalHistory && (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Medical History
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          maxHeight: 60,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {profile.medicalHistory}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
          ))}
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingProfile ? 'Edit Kid Profile' : 'Add New Kid Profile'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Date of Birth"
            type="date"
            fullWidth
            required
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              max: new Date().toISOString().split('T')[0],
            }}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel id="kid-gender-select-label">Gender (Optional)</InputLabel>
            <Select
              labelId="kid-gender-select-label"
              value={formData.gender}
              label="Gender (Optional)"
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            >
              <MenuItem value="">Prefer not to say</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="non-binary">Non-binary</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Medical History (Optional)"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={formData.medicalHistory}
            onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
            placeholder="Any relevant medical information, allergies, conditions, etc."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveProfile} variant="contained">
            {editingProfile ? 'Save Changes' : 'Add Kid'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Delete Kid Profile</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{profileToDelete?.name}</strong>'s profile?
            This will also delete all associated chat history.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default KidProfiles;
