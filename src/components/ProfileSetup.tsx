import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  Tooltip,
} from '@mui/material';

const steps = ['Parent Profile', 'Child Profile', 'API Configuration'];

interface APIGuide {
  provider: string;
  steps: string[];
}

const apiGuides: Record<string, APIGuide> = {
  'openai-gpt4': {
    provider: 'OpenAI GPT-4',
    steps: [
      'Go to https://platform.openai.com',
      'Sign in or create an account',
      'Click on your profile icon in the top-right corner',
      'Select "API keys" from the dropdown menu',
      'Click "Create new secret key"',
      'Copy the API key (you won\'t be able to see it again)',
      'Paste it in the API Key field below'
    ]
  },
  'openai-gpt35': {
    provider: 'OpenAI GPT-3.5',
    steps: [
      'Go to https://platform.openai.com',
      'Sign in or create an account',
      'Click on your profile icon in the top-right corner',
      'Select "API keys" from the dropdown menu',
      'Click "Create new secret key"',
      'Copy the API key (you won\'t be able to see it again)',
      'Paste it in the API Key field below'
    ]
  },
  'anthropic-claude': {
    provider: 'Anthropic Claude',
    steps: [
      'Go to https://console.anthropic.com',
      'Sign in or create an account',
      'Navigate to "API Keys" in the left sidebar',
      'Click "Create Key"',
      'Give your key a name',
      'Copy the API key immediately (it won\'t be shown again)',
      'Paste it in the API Key field below'
    ]
  },
  'google-gemini': {
    provider: 'Google Gemini',
    steps: [
      'Go to https://makersuite.google.com/app/apikey',
      'Sign in with your Google account',
      'Click "Create API Key"',
      'Select an existing Google Cloud project or create a new one',
      'Copy the generated API key',
      'Paste it in the API Key field below'
    ]
  },
  'cohere': {
    provider: 'Cohere',
    steps: [
      'Go to https://dashboard.cohere.com',
      'Sign in or create an account',
      'Navigate to the "API Keys" section',
      'Your default API key will be displayed',
      'Click "Copy" to copy the key',
      'Paste it in the API Key field below'
    ]
  }
};

const ProfileSetup = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');
  const [childDOB, setChildDOB] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState('');
  const [guideModalOpen, setGuideModalOpen] = useState(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSave = () => {
    // TODO: Save to localStorage
    console.log('Saving profiles...');
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0:
        return parentName.trim() !== '';
      case 1:
        return childName.trim() !== '' && childDOB !== '';
      case 2:
        return provider !== '' && apiKey.trim() !== '';
      default:
        return true;
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Parent Information
            </Typography>
            <TextField
              fullWidth
              label="Your Name"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              margin="normal"
              required
              error={parentName.trim() === ''}
              helperText={parentName.trim() === '' ? 'This field is required' : ''}
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Child Information
            </Typography>
            <TextField
              fullWidth
              label="Child's Name"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              margin="normal"
              required
              error={childName.trim() === ''}
              helperText={childName.trim() === '' ? 'This field is required' : ''}
            />
            <TextField
              fullWidth
              type="date"
              label="Date of Birth"
              value={childDOB}
              onChange={(e) => setChildDOB(e.target.value)}
              margin="normal"
              slotProps={{
                inputLabel: { shrink: true },
                input: {
                  sx: {
                    '& input[type="date"]::-webkit-calendar-picker-indicator': {
                      cursor: 'pointer',
                    }
                  }
                }
              }}
              required
              error={childDOB === ''}
              helperText={childDOB === '' ? 'This field is required' : ''}
              onClick={(e) => {
                const input = e.currentTarget.querySelector('input[type="date"]') as HTMLInputElement;
                if (input) {
                  input.showPicker?.();
                }
              }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Medical History (optional)"
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
              margin="normal"
              placeholder="Any relevant medical information..."
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              API Configuration
            </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel id="provider-select-label">Select AI Model</InputLabel>
              <Select
                labelId="provider-select-label"
                value={provider}
                label="Select AI Model"
                onChange={(e) => setProvider(e.target.value)}
              >
                <MenuItem value="openai-gpt4">OpenAI GPT-4</MenuItem>
                <MenuItem value="openai-gpt35">OpenAI GPT-3.5 Turbo</MenuItem>
                <MenuItem value="anthropic-claude">Anthropic Claude</MenuItem>
                <MenuItem value="google-gemini">Google Gemini</MenuItem>
                <MenuItem value="cohere">Cohere</MenuItem>
              </Select>
            </FormControl>
            
            {provider && (
              <>
                <Box sx={{ mt: 2, mb: 1 }}>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => setGuideModalOpen(true)}
                    sx={{ cursor: 'pointer' }}
                  >
                    📖 Guide on how to get API Key for {apiGuides[provider]?.provider}
                  </Link>
                </Box>
                <TextField
                  fullWidth
                  type="password"
                  label="API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  margin="normal"
                  required
                  error={apiKey.trim() === ''}
                  helperText={apiKey.trim() === '' ? 'This field is required' : 'Your API key is stored locally and never sent to our servers'}
                />
              </>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: { xs: 2, sm: 4 }, width: '100%' }}>
      <Card sx={{ mx: { xs: 0, sm: 2 } }}>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            Welcome to FirstYears! 👶
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Let's set up your profile to provide personalized parenting advice
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ minHeight: 300 }}>
            {renderStepContent(activeStep)}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Tooltip
              title={!isStepValid(activeStep) ? "Please fill in the required fields first" : ""}
              arrow
            >
              <span>
                <Button
                  variant="contained"
                  onClick={activeStep === steps.length - 1 ? handleSave : handleNext}
                  disabled={!isStepValid(activeStep)}
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </span>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>

      {/* API Key Guide Modal */}
      <Dialog
        open={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          How to get your {provider && apiGuides[provider]?.provider} API Key
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {provider && apiGuides[provider]?.steps.map((step, index) => (
              <Box key={index} sx={{ mb: 2, display: 'flex', alignItems: 'flex-start' }}>
                <Typography
                  component="span"
                  sx={{
                    minWidth: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}
                >
                  {index + 1}
                </Typography>
                <Typography sx={{ pt: 0.5 }}>{step}</Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGuideModalOpen(false)} variant="contained">
            Got it!
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfileSetup;
