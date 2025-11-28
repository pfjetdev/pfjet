'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface FormData {
  from: string
  to: string
  date: string
  time: string
  passengers: string
}

interface FormContextType {
  formData: FormData
  updateFormData: (field: string, value: string) => void
  setFormData: (data: FormData) => void
  resetFormData: () => void
  focusDateTrigger: number
  triggerDateFocus: () => void
  mobileDrawerTrigger: number
  triggerMobileDrawer: () => void
}

const defaultFormData: FormData = {
  from: '',
  to: '',
  date: '',
  time: '',
  passengers: '2'
}

const FormContext = createContext<FormContextType | undefined>(undefined)

export const useFormContext = () => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useFormContext must be used within FormProvider')
  }
  return context
}

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [formData, setFormDataState] = useState<FormData>(defaultFormData)
  const [isInitialized, setIsInitialized] = useState(false)
  const [focusDateTrigger, setFocusDateTrigger] = useState(0)
  const [mobileDrawerTrigger, setMobileDrawerTrigger] = useState(0)

  // Load from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for reload and clear if needed
      const navEntries = performance.getEntriesByType('navigation')
      if (navEntries.length > 0) {
        const navEntry = navEntries[0] as PerformanceNavigationTiming
        if (navEntry.type === 'reload') {
          sessionStorage.removeItem('multiCityFormData')
          setIsInitialized(true)
          return
        }
      }

      // Load saved data
      const savedData = sessionStorage.getItem('multiCityFormData')
      if (savedData) {
        try {
          setFormDataState(JSON.parse(savedData))
        } catch (error) {
          console.error('Error parsing saved form data:', error)
        }
      }
      setIsInitialized(true)
    }
  }, [])

  // Sync to sessionStorage immediately on every change
  const syncToStorage = useCallback((data: FormData) => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('multiCityFormData', JSON.stringify(data))
      } catch (error) {
        console.error('Error saving form data:', error)
      }
    }
  }, [])

  // Update single field
  const updateFormData = useCallback((field: string, value: string) => {
    setFormDataState(prev => {
      const newData = { ...prev, [field]: value }
      syncToStorage(newData) // Sync immediately
      return newData
    })
  }, [syncToStorage])

  // Set entire form data
  const setFormData = useCallback((data: FormData) => {
    setFormDataState(data)
    syncToStorage(data) // Sync immediately
  }, [syncToStorage])

  // Reset form data
  const resetFormData = useCallback(() => {
    setFormDataState(defaultFormData)
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('multiCityFormData')
    }
  }, [])

  // Trigger focus on date field
  const triggerDateFocus = useCallback(() => {
    setFocusDateTrigger(prev => prev + 1)
  }, [])

  // Trigger mobile drawer open
  const triggerMobileDrawer = useCallback(() => {
    setMobileDrawerTrigger(prev => prev + 1)
  }, [])

  return (
    <FormContext.Provider value={{ formData, updateFormData, setFormData, resetFormData, focusDateTrigger, triggerDateFocus, mobileDrawerTrigger, triggerMobileDrawer }}>
      {children}
    </FormContext.Provider>
  )
}