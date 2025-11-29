'use client'

import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { PlaneTakeoff, PlaneLanding, ArrowUpDown, Calendar, Clock, Users, Plane } from 'lucide-react'
import { toast } from 'sonner'
import { AirportCombobox } from '@/components/AirportCombobox'
import { MobileAirportPickerNew as MobileAirportPicker } from '@/components/MobileAirportPickerNew'
import { PassengerPicker } from '@/components/PassengerPicker'
import { MobileDatePicker } from '@/components/MobileDatePicker'
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
  const { resolvedTheme } = useTheme()
  const router = useRouter()

  const handleSwapDestinations = () => {
    const temp = formData.from
    onFormChange('from', formData.to)
    onFormChange('to', temp)
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
    <div className="w-full space-y-3">
      {/* From and To Fields Container */}
      <div className={cn(
        "rounded-xl overflow-hidden relative",
        resolvedTheme === 'dark' ? 'bg-white' : 'bg-[#0F142E]'
      )}>
        {/* Swap Button - positioned on the right */}
        <button
          onClick={handleSwapDestinations}
          className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all duration-200 shadow-lg z-10",
            resolvedTheme === 'dark'
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
            resolvedTheme === 'dark' ? 'text-gray-600' : 'text-white/60'
          )}>From</label>
          <div className={cn(
            "text-2xl font-semibold",
            resolvedTheme === 'dark'
              ? 'text-gray-900'
              : 'text-white'
          )}>
            <MobileAirportPicker
              value={formData.from}
              onValueChange={(value) => onFormChange('from', value)}
              placeholder="ex. Amsterdam, AMS"
              label="Departure Airport"
              fieldType="from"
              resolvedTheme={resolvedTheme}
            />
          </div>
        </div>

        {/* Divider */}
        <div className={cn(
          "h-px mx-4",
          resolvedTheme === 'dark' ? 'bg-gray-200' : 'bg-white/10'
        )} />

        {/* To Field */}
        <div className="relative px-4 pt-3 pb-4">
          <label className={cn(
            "text-xs mb-1 block",
            resolvedTheme === 'dark' ? 'text-gray-600' : 'text-white/60'
          )}>Going to</label>
          <div className={cn(
            "text-2xl font-semibold",
            resolvedTheme === 'dark'
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
              resolvedTheme={resolvedTheme}
            />
          </div>
        </div>
      </div>

      {/* Date, Time and Passengers - Three Columns */}
      <div className="grid grid-cols-3 gap-2">
        {/* Date Picker */}
        <MobileDatePicker
          date={formData.date}
          onDateChange={(value) => onFormChange('date', value)}
          resolvedTheme={resolvedTheme}
          compact
        />

        {/* Time Picker */}
        <MobileTimePicker
          time={formData.time}
          onTimeChange={(value) => onFormChange('time', value)}
          resolvedTheme={resolvedTheme}
          compact
        />

        {/* Passengers Selector */}
        <MobilePassengerPicker
          value={formData.passengers}
          onChange={(value) => onFormChange('passengers', value)}
          resolvedTheme={resolvedTheme}
          compact
        />
      </div>

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
