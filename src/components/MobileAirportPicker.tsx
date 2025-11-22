'use client'

import * as React from 'react'
import { Check, MapPin, Clock, Loader2, X, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { searchAirports, getAllAirports, type Airport } from '@/data/airports'
import { findNearbyAirports, formatDistance } from '@/lib/geoUtils'
import {
  getRecentSearches,
  addRecentSearch,
  type FieldType,
} from '@/lib/recentSearches'

interface MobileAirportPickerProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  label?: string
  showNearby?: boolean
  fieldType?: FieldType
  theme?: string
}

export function MobileAirportPicker({
  value,
  onValueChange,
  placeholder = 'Search airport...',
  label = 'Select Airport',
  showNearby = true,
  fieldType,
  theme,
}: MobileAirportPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [searchResults, setSearchResults] = React.useState<Airport[]>([])
  const [nearbyAirports, setNearbyAirports] = React.useState<Airport[]>([])
  const [recentSearches, setRecentSearches] = React.useState<Airport[]>([])
  const [loadingNearby, setLoadingNearby] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Load nearby airports and recent searches when drawer opens
  React.useEffect(() => {
    if (open && !searchQuery) {
      setRecentSearches(getRecentSearches(fieldType))

      if (showNearby && nearbyAirports.length === 0) {
        setLoadingNearby(true)
        findNearbyAirports(getAllAirports(), 5)
          .then((nearby) => setNearbyAirports(nearby))
          .finally(() => setLoadingNearby(false))
      }

      // Focus input after drawer opens
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [open, searchQuery, nearbyAirports.length, showNearby, fieldType])

  // Update search results when query changes
  React.useEffect(() => {
    if (searchQuery) {
      const results = searchAirports(searchQuery)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const handleSelect = (airport: Airport) => {
    const displayValue = airport.city
      ? `${airport.city}, ${airport.code}`
      : airport.code
    onValueChange(displayValue)
    addRecentSearch(airport, fieldType)
    setOpen(false)
    setSearchQuery('')
  }

  const displayValue = value || placeholder

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="w-full text-left"
      >
        <div className={cn(
          "font-semibold",
          !value && "opacity-40"
        )}>
          {displayValue}
        </div>
      </button>

      {/* Drawer */}
      <Drawer
        open={open}
        onOpenChange={setOpen}
        modal={true}
        shouldScaleBackground={false}
        repositionInputs={true}
      >
        <DrawerContent className="pb-safe flex flex-col">
          {/* Pull Indicator - Handled by drawer component */}

          {/* Header */}
          <DrawerHeader className="border-b px-4 py-3 flex flex-row items-center justify-between shrink-0">
            <DrawerTitle className="text-lg font-semibold">{label}</DrawerTitle>
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-full hover:bg-accent transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </DrawerHeader>

          {/* Search Input */}
          <div className="px-4 py-3 border-b bg-background shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-10 pr-4 text-base bg-muted rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Search Content */}
          <div className="flex-1 overflow-y-auto min-h-0" data-vaul-no-drag>
            <Command shouldFilter={false} className="h-auto bg-transparent">
              {/* Results */}
              <CommandList className="max-h-none">
                <CommandEmpty className="py-12 text-center">
                  <div className="text-muted-foreground">
                    {searchQuery.length < 1
                      ? 'Start typing to search airports...'
                      : 'No airport found.'}
                  </div>
                </CommandEmpty>

                {/* Nearby Locations */}
                {!searchQuery && showNearby && (
                  <>
                    <CommandGroup heading="Nearby Locations">
                      {loadingNearby ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                          <span className="ml-2 text-sm text-muted-foreground">
                            Finding nearby airports...
                          </span>
                        </div>
                      ) : nearbyAirports.length > 0 ? (
                        nearbyAirports.map((airport: any, index) => (
                          <CommandItem
                            key={`nearby-${airport.code}-${index}`}
                            value={airport.code}
                            onSelect={() => handleSelect(airport)}
                            className="flex items-center justify-between py-4 px-4"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className="p-2 rounded-full bg-primary/10">
                                <MapPin className="w-4 h-4 text-primary" />
                              </div>
                              <div className="flex flex-col flex-1">
                                <div className="font-medium">
                                  {airport.city
                                    ? `${airport.city}, ${airport.code}`
                                    : airport.code}
                                </div>
                                <div className="text-sm text-muted-foreground line-clamp-1">
                                  {airport.name}
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {airport.distance ? formatDistance(airport.distance) : airport.country}
                            </div>
                          </CommandItem>
                        ))
                      ) : (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                          Enable location access to see nearby airports
                        </div>
                      )}
                    </CommandGroup>
                    {recentSearches.length > 0 && <CommandSeparator />}
                  </>
                )}

                {/* Recent Searches */}
                {!searchQuery && recentSearches.length > 0 && (
                  <>
                    <CommandGroup heading="Recent Searches">
                      {recentSearches.map((airport, index) => (
                        <CommandItem
                          key={`recent-${airport.code}-${index}`}
                          value={airport.code}
                          onSelect={() => handleSelect(airport)}
                          className="flex items-center justify-between py-4 px-4"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="p-2 rounded-full bg-muted">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="flex flex-col flex-1">
                              <div className="font-medium">
                                {airport.city
                                  ? `${airport.city}, ${airport.code}`
                                  : airport.code}
                              </div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {airport.name}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {airport.country}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </>
                )}

                {/* Search Results */}
                {searchQuery && searchResults.length > 0 && (
                  <CommandGroup heading="Search Results">
                    {searchResults.map((airport, index) => (
                      <CommandItem
                        key={`search-${airport.code}-${index}`}
                        value={airport.code}
                        onSelect={() => handleSelect(airport)}
                        className="flex items-center justify-between py-4 px-4"
                      >
                        <div className="flex flex-col flex-1">
                          <div className="font-medium">
                            {airport.city
                              ? `${airport.city}, ${airport.code}`
                              : airport.code}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {airport.name}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-muted-foreground">
                            {airport.country}
                          </div>
                          <Check
                            className={cn(
                              'h-4 w-4 text-primary',
                              value ===
                                (airport.city
                                  ? `${airport.city}, ${airport.code}`
                                  : airport.code)
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
