import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { kidProfilesService, type KidProfile } from '../services/kidProfilesService';
import { profileStorageService } from '../services/profileStorageService';
import { chatHistoryService } from '../services/chatHistoryService';

interface KidProfileContextType {
  kidProfiles: KidProfile[];
  activeKidProfile: KidProfile | null;
  activeKidProfileId: string | null;
  setActiveKidProfile: (kidId: string) => void;
  refreshKidProfiles: () => void;
  hasKidProfiles: boolean;
}

const KidProfileContext = createContext<KidProfileContextType | undefined>(undefined);

export const KidProfileProvider = ({ children }: { children: ReactNode }) => {
  const [kidProfiles, setKidProfiles] = useState<KidProfile[]>([]);
  const [activeKidProfileId, setActiveKidProfileId] = useState<string | null>(null);
  const [activeKidProfile, setActiveKidProfileState] = useState<KidProfile | null>(null);

  // Migration: Convert old child profile to kid profile
  const migrateOldChildProfile = () => {
    const oldChildProfile = profileStorageService.loadChildProfile();
    const existingProfiles = kidProfilesService.loadAllKidProfiles();

    // Only migrate if old profile exists and no kid profiles exist yet
    if (oldChildProfile && existingProfiles.length === 0) {
      const migratedProfile = kidProfilesService.createKidProfile(
        oldChildProfile.name,
        oldChildProfile.dateOfBirth,
        oldChildProfile.medicalHistory
      );

      if (migratedProfile) {
        // Also migrate chat histories to be associated with this kid profile
        const allHistories = chatHistoryService.loadAllHistories();
        
        // Update all existing histories to have this kid's profile ID
        if (allHistories && allHistories.length > 0) {
          const updatedHistories = allHistories.map((history) => ({
            ...history,
            kidProfileId: history.kidProfileId || migratedProfile.id,
          }));
          
          // Save the updated histories
          localStorage.setItem('firstyears_chat_histories', JSON.stringify(updatedHistories));
        }

        return migratedProfile;
      }
    }
    return null;
  };

  // Load kid profiles and active profile on mount
  const loadKidProfiles = () => {
    // First, attempt migration
    migrateOldChildProfile();

    const profiles = kidProfilesService.getAllKidProfilesSorted();
    setKidProfiles(profiles);

    const activeId = kidProfilesService.getActiveKidProfileId();
    setActiveKidProfileId(activeId);

    if (activeId) {
      const profile = kidProfilesService.getKidProfileById(activeId);
      setActiveKidProfileState(profile);
    } else if (profiles.length > 0) {
      // If no active profile but profiles exist, set the first one as active
      kidProfilesService.setActiveKidProfile(profiles[0].id);
      setActiveKidProfileId(profiles[0].id);
      setActiveKidProfileState(profiles[0]);
    } else {
      setActiveKidProfileState(null);
    }
  };

  useEffect(() => {
    loadKidProfiles();
  }, []);

  const setActiveKidProfile = (kidId: string) => {
    const success = kidProfilesService.setActiveKidProfile(kidId);
    if (success) {
      const profile = kidProfilesService.getKidProfileById(kidId);
      setActiveKidProfileId(kidId);
      setActiveKidProfileState(profile);
    }
  };

  const refreshKidProfiles = () => {
    loadKidProfiles();
  };

  const hasKidProfiles = kidProfiles.length > 0;

  return (
    <KidProfileContext.Provider
      value={{
        kidProfiles,
        activeKidProfile,
        activeKidProfileId,
        setActiveKidProfile,
        refreshKidProfiles,
        hasKidProfiles,
      }}
    >
      {children}
    </KidProfileContext.Provider>
  );
};

export const useKidProfile = () => {
  const context = useContext(KidProfileContext);
  if (context === undefined) {
    throw new Error('useKidProfile must be used within a KidProfileProvider');
  }
  return context;
};
