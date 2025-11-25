'use client'

import { useState, useEffect } from 'react'
import { SlidersHorizontal, X, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer'
import { MobileAirportPickerNew as MobileAirportPicker } from '@/components/MobileAirportPickerNew'
import { MobileDatePicker } from '@/components/MobileDatePicker'
import { MobilePassengerPicker } from '@/components/MobilePassengerPicker'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

const aircraftTypes = [
  'Turboprop',
  'Very Light',
  'Light',
  'Super Light',
  'Midsize',
  'Super Midsize',
  'Heavy',
  'Ultra Long Range',
]

interface JetSharingFiltersMobileProps {
  onFilterChange?: (filters: any) => void
  minPrice?: number
  maxPrice?: number
  activeFiltersCount?: number
}

export default function JetSharingFiltersMobile({
  onFilterChange,
  minPrice = 0,
  maxPrice = 10000,
  activeFiltersCount = 0,
}: JetSharingFiltersMobileProps) {
  const [open, setOpen] = useState(false)
  const [searchFrom, setSearchFrom] = useState('')
  const [searchTo, setSearchTo] = useState('')
  const [date, setDate] = useState('')
  const [passengers, setPassengers] = useState('1')
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice])
  const [selectedAircraft, setSelectedAircraft] = useState<string[]>([])

  // Update price range when min/max props change
  useEffect(() => {
    setPriceRange([minPrice, maxPrice])
  }, [minPrice, maxPrice])

  // Notify parent component when filters change
  useEffect(() => {
    if (onFilterChange) {
      const filters: any = {}

      if (searchFrom) filters.from = searchFrom
      if (searchTo) filters.to = searchTo
      if (date) filters.dateFrom = date
      if (priceRange[1] < maxPrice) {
        filters.maxPrice = priceRange[1]
      }
      if (priceRange[0] > minPrice) {
        filters.minPrice = priceRange[0]
      }
      if (passengers) {
        const minSeats = parseInt(passengers)
        if (!isNaN(minSeats)) filters.minSeats = minSeats
      }
      if (selectedAircraft.length > 0) {
        filters.categories = selectedAircraft
      }

      onFilterChange(filters)
    }
  }, [searchFrom, searchTo, date, passengers, priceRange, selectedAircraft, onFilterChange, minPrice, maxPrice])

  const handleReset = () => {
    setSearchFrom('')
    setSearchTo('')
    setDate('')
    setPassengers('1')
    setPriceRange([minPrice, maxPrice])
    setSelectedAircraft([])
  }

  const toggleAircraft = (type: string) => {
    setSelectedAircraft(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const hasActiveFilters = activeFiltersCount > 0

  return (
    <>
      {/* Filters Button - Mobile Only */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setOpen(true)}
          size="lg"
          className="h-14 px-6 rounded-full shadow-2xl text-white font-medium gap-2"
          style={{ backgroundColor: 'var(--brand-red)', fontFamily: 'Montserrat, sans-serif' }}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 bg-white text-foreground">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters Drawer */}
      <Drawer open={open} onOpenChange={setOpen} repositionInputs={true}>
        <DrawerContent className="pb-safe flex flex-col">
          {/* Header */}
          <DrawerHeader className="border-b px-4 py-4 flex flex-row items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-5 h-5 text-foreground" />
              <DrawerTitle
                className="text-xl font-medium text-foreground"
                style={{ fontFamily: 'Clash Display, sans-serif' }}
              >
                Filters
              </DrawerTitle>
              {activeFiltersCount > 0 && (
                <Badge variant="default">
                  {activeFiltersCount}
                </Badge>
              )}
            </div>
            {hasActiveFilters ? (
              <Button
                onClick={handleReset}
                variant="ghost"
                size="sm"
                className="h-9 text-xs text-muted-foreground hover:text-foreground -mr-2"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Clear all
              </Button>
            ) : (
              <DrawerClose asChild>
                <button className="p-2 rounded-full hover:bg-accent transition-colors -mr-2">
                  <X className="w-5 h-5" />
                </button>
              </DrawerClose>
            )}
          </DrawerHeader>

          {/* Filters Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0" data-vaul-no-drag>
            <div className="space-y-4">
              {/* Search Section */}
              <div className="space-y-3">
                <h3
                  className="text-sm font-medium text-foreground mb-2"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Route
                </h3>

                {/* Airport Pickers Row */}
                <div className="grid grid-cols-2 gap-3">
                  {/* From */}
                  <div className="relative">
                    <div className="h-20 rounded-xl bg-card border border-border hover:border-primary/50 transition-all">
                      <div className="h-full flex flex-col justify-between p-3">
                        <span className="text-xs text-muted-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          From
                        </span>
                        <MobileAirportPicker
                          value={searchFrom}
                          onValueChange={setSearchFrom}
                          placeholder="Any"
                          label="Departure Airport"
                          fieldType="from"
                          showNearby={true}
                        />
                      </div>
                    </div>
                    {searchFrom && (
                      <button
                        onClick={() => setSearchFrom('')}
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors z-10 shadow-md"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* To */}
                  <div className="relative">
                    <div className="h-20 rounded-xl bg-card border border-border hover:border-primary/50 transition-all">
                      <div className="h-full flex flex-col justify-between p-3">
                        <span className="text-xs text-muted-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          Going to
                        </span>
                        <MobileAirportPicker
                          value={searchTo}
                          onValueChange={setSearchTo}
                          placeholder="Any"
                          label="Destination Airport"
                          fieldType="to"
                          showNearby={false}
                        />
                      </div>
                    </div>
                    {searchTo && (
                      <button
                        onClick={() => setSearchTo('')}
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors z-10 shadow-md"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Date and Passengers Row */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Date Picker */}
                  <div className="relative">
                    <MobileDatePicker
                      date={date}
                      onDateChange={setDate}
                    />
                    {date && (
                      <button
                        onClick={() => setDate('')}
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors z-10 shadow-md"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Passengers Picker */}
                  <div className="relative">
                    <MobilePassengerPicker
                      value={passengers}
                      onChange={setPassengers}
                    />
                    {passengers !== '1' && (
                      <button
                        onClick={() => setPassengers('1')}
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors z-10 shadow-md"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3
                    className="text-sm font-medium text-foreground"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Price range
                  </h3>
                  {(priceRange[0] > minPrice || priceRange[1] < maxPrice) && (
                    <button
                      onClick={() => setPriceRange([minPrice, maxPrice])}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Clear
                    </button>
                  )}
                </div>

                {/* Min and Max inputs */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => {
                          const val = Math.max(minPrice, Math.min(parseInt(e.target.value) || minPrice, priceRange[1]))
                          setPriceRange([val, priceRange[1]])
                        }}
                        min={minPrice}
                        max={priceRange[1]}
                        step={100}
                        className="w-full h-12 pl-9 pr-3 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                        placeholder="Min"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground mt-1 block pl-1">Min</span>
                  </div>

                  <span className="text-muted-foreground pt-4">—</span>

                  <div className="flex-1">
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => {
                          const val = Math.min(maxPrice, Math.max(parseInt(e.target.value) || maxPrice, priceRange[0]))
                          setPriceRange([priceRange[0], val])
                        }}
                        min={priceRange[0]}
                        max={maxPrice}
                        step={100}
                        className="w-full h-12 pl-9 pr-3 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                        placeholder="Max"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground mt-1 block pl-1">Max</span>
                  </div>
                </div>

                {/* Slider */}
                <div className="pt-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={minPrice}
                    max={maxPrice}
                    step={100}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Aircraft Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3
                    className="text-sm font-medium text-foreground"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Aircraft {selectedAircraft.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {selectedAircraft.length}
                      </Badge>
                    )}
                  </h3>
                  {selectedAircraft.length > 0 && (
                    <button
                      onClick={() => setSelectedAircraft([])}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {aircraftTypes.map((type) => {
                    const isSelected = selectedAircraft.includes(type)
                    return (
                      <button
                        key={type}
                        onClick={() => toggleAircraft(type)}
                        className={cn(
                          'px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200',
                          isSelected
                            ? 'bg-foreground text-background'
                            : 'bg-card border border-border text-foreground hover:bg-accent'
                        )}
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        <span className="flex items-center gap-2">
                          {type}
                          {isSelected && <X className="w-3 h-3" />}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Apply Button */}
          <div className="border-t px-4 py-4 bg-background safe-area-bottom">
            <Button
              onClick={() => setOpen(false)}
              className="w-full h-14 text-white font-medium rounded-xl"
              style={{ backgroundColor: 'var(--brand-red)', fontFamily: 'Montserrat, sans-serif' }}
            >
              Apply Filters
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
