'use client'

import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { PlaneTakeoff, PlaneLanding, ArrowUpDown, Calendar, Clock, Users, Plane } from 'lucide-react'
import { AirportCombobox } from '@/components/AirportCombobox'
import { MobileAirportPickerNew as MobileAirportPicker } from '@/components/MobileAirportPickerNew'
import { PassengerPicker } from '@/components/PassengerPicker'
import { MobileDatePickerNew as MobileDatePicker } from '@/components/MobileDatePickerNew'
import { MobileTimePicker } from '@/components/MobileTimePicker'
import { MobilePassengerPicker } from '@/components/MobilePassengerPicker'
import { cn } from '@/lib/utils'

interface MobileSearchFormProps {
  formData: {
    from: string
    to: string
    date: string
    time: string
    passengers: string
  }
  onFormChange: (field: string, value: string) => void
}

const MobileSearchForm = ({ formData, onFormChange }: MobileSearchFormProps) => {
  const { theme } = useTheme()
  const router = useRouter()

  const handleSwapDestinations = () => {
    const temp = formData.from
    onFormChange('from', formData.to)
    onFormChange('to', temp)
  }

  const handleSearch = () => {
    // Validate required fields
    if (!formData.from || !formData.to) {
      alert('Please select both departure and destination airports')
      return
    }

    // Navigate to search results with form data
    const params = new URLSearchParams({
      from: formData.from,
      to: formData.to,
      date: formData.date || new Date().toISOString().split('T')[0],
      time: formData.time || '10:00',
      passengers: formData.passengers || '1'
    })

    router.push(`/search-results?${params.toString()}`)
  }

  return (
    <div className="w-full space-y-3">
      {/* From and To Fields Container */}
      <div className={cn(
        "rounded-xl overflow-hidden relative",
        theme === 'dark' ? 'bg-white' : 'bg-[#0F142E]'
      )}>
        {/* Swap Button - positioned on the right */}
        <button
          onClick={handleSwapDestinations}
          className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all duration-200 shadow-lg z-10",
            theme === 'dark'
              ? 'bg-gray-900 hover:bg-gray-800 text-white'
              : 'bg-white hover:bg-white/90 text-gray-900'
          )}
          aria-label="Swap destinations"
        >
          <ArrowUpDown className="w-4 h-4" />
        </button>

        {/* From Field */}
        <div className="relative px-4 pt-4 pb-3">
          <label className={cn(
            "text-xs mb-1 block",
            theme === 'dark' ? 'text-gray-600' : 'text-white/60'
          )}>From</label>
          <div className={cn(
            "text-2xl font-semibold",
            theme === 'dark'
              ? 'text-gray-900'
              : 'text-white'
          )}>
            <MobileAirportPicker
              value={formData.from}
              onValueChange={(value) => onFormChange('from', value)}
              placeholder="ex. Amsterdam, AMS"
              label="Departure Airport"
              fieldType="from"
              theme={theme}
            />
          </div>
        </div>

        {/* Divider */}
        <div className={cn(
          "h-px mx-4",
          theme === 'dark' ? 'bg-gray-200' : 'bg-white/10'
        )} />

        {/* To Field */}
        <div className="relative px-4 pt-3 pb-4">
          <label className={cn(
            "text-xs mb-1 block",
            theme === 'dark' ? 'text-gray-600' : 'text-white/60'
          )}>Going to</label>
          <div className={cn(
            "text-2xl font-semibold",
            theme === 'dark'
              ? 'text-gray-900'
              : 'text-white'
          )}>
            <MobileAirportPicker
              value={formData.to}
              onValueChange={(value) => onFormChange('to', value)}
              placeholder="ex. London, LHR"
              label="Destination Airport"
              showNearby={false}
              fieldType="to"
              theme={theme}
            />
          </div>
        </div>
      </div>

      {/* Date and Time Pickers - Two Columns */}
      <div className="grid grid-cols-2 gap-3">
        {/* Date Picker */}
        <MobileDatePicker
          date={formData.date}
          onDateChange={(value) => onFormChange('date', value)}
          theme={theme}
        />

        {/* Time Picker */}
        <MobileTimePicker
          time={formData.time}
          onTimeChange={(value) => onFormChange('time', value)}
          theme={theme}
        />
      </div>

      {/* Passengers Selector */}
      <MobilePassengerPicker
        value={formData.passengers}
        onChange={(value) => onFormChange('passengers', value)}
        theme={theme}
      />

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="w-full text-white px-6 py-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:opacity-90"
        style={{ backgroundColor: 'var(--brand-red)' }}
      >
        <span>Search a Jet</span>
        <Plane className="w-5 h-5 rotate-45" />
      </button>
    </div>
  )
}

export default MobileSearchForm
