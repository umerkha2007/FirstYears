/**
 * Kid Profiles Service
 * Manages multiple kid profiles and their association with chat histories
 */

import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage';
import { chatHistoryService } from './chatHistoryService';

const STORAGE_KEY = 'firstyears_kid_profiles';
const ACTIVE_KID_KEY = 'firstyears_active_kid_id';

export interface KidProfile {
  id: string;
  name: string;
  dateOfBirth: string;
  gender?: string;
  medicalHistory?: string;
  createdAt: Date;
  updatedAt: Date;
}

class KidProfilesService {
  /**
   * Load all kid profiles from localStorage
   */
  loadAllKidProfiles(): KidProfile[] {
    const profiles = loadFromLocalStorage<KidProfile[]>(STORAGE_KEY);
    if (!profiles) return [];

    // Convert date strings back to Date objects
    return profiles.map((profile) => ({
      ...profile,
      createdAt: new Date(profile.createdAt),
      updatedAt: new Date(profile.updatedAt),
    }));
  }

  /**
   * Save all kid profiles to localStorage
   */
  private saveAllKidProfiles(profiles: KidProfile[]): boolean {
    try {
      saveToLocalStorage(STORAGE_KEY, profiles);
      return true;
    } catch (error) {
      console.error('Failed to save kid profiles:', error);
      return false;
    }
  }

  /**
   * Create a new kid profile
   */
  createKidProfile(name: string, dateOfBirth: string, gender?: string, medicalHistory?: string): KidProfile | null {
    try {
      const newProfile: KidProfile = {
        id: Date.now().toString(),
        name,
        dateOfBirth,
        gender: gender || '',
        medicalHistory: medicalHistory || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const profiles = this.loadAllKidProfiles();
      profiles.push(newProfile);
      
      const success = this.saveAllKidProfiles(profiles);
      
      // If this is the first kid profile, set it as active
      if (success && profiles.length === 1) {
        this.setActiveKidProfile(newProfile.id);
      }

      return success ? newProfile : null;
    } catch (error) {
      console.error('Failed to create kid profile:', error);
      return null;
    }
  }

  /**
   * Get a specific kid profile by ID
   */
  getKidProfileById(id: string): KidProfile | null {
    const profiles = this.loadAllKidProfiles();
    return profiles.find((p) => p.id === id) || null;
  }

  /**
   * Update an existing kid profile
   */
  updateKidProfile(
    id: string,
    updates: Partial<Omit<KidProfile, 'id' | 'createdAt' | 'updatedAt'>>
  ): boolean {
    const profiles = this.loadAllKidProfiles();
    const profileIndex = profiles.findIndex((p) => p.id === id);

    if (profileIndex === -1) return false;

    profiles[profileIndex] = {
      ...profiles[profileIndex],
      ...updates,
      updatedAt: new Date(),
    };

    return this.saveAllKidProfiles(profiles);
  }

  /**
   * Delete a kid profile
   */
  deleteKidProfile(id: string): boolean {
    const profiles = this.loadAllKidProfiles();
    const filteredProfiles = profiles.filter((p) => p.id !== id);

    if (filteredProfiles.length === profiles.length) {
      return false; // Profile not found
    }

    const success = this.saveAllKidProfiles(filteredProfiles);

    if (success) {
      // Delete all chat histories associated with this kid profile
      chatHistoryService.deleteHistoriesByKidProfile(id);

      // If we deleted the active profile, set a new active one
      if (this.getActiveKidProfileId() === id) {
        if (filteredProfiles.length > 0) {
          this.setActiveKidProfile(filteredProfiles[0].id);
        } else {
          this.clearActiveKidProfile();
        }
      }
    }

    return success;
  }

  /**
   * Get the active kid profile ID
   */
  getActiveKidProfileId(): string | null {
    return loadFromLocalStorage<string>(ACTIVE_KID_KEY);
  }

  /**
   * Set the active kid profile
   */
  setActiveKidProfile(id: string): boolean {
    try {
      // Verify the profile exists
      const profile = this.getKidProfileById(id);
      if (!profile) return false;

      saveToLocalStorage(ACTIVE_KID_KEY, id);
      return true;
    } catch (error) {
      console.error('Failed to set active kid profile:', error);
      return false;
    }
  }

  /**
   * Clear the active kid profile
   */
  clearActiveKidProfile(): boolean {
    try {
      localStorage.removeItem(ACTIVE_KID_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear active kid profile:', error);
      return false;
    }
  }

  /**
   * Get the active kid profile
   */
  getActiveKidProfile(): KidProfile | null {
    const activeId = this.getActiveKidProfileId();
    if (!activeId) return null;

    return this.getKidProfileById(activeId);
  }

  /**
   * Get all kid profiles sorted by creation date
   */
  getAllKidProfilesSorted(): KidProfile[] {
    const profiles = this.loadAllKidProfiles();
    return profiles.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  /**
   * Check if there are any kid profiles
   */
  hasKidProfiles(): boolean {
    return this.loadAllKidProfiles().length > 0;
  }

  /**
   * Clear all kid profiles
   */
  clearAllKidProfiles(): boolean {
    try {
      this.clearActiveKidProfile();
      return this.saveAllKidProfiles([]);
    } catch (error) {
      console.error('Failed to clear all kid profiles:', error);
      return false;
    }
  }

  /**
   * Export all kid profiles as JSON
   */
  exportKidProfiles(): string | null {
    const profiles = this.loadAllKidProfiles();
    try {
      return JSON.stringify(profiles, null, 2);
    } catch (error) {
      console.error('Failed to export kid profiles:', error);
      return null;
    }
  }

  /**
   * Import kid profiles from JSON
   */
  importKidProfiles(jsonString: string): boolean {
    try {
      const profiles = JSON.parse(jsonString) as KidProfile[];
      return this.saveAllKidProfiles(profiles);
    } catch (error) {
      console.error('Failed to import kid profiles:', error);
      return false;
    }
  }
}

// Export singleton instance
export const kidProfilesService = new KidProfilesService();

// Export class for testing
export default KidProfilesService;
