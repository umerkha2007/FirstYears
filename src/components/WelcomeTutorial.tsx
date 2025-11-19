import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Fade,
  Backdrop,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

interface TutorialStep {
  title: string;
  description: string;
  targetElement?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface WelcomeTutorialProps {
  open: boolean;
  onClose: () => void;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: '👋 Welcome to FirstYears!',
    description: "Congratulations on setting up your profile! Let's take a quick tour to show you around the app and help you get the most out of FirstYears.",
    placement: 'center',
  },
  {
    title: '💬 Chat Input Area',
    description: 'Type your parenting questions here. Ask about feeding, sleeping, development milestones, health concerns, and more. Press Enter or click the send button to get personalized advice.',
    targetElement: 'chat-input',
    placement: 'top',
  },
  {
    title: '📚 Chat History',
    description: 'All your conversations are automatically saved. Access your chat history from the sidebar (or menu on mobile) to review past discussions and continue previous conversations.',
    targetElement: 'chat-history-button',
    placement: 'right',
  },
  {
    title: '👶 Kid Profile Selector',
    description: 'If you have multiple children, you can easily switch between their profiles here. The AI will automatically adjust responses based on the selected child\'s age and medical history.',
    targetElement: 'kid-selector',
    placement: 'bottom',
  },
  {
    title: '👨‍👩‍👧 Manage Kids',
    description: 'Click here to add, edit, or remove kid profiles. You can manage multiple children and keep their information up to date as they grow.',
    targetElement: 'manage-kids-button',
    placement: 'bottom',
  },
  {
    title: '⚙️ Settings',
    description: 'Update your parent profile, change your API provider, or modify your API key anytime by clicking the settings button.',
    targetElement: 'settings-button',
    placement: 'bottom',
  },
  {
    title: '🚀 You\'re All Set!',
    description: 'That\'s it! You\'re ready to start getting personalized parenting advice. Remember, your data is stored locally and securely. Feel free to ask anything - we\'re here to help!',
    placement: 'center',
  },
];

const WelcomeTutorial = ({ open, onClose }: WelcomeTutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [elementPosition, setElementPosition] = useState<DOMRect | null>(null);

  const currentStepData = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;

  // Function to get element position for highlighting
  const getElementPosition = (): DOMRect | null => {
    const targetElement = currentStepData.targetElement;
    if (!targetElement) return null;

    let element: HTMLElement | null = null;

    // Map target element IDs to actual DOM queries
    switch (targetElement) {
      case 'chat-input':
        element = document.querySelector('input[placeholder*="Ask a question"]') as HTMLElement ||
                  document.querySelector('textarea[placeholder*="Ask a question"]') as HTMLElement;
        break;
      case 'chat-history-button':
        // First check for mobile menu button
        element = document.querySelector('button[aria-label="open drawer"]') as HTMLElement;
        if (!element) {
          // On desktop, look for the sidebar with our data attribute
          element = document.querySelector('[data-tutorial-id="chat-history-sidebar"]') as HTMLElement;
        }
        break;
      case 'menu-button':
        element = document.querySelector('button[aria-label="open drawer"]') as HTMLElement;
        break;
      case 'kid-selector':
        element = document.querySelector('[role="combobox"]') as HTMLElement;
        break;
      case 'manage-kids-button':
        element = document.querySelector('button:has(svg[data-testid="ChildCareIcon"])') as HTMLElement;
        break;
      case 'settings-button':
        element = document.querySelector('button[aria-label="settings"]') as HTMLElement;
        break;
    }

    return element ? element.getBoundingClientRect() : null;
  };

  useEffect(() => {
    if (open) {
      const updatePosition = () => {
        setElementPosition(getElementPosition());
      };
      
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
      
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
      };
    }
  }, [currentStep, open]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  const handleSkip = () => {
    handleClose();
  };

  // Calculate tooltip position based on element position and placement
  const getTooltipStyle = () => {
    if (!elementPosition || currentStepData.placement === 'center') {
      return {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '500px',
        width: '90%',
      };
    }

    const padding = 20;
    const tooltipWidth = 350;
    
    let style: any = {
      position: 'fixed' as const,
      maxWidth: `${tooltipWidth}px`,
      width: '90%',
    };

    switch (currentStepData.placement) {
      case 'top':
        style.left = elementPosition.left + elementPosition.width / 2;
        style.bottom = window.innerHeight - elementPosition.top + padding;
        style.transform = 'translateX(-50%)';
        break;
      case 'bottom':
        style.left = elementPosition.left + elementPosition.width / 2;
        style.top = elementPosition.bottom + padding;
        style.transform = 'translateX(-50%)';
        break;
      case 'left':
        style.right = window.innerWidth - elementPosition.left + padding;
        style.top = elementPosition.top + elementPosition.height / 2;
        style.transform = 'translateY(-50%)';
        break;
      case 'right':
        style.left = elementPosition.right + padding;
        style.top = elementPosition.top + elementPosition.height / 2;
        style.transform = 'translateY(-50%)';
        break;
    }

    return style;
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop - only shows when no element is targeted (center placement) */}
      {(!elementPosition || currentStepData.placement === 'center') && (
        <Backdrop
          open={open}
          sx={{
            zIndex: 1400,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          }}
          onClick={handleSkip}
        />
      )}

      {/* Spotlight effect with cutout for target element */}
      {elementPosition && currentStepData.targetElement && (
        <Fade in={true}>
          <Box
            sx={{
              position: 'fixed',
              top: elementPosition.top - 8,
              left: elementPosition.left - 8,
              width: elementPosition.width + 16,
              height: elementPosition.height + 16,
              borderRadius: 2,
              zIndex: 1401,
              pointerEvents: 'none',
              // Create spotlight effect: dark overlay everywhere except this element
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)',
            }}
          />
        </Fade>
      )}

      {/* Animated ring around target element */}
      {elementPosition && currentStepData.targetElement && (
        <Fade in={true}>
          <Box
            sx={{
              position: 'fixed',
              top: elementPosition.top - 8,
              left: elementPosition.left - 8,
              width: elementPosition.width + 16,
              height: elementPosition.height + 16,
              border: '4px solid',
              borderColor: 'primary.main',
              borderRadius: 2,
              zIndex: 1402,
              pointerEvents: 'none',
              boxShadow: '0 0 20px rgba(25, 118, 210, 0.6)',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%, 100%': {
                  borderColor: 'primary.main',
                  transform: 'scale(1)',
                },
                '50%': {
                  borderColor: 'primary.light',
                  transform: 'scale(1.02)',
                },
              },
            }}
          />
        </Fade>
      )}

      {/* Tooltip with content */}
      <Fade in={true} key={currentStep}>
        <Paper
          elevation={8}
          sx={{
            ...getTooltipStyle(),
            zIndex: 1403,
            p: 3,
            borderRadius: 2,
          }}
        >
          {/* Title */}
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: 600, mb: 1.5 }}
          >
            {currentStepData.title}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, lineHeight: 1.6 }}
          >
            {currentStepData.description}
          </Typography>

          {/* Step counter */}
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mb: 0.5 }}
          >
            Step {currentStep + 1} of {tutorialSteps.length}
          </Typography>
        </Paper>
      </Fade>

      {/* Navigation buttons - fixed bottom */}
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1403,
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 0,
        }}
      >
        <Box sx={{ flex: 1 }} />
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flex: 1 }}>
          <Button
            onClick={handleBack}
            disabled={currentStep === 0}
            startIcon={<NavigateBeforeIcon />}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            variant="contained"
            endIcon={!isLastStep && <NavigateNextIcon />}
            sx={{ minWidth: 100 }}
          >
            {isLastStep ? 'Finish' : 'Next'}
          </Button>
        </Box>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={handleSkip}
            variant="text"
            startIcon={<CloseIcon />}
            sx={{ minWidth: 120 }}
          >
            Skip Tutorial
          </Button>
        </Box>
      </Paper>
    </>
  );
};

export default WelcomeTutorial;
