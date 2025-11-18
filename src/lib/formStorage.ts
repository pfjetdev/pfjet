// Simple utility for managing form data in sessionStorage

const STORAGE_KEY = 'multiCityFormData';

export interface FormData {
  from: string;
  to: string;
  date: string;
  time: string;
  passengers: string;
}

// Save form data to sessionStorage
export const saveFormData = (data: FormData): void => {
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  }
};

// Load form data from sessionStorage
export const loadFormData = (): FormData | null => {
  if (typeof window !== 'undefined') {
    try {
      const data = sessionStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading form data:', error);
      return null;
    }
  }
  return null;
};

// Clear form data on reload
export const clearOnReload = (): void => {
  if (typeof window !== 'undefined') {
    try {
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries.length > 0) {
        const navEntry = navEntries[0] as PerformanceNavigationTiming;
        if (navEntry.type === 'reload') {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error checking navigation:', error);
    }
  }
};
