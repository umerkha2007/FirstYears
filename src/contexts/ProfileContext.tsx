import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { profileStorageService } from '../services/profileStorageService';
import type { ParentProfile, ChildProfile } from '../services/profileStorageService';

export type { ParentProfile, ChildProfile };

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
  refreshProfileData: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [parentProfile, setParentProfileState] = useState<ParentProfile | null>(null);
  const [childProfile, setChildProfileState] = useState<ChildProfile | null>(null);
  const [apiKey, setApiKeyState] = useState('');
  const [provider, setProviderState] = useState('');

  // Load from localStorage using profileStorageService
  const loadProfileData = () => {
    const allData = profileStorageService.loadAllProfiles();
    if (allData) {
      setParentProfileState(allData.parentProfile);
      setChildProfileState(allData.childProfile);
      setApiKeyState(allData.apiConfig.apiKey);
      setProviderState(allData.apiConfig.provider);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const setParentProfile = (profile: ParentProfile) => {
    setParentProfileState(profile);
    profileStorageService.saveParentProfile(profile);
  };

  const setChildProfile = (profile: ChildProfile) => {
    setChildProfileState(profile);
    profileStorageService.saveChildProfile(profile);
  };

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    const currentConfig = profileStorageService.loadAPIConfig();
    profileStorageService.saveAPIConfig({ 
      provider: currentConfig?.provider || provider, 
      apiKey: key 
    });
  };

  const setProvider = (prov: string) => {
    setProviderState(prov);
    const currentConfig = profileStorageService.loadAPIConfig();
    profileStorageService.saveAPIConfig({ 
      provider: prov, 
      apiKey: currentConfig?.apiKey || apiKey 
    });
  };

  const isSetupComplete = () => {
    return profileStorageService.isSetupComplete();
  };

  const refreshProfileData = () => {
    loadProfileData();
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
        refreshProfileData,
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
