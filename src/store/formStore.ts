import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface FormData {
  from: string
  to: string
  date: string
  time: string
  passengers: string
}

interface FormStore {
  formData: FormData
  setFormData: (data: Partial<FormData>) => void
  resetFormData: () => void
}

const defaultFormData: FormData = {
  from: '',
  to: '',
  date: '',
  time: '',
  passengers: '2'
}

export const useFormStore = create<FormStore>()(
  persist(
    (set) => ({
      formData: defaultFormData,

      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data }
        })),

      resetFormData: () =>
        set({ formData: defaultFormData }),
    }),
    {
      name: 'flight-form-storage',
      storage: createJSONStorage(() => {
        // Return dummy storage on server-side
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          }
        }
        return sessionStorage
      }),
      // Skip automatic hydration to prevent SSR mismatch
      skipHydration: true,
    }
  )
)

// Separate function to check and clear on reload
export const checkAndClearOnReload = () => {
  if (typeof window === 'undefined') return false

  try {
    const navEntries = performance.getEntriesByType('navigation')
    if (navEntries.length > 0) {
      const navEntry = navEntries[0] as PerformanceNavigationTiming
      if (navEntry.type === 'reload') {
        // Clear sessionStorage on reload
        sessionStorage.removeItem('flight-form-storage')
        return true
      }
    }
  } catch (error) {
    console.error('Error checking navigation type:', error)
  }

  return false
}
