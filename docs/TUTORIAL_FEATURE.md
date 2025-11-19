# Welcome Tutorial Feature

## Overview

The FirstYears app includes an interactive guided tour that highlights features on the actual interface after users complete their profile setup. The tutorial uses a spotlight effect to draw attention to specific elements while providing contextual information.

## Features

### Automatic Display
- The tutorial automatically appears when a user completes their profile setup for the first time
- It only shows once per user (tracked via localStorage)
- The tutorial is skipped when editing an existing profile

### Guided Tour Design

The tutorial follows a modern "guided tour" approach:
- **Spotlight Effect**: A dark backdrop with a cutout highlights the target element
- **Animated Ring**: A pulsing border encircles the highlighted feature
- **Contextual Tooltip**: Information appears near the highlighted element
- **Fixed Navigation**: Next/Back buttons stay at the bottom of the screen
- **Easy Exit**: Skip button fixed in the top-right corner

### Tutorial Steps

The tutorial consists of 7 comprehensive steps:

1. **Welcome Screen** - Greets the user and introduces the tutorial (center)
2. **Chat Input Area** - Shows where to type questions (highlights input field)
3. **Chat History** - Demonstrates accessing past conversations (highlights menu/sidebar button)
4. **Kid Profile Selector** - Explains switching between multiple children (highlights dropdown)
5. **Manage Kids** - Shows how to add/edit kid profiles (highlights manage button)
6. **Settings** - Explains how to update profile and API configuration (highlights settings button)
7. **Completion** - Final encouragement message (center)

### Interactive Highlights

The tutorial uses several visual techniques to guide users:

- **Spotlight Backdrop**: A dark overlay (75% opacity) covers the entire screen
- **Element Cutout**: The target element appears in a "spotlight" with a custom box-shadow
- **Animated Border**: A 4px pulsing border with primary color highlights the target
- **Smart Positioning**: Tooltips automatically position themselves (top, bottom, left, right, or center)
- **Responsive Design**: Automatically adjusts to screen size and element positions

### Navigation Controls

- **Next Button** (bottom center): Advances to the next step or finishes the tour
- **Back Button** (bottom center): Returns to the previous step (disabled on first step)
- **Skip Button** (top right): Exits the tutorial at any time
- **Backdrop Click**: Clicking the dark backdrop also exits the tutorial

## Technical Implementation

### Components

#### WelcomeTutorial.tsx
The main tutorial component that manages:
- Step progression with state management
- Dynamic element highlighting with DOM queries
- Position tracking with resize/scroll listeners
- Tooltip positioning based on element location
- Backdrop with spotlight effect using box-shadow
- Fixed navigation controls

#### Key Features:
- **Dynamic Positioning**: Uses `getBoundingClientRect()` to track element positions
- **Event Listeners**: Updates positions on window resize and scroll
- **Smart Placement**: Automatically positions tooltips based on available space
- **Fade Transitions**: Smooth animations between steps
- **Z-Index Layering**: Proper stacking (backdrop: 1400, highlight: 1402, content: 1403)

### Integration Points
- **App.tsx** - Controls when to show the tutorial
- **Layout.tsx** - Passes help button handler
- **Header.tsx** - Displays help button (?) to restart tutorial

### State Management

The tutorial uses localStorage to track completion:
```typescript
const TUTORIAL_SHOWN_KEY = 'firstyears_tutorial_shown';
```

Position tracking uses React state:
```typescript
const [currentStep, setCurrentStep] = useState(0);
const [elementPosition, setElementPosition] = useState<DOMRect | null>(null);
```

### Tutorial Step Interface
```typescript
interface TutorialStep {
  title: string;
  description: string;
  targetElement?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}
```

### Styling Features

**Spotlight Effect:**
```css
boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75), 0 0 20px rgba(25, 118, 210, 0.6)'
```

**Pulse Animation:**
```css
@keyframes pulse {
  0%, 100%: { borderColor: primary.main, transform: scale(1) }
  50%: { borderColor: primary.light, transform: scale(1.02) }
}
```

## User Experience

### First-Time Users
1. Complete profile setup (parent info, child info, API config)
2. Tutorial automatically opens after 500ms delay
3. Dark backdrop appears with spotlight on first element
4. User navigates through steps using bottom navigation bar
5. Each step highlights a different feature with contextual tooltip
6. Tutorial is marked as completed in localStorage

### Returning Users
- Tutorial doesn't appear on subsequent visits
- Can manually restart via help button (?) in header
- Tutorial state persists across sessions

## Responsive Design

The tutorial is fully responsive:
- **Tooltip Positioning**: Automatically adjusts based on screen size and element location
- **Mobile Support**: Touch-friendly controls and appropriate sizing
- **Dynamic Updates**: Position tracking updates on resize and scroll events
- **Safe Boundaries**: Tooltips stay within viewport bounds
- **Fixed Navigation**: Bottom bar provides consistent access to controls

## Customization

To modify the tutorial steps, edit the `tutorialSteps` array in `WelcomeTutorial.tsx`:

```typescript
const tutorialSteps: TutorialStep[] = [
  {
    title: 'Step Title',
    description: 'Step description',
    targetElement: 'element-selector', // Optional
    placement: 'bottom', // or 'top', 'left', 'right', 'center'
  },
  // ... more steps
];
```

### Target Element Selectors

Map custom IDs to DOM queries in the `getElementPosition()` function:
```typescript
switch (targetElement) {
  case 'your-element-id':
    element = document.querySelector('your-css-selector') as HTMLElement;
    break;
}
```

## Future Enhancements

Potential improvements:
- Detect if elements are off-screen and auto-scroll to them
- Add progress bar indicator in the bottom navigation
- Support for multi-element highlighting
- Interactive elements (allow clicking through highlighted areas)
- Keyboard navigation (arrow keys, ESC to exit)
- Animation when transitioning between steps
- Persist current step (resume if interrupted)
- Analytics to track completion rates and drop-off points
- Conditional steps based on user's profile (e.g., skip kid selector if only one child)
- Multi-language support for tutorial content
- Video or GIF demonstrations embedded in tooltips

## Testing

To test the tutorial:

1. **First Run**: Clear localStorage (`localStorage.removeItem('firstyears_tutorial_shown')`) and complete profile setup
2. **Manual Trigger**: Click the help button (?) in the header
3. **Skip Functionality**: 
   - Click "X" button in top right
   - Click the dark backdrop
   - Click "Skip Tutorial" would need to be added
4. **Navigation**: Test Next/Back buttons through all steps
5. **Responsive Behavior**: 
   - Resize window during tutorial
   - Scroll page during tutorial
   - Test on different screen sizes
6. **Element Highlighting**: Verify all target elements are correctly highlighted
7. **Tooltip Positioning**: Check tooltips don't overflow viewport boundaries

## Accessibility

The tutorial includes:
- Keyboard navigation support (could be enhanced)
- Semantic HTML structure
- Clear visual indicators with high contrast
- Screen reader friendly content (could be enhanced with ARIA)
- Easy dismissal options (multiple ways to exit)
- Non-blocking design (users can skip immediately)
- Animated border for visual feedback

### Recommended Improvements:
- Add ARIA live regions for screen reader announcements
- Implement full keyboard navigation (Tab, Enter, ESC, Arrow keys)
- Add focus management (return focus to appropriate element on close)
- Provide text alternatives for visual highlights
- Add skip links for screen reader users
- Ensure color contrast meets WCAG AAA standards

