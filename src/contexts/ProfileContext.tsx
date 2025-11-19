import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface ParentProfile {
  name: string;
}

export interface ChildProfile {
  name: string;
  dateOfBirth: string;
  medicalHistory: string;
}

interface ProfileContextType {
  parentProfile: ParentProfile | null;
  childProfile: ChildProfile | null;
  apiKey: string;
  provider: string;
  setParentProfile: (profile: ParentProfile) => void;
  setChildProfile: (profile: ChildProfile) => void;
  setApiKey: (key: string) => void;
  setProvider: (provider: string) => void;
  isSetupComplete: () => boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [parentProfile, setParentProfileState] = useState<ParentProfile | null>(null);
  const [childProfile, setChildProfileState] = useState<ChildProfile | null>(null);
  const [apiKey, setApiKeyState] = useState('');
  const [provider, setProviderState] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const savedParent = localStorage.getItem('parentProfile');
    const savedChild = localStorage.getItem('childProfile');
    const savedApiKey = localStorage.getItem('apiKey');
    const savedProvider = localStorage.getItem('provider');

    if (savedParent) setParentProfileState(JSON.parse(savedParent));
    if (savedChild) setChildProfileState(JSON.parse(savedChild));
    if (savedApiKey) setApiKeyState(savedApiKey);
    if (savedProvider) setProviderState(savedProvider);
  }, []);

  const setParentProfile = (profile: ParentProfile) => {
    setParentProfileState(profile);
    localStorage.setItem('parentProfile', JSON.stringify(profile));
  };

  const setChildProfile = (profile: ChildProfile) => {
    setChildProfileState(profile);
    localStorage.setItem('childProfile', JSON.stringify(profile));
  };

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    localStorage.setItem('apiKey', key);
  };

  const setProvider = (prov: string) => {
    setProviderState(prov);
    localStorage.setItem('provider', prov);
  };

  const isSetupComplete = () => {
    return !!(parentProfile && childProfile && apiKey && provider);
  };

  return (
    <ProfileContext.Provider
      value={{
        parentProfile,
        childProfile,
        apiKey,
        provider,
        setParentProfile,
        setChildProfile,
        setApiKey,
        setProvider,
        isSetupComplete,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
