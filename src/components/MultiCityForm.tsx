'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { PlaneTakeoff, PlaneLanding, Plus, X, ArrowUpDown, Plane } from 'lucide-react'
import { AirportCombobox } from '@/components/AirportCombobox'
import { DateTimePicker } from '@/components/DateTimePicker'
import { PassengerPicker } from '@/components/PassengerPicker'
import { MobileAirportPickerNew as MobileAirportPicker } from '@/components/MobileAirportPickerNew'
import { MobileDatePicker } from '@/components/MobileDatePicker'
import { MobileTimePicker } from '@/components/MobileTimePicker'
import { MobilePassengerPicker } from '@/components/MobilePassengerPicker'
import { useFormContext } from '@/contexts/FormContext'
import { useIsMobile } from '@/hooks/useIsMobile'
import { cn } from '@/lib/utils'

interface RouteData {
  id: string
  from: string
  to: string
  date: string
  time: string
  passengers: string
}

interface MultiCityFormProps {
  initialFormData?: {
    from: string
    to: string
    date: string
    time: string
    passengers: string
  }
}

const MultiCityForm = ({ initialFormData }: MultiCityFormProps) => {
  const { theme } = useTheme()
  const { setFormData } = useFormContext()
  const isMobile = useIsMobile()

  // Initialize with two routes
  // Flight 1: from initialFormData if provided
  // Flight 2: from = initialFormData.to if provided
  const [routes, setRoutes] = useState<RouteData[]>([
    {
      id: '1',
      from: initialFormData?.from || '',
      to: initialFormData?.to || '',
      date: initialFormData?.date || '',
      time: initialFormData?.time || '',
      passengers: initialFormData?.passengers || '2'
    },
    {
      id: '2',
      from: initialFormData?.to || '', // Automatically fill from with previous to
      to: '',
      date: '',
      time: '',
      passengers: initialFormData?.passengers || '2'
    }
  ])

  const handleInputChange = (routeId: string, field: keyof RouteData, value: string) => {
    setRoutes(prev => {
      const updatedRoutes = prev.map(route =>
        route.id === routeId ? { ...route, [field]: value } : route
      )

      // If 'to' field is changed, update 'from' field of the next route
      if (field === 'to') {
        const currentIndex = updatedRoutes.findIndex(r => r.id === routeId)
        if (currentIndex !== -1 && currentIndex < updatedRoutes.length - 1) {
          updatedRoutes[currentIndex + 1].from = value
        }
      }

      return updatedRoutes
    })
  }

  // Save Flight 1 data to global context whenever it changes
  useEffect(() => {
    if (routes.length > 0) {
      const flight1 = routes[0]
      setFormData({
        from: flight1.from,
        to: flight1.to,
        date: flight1.date,
        time: flight1.time,
        passengers: flight1.passengers
      })
    }
  }, [routes, setFormData])

  const addRoute = () => {
    // Check if the last route is completely filled
    const lastRoute = routes[routes.length - 1]
    if (!lastRoute.from || !lastRoute.to || !lastRoute.date) {
      // Don't add new route if current one is incomplete
      return
    }

    // Get the 'to' value from the last route to auto-fill the new route's 'from'
    const newRoute: RouteData = {
      id: Date.now().toString(),
      from: lastRoute.to || '', // Auto-fill from with previous route's to
      to: '',
      date: '',
      time: '',
      passengers: lastRoute.passengers || '2'
    }
    setRoutes(prev => [...prev, newRoute])
  }

  const removeRoute = (routeId: string) => {
    if (routes.length > 2) {
      setRoutes(prev => {
        const routeIndex = prev.findIndex(r => r.id === routeId)

        // If removing a middle route, update the next route's 'from' field
        if (routeIndex > 0 && routeIndex < prev.length - 1) {
          const previousRoute = prev[routeIndex - 1]
          const nextRoute = prev[routeIndex + 1]

          return prev
            .filter(route => route.id !== routeId)
            .map(route =>
              route.id === nextRoute.id
                ? { ...route, from: previousRoute.to }
                : route
            )
        }

        // Otherwise just filter out the route
        return prev.filter(route => route.id !== routeId)
      })
    }
  }

  const handleSwapDestinations = (routeId: string) => {
    setRoutes(prev => {
      return prev.map(route => {
        if (route.id === routeId) {
          return { ...route, from: route.to, to: route.from }
        }
        return route
      })
    })
  }

  const handleSearch = () => {
    console.log('Multi-city search data:', routes)
    alert('Searching for jets with your multi-city criteria...')
  }

  // Calculate if "Add another flight" button should be disabled
  // Using derived state during render (Context7 best practice)
  const lastRoute = routes[routes.length - 1]
  const isAddFlightDisabled = !lastRoute.from || !lastRoute.to || !lastRoute.date

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {/* Routes */}
      {routes.map((route, index) => (
        <div key={route.id} className="relative">
          {/* Route Number Badge */}
          <div className="flex items-center gap-3 mb-2">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              theme === 'dark'
                ? 'bg-gray-700 text-gray-200'
                : 'bg-gray-100 text-gray-700'
            }`}>
              Flight {index + 1}
            </div>

            {/* Remove Button - Show only if more than 2 routes */}
            {routes.length > 2 && (
              <button
                onClick={() => removeRoute(route.id)}
                className={`p-1.5 rounded-full transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-red-900/30 text-red-400'
                    : 'hover:bg-red-50 text-red-600'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Route Form - Mobile Version */}
          {isMobile ? (
            <div className="space-y-3">
              {/* From and To Fields Container */}
              <div className={cn(
                "rounded-xl overflow-hidden relative",
                theme === 'dark' ? 'bg-white' : 'bg-[#0F142E]'
              )}>
                {/* Swap Button - positioned on the right */}
                <button
                  onClick={() => handleSwapDestinations(route.id)}
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
                      value={route.from}
                      onValueChange={(value) => handleInputChange(route.id, 'from', value)}
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
                      value={route.to}
                      onValueChange={(value) => handleInputChange(route.id, 'to', value)}
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
                  date={route.date}
                  onDateChange={(value) => handleInputChange(route.id, 'date', value)}
                  theme={theme}
                />

                {/* Time Picker */}
                <MobileTimePicker
                  time={route.time}
                  onTimeChange={(value) => handleInputChange(route.id, 'time', value)}
                  theme={theme}
                />
              </div>

              {/* Passengers Selector */}
              <MobilePassengerPicker
                value={route.passengers}
                onChange={(value) => handleInputChange(route.id, 'passengers', value)}
                theme={theme}
              />
            </div>
          ) : (
            /* Desktop Version */
            <div className={`backdrop-blur-sm rounded-xl shadow-xl border p-2 h-16 ${
              theme === 'dark'
                ? 'bg-gray-800/95 border-white/30'
                : 'bg-white/95 border-white/50'
            }`}>
              <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-0 h-full">

                {/* From Field */}
                <div className="flex-1 lg:flex-[2] relative h-full">
                  <AirportCombobox
                    value={route.from}
                    onValueChange={(value) => handleInputChange(route.id, 'from', value)}
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
                    disabled={index > 0}
                  />
                </div>

                {/* Divider */}
                <div className={`hidden lg:block w-px h-8 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}></div>

                {/* To Field */}
                <div className="flex-1 lg:flex-[2] relative h-full">
                  <AirportCombobox
                    value={route.to}
                    onValueChange={(value) => handleInputChange(route.id, 'to', value)}
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
                  />
                </div>

                {/* Divider */}
                <div className={`hidden lg:block w-px h-8 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}></div>

                {/* Date and Time Picker */}
                <div className="flex-[2] relative h-full px-2">
                  <DateTimePicker
                    date={route.date}
                    time={route.time}
                    onDateChange={(value) => handleInputChange(route.id, 'date', value)}
                    onTimeChange={(value) => handleInputChange(route.id, 'time', value)}
                  />
                </div>

                {/* Divider */}
                <div className={`hidden lg:block w-px h-8 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}></div>

                {/* Passengers Field */}
                <div className="flex-shrink-0 w-20 relative h-full">
                  <PassengerPicker
                    value={route.passengers}
                    onChange={(value) => handleInputChange(route.id, 'passengers', value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add Route Button */}
      <button
        onClick={addRoute}
        disabled={isAddFlightDisabled}
        className={`w-full py-3 sm:py-3 rounded-xl border-2 border-dashed transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base ${
          isAddFlightDisabled
            ? theme === 'dark'
              ? 'border-gray-700 text-gray-600 cursor-not-allowed opacity-50'
              : 'border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
            : theme === 'dark'
              ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50 text-gray-300'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-600'
        }`}
      >
        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="font-medium">Add another flight</span>
      </button>

      {/* Search Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={handleSearch}
          className="w-full sm:w-auto text-white px-6 sm:px-12 py-4 rounded-xl sm:rounded-lg font-semibold transition-all duration-200 shadow-lg hover:opacity-90 text-base sm:text-lg flex items-center justify-center gap-2"
          style={{ backgroundColor: 'var(--brand-red)' }}
        >
          <span>Search Multi-City Jets</span>
          {isMobile && <Plane className="w-5 h-5 rotate-45" />}
        </button>
      </div>
    </div>
  )
}

export default MultiCityForm
