'use client'

import { useRef, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { PlaneTakeoff, PlaneLanding, Plane } from 'lucide-react'
import { toast } from 'sonner'
import { AirportCombobox } from '@/components/AirportCombobox'
import { DateTimePicker } from '@/components/DateTimePicker'
import { PassengerPicker } from '@/components/PassengerPicker'

interface SearchFormProps {
  formData: {
    from: string
    to: string
    date: string
    time: string
    passengers: string
  }
  onFormChange: (field: string, value: string) => void
  focusTrigger?: number
  fieldToFocus?: 'from' | 'to' | 'date' | null
  isSticky?: boolean
}

const SearchForm = ({ formData, onFormChange, focusTrigger, fieldToFocus, isSticky = false }: SearchFormProps) => {
  const { resolvedTheme: theme } = useTheme()
  const router = useRouter()
  const [shouldAutoFocusFrom, setShouldAutoFocusFrom] = useState(false)
  const [shouldAutoFocusTo, setShouldAutoFocusTo] = useState(false)
  const [shouldAutoFocusDate, setShouldAutoFocusDate] = useState(false)

  // Auto-focus when focusTrigger changes
  useEffect(() => {
    if (focusTrigger && focusTrigger > 0) {
      if (fieldToFocus === 'from') {
        setShouldAutoFocusFrom(true)
        const timer = setTimeout(() => setShouldAutoFocusFrom(false), 100)
        return () => clearTimeout(timer)
      } else if (fieldToFocus === 'to') {
        setShouldAutoFocusTo(true)
        const timer = setTimeout(() => setShouldAutoFocusTo(false), 100)
        return () => clearTimeout(timer)
      } else if (fieldToFocus === 'date') {
        setShouldAutoFocusDate(true)
        const timer = setTimeout(() => setShouldAutoFocusDate(false), 100)
        return () => clearTimeout(timer)
      }
    }
  }, [focusTrigger, fieldToFocus])

  const handleInputChange = (field: string, value: string) => {
    onFormChange(field, value)
  }

  const handleSearch = () => {
    // Validate required fields
    if (!formData.from || !formData.to) {
      toast.error('Missing airports', {
        description: 'Please select both departure and destination airports.',
      })
      return
    }

    if (!formData.date) {
      toast.error('Missing departure date', {
        description: 'Please select a departure date to continue.',
      })
      return
    }

    if (!formData.time) {
      toast.error('Missing departure time', {
        description: 'Please select a departure time to continue.',
      })
      return
    }

    // Navigate to search results with form data
    const params = new URLSearchParams({
      from: formData.from,
      to: formData.to,
      date: formData.date,
      time: formData.time,
      passengers: formData.passengers || '1'
    })

    router.push(`/search-results?${params.toString()}`)
  }

  return (
    <div className={`w-full mx-auto ${isSticky ? 'mt-0' : 'mt-6'}`}>
      <div className={`backdrop-blur-sm rounded-xl shadow-xl border p-2 h-16 ${
        theme === 'dark'
          ? 'bg-gray-800/95 border-white/30'
          : 'bg-white/95 border-white/50'
      }`}>
        <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-0 h-full">
          
          {/* From Field - Large */}
          <div className="flex-1 lg:flex-[2] relative h-full px-2">
            <AirportCombobox
              value={formData.from}
              onValueChange={(value) => handleInputChange('from', value)}
              placeholder="From"
              icon={
                <PlaneTakeoff
                  className={`w-4 h-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}
                />
              }
              className={theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}
              fieldType="from"
              autoFocus={shouldAutoFocusFrom}
            />
          </div>

          {/* Divider */}
          <div className={`hidden lg:block w-px h-8 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}></div>

          {/* Going To Field - Large */}
          <div className="flex-1 lg:flex-[2] relative h-full px-2">
            <AirportCombobox
              value={formData.to}
              onValueChange={(value) => handleInputChange('to', value)}
              placeholder="To"
              icon={
                <PlaneLanding
                  className={`w-4 h-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}
                />
              }
              className={theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}
              showNearby={false}
              fieldType="to"
              autoFocus={shouldAutoFocusTo}
            />
          </div>

          {/* Divider */}
          <div className={`hidden lg:block w-px h-8 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}></div>

          {/* Date and Time Picker */}
          <div className="flex-[2] relative h-full px-2">
            <DateTimePicker
              date={formData.date}
              time={formData.time}
              onDateChange={(value) => handleInputChange('date', value)}
              onTimeChange={(value) => handleInputChange('time', value)}
              autoFocus={shouldAutoFocusDate}
            />
          </div>

          {/* Divider */}
          <div className={`hidden lg:block w-px h-8 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}></div>

          {/* Passengers Field */}
          <div className="flex-shrink-0 w-20 relative h-full px-2">
            <PassengerPicker
              value={formData.passengers}
              onChange={(value) => handleInputChange('passengers', value)}
            />
          </div>

          {/* Search Button */}
          <div className="flex-shrink-0 h-full flex items-center ml-4">
            <button
              onClick={handleSearch}
              className="text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 shadow-lg h-12 w-40 hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: 'var(--brand-red)' }}
            >
              <span className="text-sm">Search a Jet</span>
              <Plane className="w-4 h-4 rotate-45" />
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default SearchForm