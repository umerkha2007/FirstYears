/**
 * Profile Storage Service
 * Handles all localStorage operations for user profile data
 */

import { saveToLocalStorage, loadFromLocalStorage, removeFromLocalStorage } from '../utils/localStorage';

// Storage keys
const STORAGE_KEYS = {
  PARENT_PROFILE: 'firstyears_parent_profile',
  CHILD_PROFILE: 'firstyears_child_profile',
  API_CONFIG: 'firstyears_api_config',
  SETUP_COMPLETE: 'firstyears_setup_complete',
} as const;

// Type definitions
export interface ParentProfile {
  name: string;
  medicalHistory?: string;
}

export interface ChildProfile {
  name: string;
  dateOfBirth: string;
  medicalHistory?: string;
}

export interface APIConfig {
  provider: string;
  apiKey: string;
}

export interface ProfileData {
  parentProfile: ParentProfile;
  childProfile: ChildProfile;
  apiConfig: APIConfig;
}

// Service class
class ProfileStorageService {
  /**
   * Save parent profile to localStorage
   */
  saveParentProfile(profile: ParentProfile): boolean {
    try {
      saveToLocalStorage(STORAGE_KEYS.PARENT_PROFILE, profile);
      return true;
    } catch (error) {
      console.error('Failed to save parent profile:', error);
      return false;
    }
  }

  /**
   * Load parent profile from localStorage
   */
  loadParentProfile(): ParentProfile | null {
    return loadFromLocalStorage<ParentProfile>(STORAGE_KEYS.PARENT_PROFILE);
  }

  /**
   * Save child profile to localStorage
   */
  saveChildProfile(profile: ChildProfile): boolean {
    try {
      saveToLocalStorage(STORAGE_KEYS.CHILD_PROFILE, profile);
      return true;
    } catch (error) {
      console.error('Failed to save child profile:', error);
      return false;
    }
  }

  /**
   * Load child profile from localStorage
   */
  loadChildProfile(): ChildProfile | null {
    return loadFromLocalStorage<ChildProfile>(STORAGE_KEYS.CHILD_PROFILE);
  }

  /**
   * Save API configuration to localStorage
   */
  saveAPIConfig(config: APIConfig): boolean {
    try {
      saveToLocalStorage(STORAGE_KEYS.API_CONFIG, config);
      return true;
    } catch (error) {
      console.error('Failed to save API config:', error);
      return false;
    }
  }

  /**
   * Load API configuration from localStorage
   */
  loadAPIConfig(): APIConfig | null {
    return loadFromLocalStorage<APIConfig>(STORAGE_KEYS.API_CONFIG);
  }

  /**
   * Save all profile data at once
   */
  saveAllProfiles(data: ProfileData): boolean {
    try {
      const results = [
        this.saveParentProfile(data.parentProfile),
        this.saveChildProfile(data.childProfile),
        this.saveAPIConfig(data.apiConfig),
      ];

      const allSuccessful = results.every((result) => result === true);
      
      if (allSuccessful) {
        saveToLocalStorage(STORAGE_KEYS.SETUP_COMPLETE, true);
      }

      return allSuccessful;
    } catch (error) {
      console.error('Failed to save all profiles:', error);
      return false;
    }
  }

  /**
   * Load all profile data at once
   */
  loadAllProfiles(): ProfileData | null {
    try {
      const parentProfile = this.loadParentProfile();
      const childProfile = this.loadChildProfile();
      const apiConfig = this.loadAPIConfig();

      if (!parentProfile || !childProfile || !apiConfig) {
        return null;
      }

      return {
        parentProfile,
        childProfile,
        apiConfig,
      };
    } catch (error) {
      console.error('Failed to load all profiles:', error);
      return null;
    }
  }

  /**
   * Check if setup is complete
   */
  isSetupComplete(): boolean {
    const setupComplete = loadFromLocalStorage<boolean>(STORAGE_KEYS.SETUP_COMPLETE);
    const allData = this.loadAllProfiles();
    return setupComplete === true && allData !== null;
  }

  /**
   * Clear all profile data
   */
  clearAllProfiles(): boolean {
    try {
      removeFromLocalStorage(STORAGE_KEYS.PARENT_PROFILE);
      removeFromLocalStorage(STORAGE_KEYS.CHILD_PROFILE);
      removeFromLocalStorage(STORAGE_KEYS.API_CONFIG);
      removeFromLocalStorage(STORAGE_KEYS.SETUP_COMPLETE);
      return true;
    } catch (error) {
      console.error('Failed to clear profiles:', error);
      return false;
    }
  }

  /**
   * Update specific fields in parent profile
   */
  updateParentProfile(updates: Partial<ParentProfile>): boolean {
    const currentProfile = this.loadParentProfile();
    if (!currentProfile) return false;

    const updatedProfile = { ...currentProfile, ...updates };
    return this.saveParentProfile(updatedProfile);
  }

  /**
   * Update specific fields in child profile
   */
  updateChildProfile(updates: Partial<ChildProfile>): boolean {
    const currentProfile = this.loadChildProfile();
    if (!currentProfile) return false;

    const updatedProfile = { ...currentProfile, ...updates };
    return this.saveChildProfile(updatedProfile);
  }

  /**
   * Update API configuration
   */
  updateAPIConfig(updates: Partial<APIConfig>): boolean {
    const currentConfig = this.loadAPIConfig();
    if (!currentConfig) return false;

    const updatedConfig = { ...currentConfig, ...updates };
    return this.saveAPIConfig(updatedConfig);
  }

  /**
   * Export all data as JSON (useful for backup)
   */
  exportData(): string | null {
    const data = this.loadAllProfiles();
    if (!data) return null;

    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      return null;
    }
  }

  /**
   * Import data from JSON (useful for restore)
   */
  importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString) as ProfileData;
      return this.saveAllProfiles(data);
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const profileStorageService = new ProfileStorageService();

// Also export the class for testing purposes
export default ProfileStorageService;
