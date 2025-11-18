'use client';

import * as React from 'react';
import { Check, MapPin, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { searchAirports, getAllAirports, type Airport } from '@/data/airports';
import { findNearbyAirports, formatDistance } from '@/lib/geoUtils';
import {
  getRecentSearches,
  addRecentSearch,
  type FieldType,
} from '@/lib/recentSearches';

interface AirportComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  showNearby?: boolean;
  fieldType?: FieldType;
  autoFocus?: boolean;
  disabled?: boolean;
}

export function AirportCombobox({
  value,
  onValueChange,
  placeholder = 'Search airport...',
  icon,
  className,
  showNearby = true,
  fieldType,
  autoFocus = false,
  disabled = false,
}: AirportComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<Airport[]>([]);
  const [nearbyAirports, setNearbyAirports] = React.useState<Airport[]>([]);
  const [recentSearches, setRecentSearches] = React.useState<Airport[]>([]);
  const [loadingNearby, setLoadingNearby] = React.useState(false);

  // Auto-open when autoFocus changes
  React.useEffect(() => {
    if (autoFocus) {
      setOpen(true);
    }
  }, [autoFocus]);

  // Load nearby airports and recent searches when dropdown opens
  React.useEffect(() => {
    if (open && !searchQuery) {
      // Load recent searches with fieldType
      setRecentSearches(getRecentSearches(fieldType));

      // Load nearby airports only if showNearby is true
      if (showNearby && nearbyAirports.length === 0) {
        setLoadingNearby(true);
        findNearbyAirports(getAllAirports(), 5)
          .then((nearby) => setNearbyAirports(nearby))
          .finally(() => setLoadingNearby(false));
      }
    }
  }, [open, searchQuery, nearbyAirports.length, showNearby, fieldType]);

  // Update search results when query changes
  React.useEffect(() => {
    if (searchQuery) {
      const results = searchAirports(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSelect = (airport: Airport) => {
    const displayValue = airport.city
      ? `${airport.city}, ${airport.code}`
      : airport.code;
    onValueChange(displayValue);
    addRecentSearch(airport, fieldType);
    setOpen(false);
    setSearchQuery('');
  };

  // If disabled, render a static display without popover functionality
  if (disabled) {
    return (
      <div
        className={cn(
          'flex items-center space-x-2 h-full px-2 cursor-not-allowed opacity-60',
          className
        )}
      >
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          readOnly
          disabled
          className="w-full border-0 bg-transparent text-sm font-medium focus:outline-none cursor-not-allowed"
        />
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            'flex items-center space-x-2 h-full px-2 cursor-pointer',
            className
          )}
          onClick={() => setOpen(true)}
        >
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            readOnly
            className="w-full border-0 bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[450px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>
              {searchQuery.length < 1
                ? 'Start typing to search airports...'
                : 'No airport found.'}
            </CommandEmpty>

            {/* Nearby Locations - Show when not searching and showNearby is true */}
            {!searchQuery && showNearby && (
              <>
                <CommandGroup heading="Nearby Locations">
                  {loadingNearby ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
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
                        className="flex items-center justify-between py-3"
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <div className="flex flex-col flex-1">
                            <div className="font-medium text-sm">
                              {airport.city
                                ? `${airport.city}, ${airport.code}`
                                : airport.code}
                            </div>
                            <div className="text-xs text-muted-foreground">
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
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      Enable location access to see nearby airports
                    </div>
                  )}
                </CommandGroup>
                {recentSearches.length > 0 && <CommandSeparator />}
              </>
            )}

            {/* Recent Searches - Show when not searching */}
            {!searchQuery && recentSearches.length > 0 && (
              <>
                <CommandGroup heading="Recent Searches">
                  {recentSearches.map((airport, index) => (
                    <CommandItem
                      key={`recent-${airport.code}-${index}`}
                      value={airport.code}
                      onSelect={() => handleSelect(airport)}
                      className="flex items-center justify-between py-3"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div className="flex flex-col flex-1">
                          <div className="font-medium text-sm">
                            {airport.city
                              ? `${airport.city}, ${airport.code}`
                              : airport.code}
                          </div>
                          <div className="text-xs text-muted-foreground">
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

            {/* Search Results - Show when searching */}
            {searchQuery && searchResults.length > 0 && (
              <CommandGroup heading="Search Results">
                {searchResults.map((airport, index) => (
                  <CommandItem
                    key={`search-${airport.code}-${index}`}
                    value={airport.code}
                    onSelect={() => handleSelect(airport)}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex flex-col flex-1">
                      <div className="font-medium text-sm">
                        {airport.city
                          ? `${airport.city}, ${airport.code}`
                          : airport.code}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {airport.name}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground ml-2">
                      {airport.country}
                    </div>
                    <Check
                      className={cn(
                        'ml-2 h-4 w-4',
                        value ===
                          (airport.city
                            ? `${airport.city}, ${airport.code}`
                            : airport.code)
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
