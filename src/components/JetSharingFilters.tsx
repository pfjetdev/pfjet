'use client';

import { useState, useEffect, useMemo } from 'react';
import { DollarSign, X, SlidersHorizontal, PlaneTakeoff, PlaneLanding, UserPlus } from 'lucide-react';
import { AirportCombobox } from '@/components/AirportCombobox';
import { DatePickerSimple } from '@/components/DatePickerSimple';
import { Slider } from '@/components/ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const aircraftTypes = [
  'Turboprop',
  'Very Light',
  'Light',
  'Super Light',
  'Midsize',
  'Super Midsize',
  'Heavy',
  'Ultra Long Range',
];

interface FiltersProps {
  onFilterChange?: (filters: any) => void;
  minPrice?: number;
  maxPrice?: number;
}

export default function JetSharingFilters({ onFilterChange, minPrice = 0, maxPrice = 10000 }: FiltersProps) {
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
  const [selectedAircraft, setSelectedAircraft] = useState<string[]>([]);
  const [passengersOpen, setPassengersOpen] = useState(false);

  // Update price range when min/max props change
  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchFrom) count++;
    if (searchTo) count++;
    if (date) count++;
    if (passengers !== '1') count++;
    if (priceRange[0] > minPrice || priceRange[1] < maxPrice) count++;
    if (selectedAircraft.length > 0) count++;
    return count;
  }, [searchFrom, searchTo, date, passengers, priceRange, selectedAircraft, minPrice, maxPrice]);

  const hasActiveFilters = activeFiltersCount > 0;

  // Notify parent component when filters change
  useEffect(() => {
    if (onFilterChange) {
      const filters: any = {};

      if (searchFrom) filters.from = searchFrom;
      if (searchTo) filters.to = searchTo;
      if (date) filters.dateFrom = date;
      if (priceRange[1] < maxPrice) {
        filters.maxPrice = priceRange[1];
      }
      if (priceRange[0] > minPrice) {
        filters.minPrice = priceRange[0];
      }
      if (passengers) {
        const minSeats = parseInt(passengers);
        if (!isNaN(minSeats)) filters.minSeats = minSeats;
      }
      if (selectedAircraft.length > 0) {
        filters.categories = selectedAircraft;
      }

      onFilterChange(filters);
    }
  }, [searchFrom, searchTo, date, passengers, priceRange, selectedAircraft, onFilterChange, minPrice, maxPrice]);

  const handleReset = () => {
    setSearchFrom('');
    setSearchTo('');
    setDate('');
    setPassengers('1');
    setPriceRange([minPrice, maxPrice]);
    setSelectedAircraft([]);
  };

  const handlePassengersIncrement = () => {
    const current = parseInt(passengers) || 1;
    if (current < 20) {
      setPassengers((current + 1).toString());
    }
  };

  const handlePassengersDecrement = () => {
    const current = parseInt(passengers) || 1;
    if (current > 1) {
      setPassengers((current - 1).toString());
    }
  };

  const toggleAircraft = (type: string) => {
    setSelectedAircraft(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-foreground" />
          <h2
            className="text-lg font-medium text-foreground"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            Filters
          </h2>
          {hasActiveFilters && (
            <Badge variant="default" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            onClick={handleReset}
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            <X className="w-3 h-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Search Section */}
      <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
        <h3
          className="text-sm font-medium text-foreground mb-4"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Search
        </h3>

        {/* From */}
        <div className="relative">
          <div className={cn(
            "h-12 rounded-xl bg-background border transition-all px-2",
            searchFrom
              ? "border-primary/70 ring-2 ring-primary/10"
              : "border-border hover:border-primary/50"
          )}>
            <AirportCombobox
              value={searchFrom}
              onValueChange={setSearchFrom}
              placeholder="From"
              icon={<PlaneTakeoff className="w-4 h-4 text-muted-foreground" />}
              fieldType="from"
              showNearby={true}
            />
          </div>
          {searchFrom && (
            <button
              onClick={() => setSearchFrom('')}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors z-10"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* To */}
        <div className="relative">
          <div className={cn(
            "h-12 rounded-xl bg-background border transition-all px-2",
            searchTo
              ? "border-primary/70 ring-2 ring-primary/10"
              : "border-border hover:border-primary/50"
          )}>
            <AirportCombobox
              value={searchTo}
              onValueChange={setSearchTo}
              placeholder="Going to"
              icon={<PlaneLanding className="w-4 h-4 text-muted-foreground" />}
              fieldType="to"
              showNearby={false}
            />
          </div>
          {searchTo && (
            <button
              onClick={() => setSearchTo('')}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors z-10"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Date */}
        <div className="relative">
          <div className={cn(
            "h-12 rounded-xl bg-background border transition-all px-2",
            date
              ? "border-primary/70 ring-2 ring-primary/10"
              : "border-border hover:border-primary/50"
          )}>
            <DatePickerSimple
              date={date}
              onDateChange={setDate}
            />
          </div>
          {date && (
            <button
              onClick={() => setDate('')}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors z-10"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Passengers */}
        <div className="relative">
          <Popover open={passengersOpen} onOpenChange={setPassengersOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "h-12 rounded-xl bg-background border transition-all cursor-pointer w-full text-left",
                  passengers !== '1'
                    ? "border-primary/70 ring-2 ring-primary/10"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-center space-x-2 h-full px-2">
                  <UserPlus className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                  <span
                    className="text-sm font-medium"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {passengers} {parseInt(passengers) === 1 ? 'passenger' : 'passengers'}
                  </span>
                </div>
              </button>
            </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0" align="start">
            <div className="p-3 border-b">
              <span className="text-sm font-medium">Passengers</span>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Number of passengers</span>
                  <span className="text-xs text-muted-foreground">
                    Select from 1 to 20 passengers
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 mt-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePassengersDecrement}
                  disabled={parseInt(passengers) <= 1}
                  className="h-10 w-10 rounded-full"
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <div className="flex items-center justify-center min-w-[60px]">
                  <span className="text-2xl font-bold">{passengers}</span>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePassengersIncrement}
                  disabled={parseInt(passengers) >= 20}
                  className="h-10 w-10 rounded-full"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Quick selection buttons */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                {[2, 5, 10, 15].map((num) => (
                  <button
                    key={num}
                    onClick={() => setPassengers(num.toString())}
                    className={cn(
                      'py-2 rounded-md text-sm font-medium transition-all hover:bg-accent',
                      parseInt(passengers) === num
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-muted'
                    )}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <Button
                onClick={() => setPassengersOpen(false)}
                className="w-full mt-4"
                size="sm"
              >
                Confirm
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        {passengers !== '1' && (
          <button
            onClick={() => setPassengers('1')}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors z-10"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

        {/* Price Range */}
        <div className={cn(
          "space-y-3 p-4 rounded-xl border transition-all",
          (priceRange[0] > minPrice || priceRange[1] < maxPrice)
            ? "border-primary/70 bg-primary/5"
            : "border-transparent"
        )}>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Price range
            </label>
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
          <div className="flex items-center gap-2">
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
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                  placeholder="Min"
                />
              </div>
              <span className="text-xs text-muted-foreground mt-1 block">Min</span>
            </div>

            <span className="text-muted-foreground">—</span>

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
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                  placeholder="Max"
                />
              </div>
              <span className="text-xs text-muted-foreground mt-1 block">Max</span>
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
      </div>

      {/* Aircraft Section */}
      <div className={cn(
        "bg-card rounded-2xl p-6 border transition-all",
        selectedAircraft.length > 0
          ? "border-primary/70 ring-2 ring-primary/10"
          : "border-border"
      )}>
        <div className="flex items-center justify-between mb-4">
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
            const isSelected = selectedAircraft.includes(type);
            return (
              <button
                key={type}
                onClick={() => toggleAircraft(type)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${isSelected
                    ? 'bg-foreground text-background'
                    : 'bg-background border border-border text-foreground hover:bg-accent'
                  }
                `}
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <span className="flex items-center gap-2">
                  {type}
                  {isSelected && <X className="w-3 h-3" />}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
