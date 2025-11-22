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

      {/* Route Section */}
      <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border space-y-4">
        <h3
          className="text-sm font-medium text-foreground"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Route
        </h3>

        {/* From */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground flex items-center gap-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <PlaneTakeoff className="w-3 h-3" />
            From
          </label>
          <AirportCombobox
            value={searchFrom}
            onValueChange={setSearchFrom}
            placeholder="Departure city"
          />
        </div>

        {/* To */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground flex items-center gap-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <PlaneLanding className="w-3 h-3" />
            To
          </label>
          <AirportCombobox
            value={searchTo}
            onValueChange={setSearchTo}
            placeholder="Arrival city"
          />
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Departure Date
          </label>
          <DatePickerSimple
            date={date}
            onDateChange={setDate}
            placeholder="Select date"
          />
        </div>
      </div>

      {/* Passengers Section */}
      <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border space-y-4">
        <h3
          className="text-sm font-medium text-foreground"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Seats Needed
        </h3>

        <Popover open={passengersOpen} onOpenChange={setPassengersOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={passengersOpen}
              className="w-full justify-between"
            >
              <span className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                {passengers} {parseInt(passengers) === 1 ? 'seat' : 'seats'}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-4" align="start">
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePassengersDecrement}
                disabled={parseInt(passengers) <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex-1 text-center">
                <p className="text-2xl font-semibold">{passengers}</p>
                <p className="text-xs text-muted-foreground">
                  {parseInt(passengers) === 1 ? 'seat' : 'seats'}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handlePassengersIncrement}
                disabled={parseInt(passengers) >= 20}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Price Section */}
      <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border space-y-4">
        <div className="flex items-center justify-between">
          <h3
            className="text-sm font-medium text-foreground"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Price per Seat
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <DollarSign className="w-3 h-3" />
            <span>${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        <Slider
          min={minPrice}
          max={maxPrice}
          step={100}
          value={priceRange}
          onValueChange={setPriceRange}
          className="py-4"
        />
      </div>

      {/* Aircraft Type Section */}
      <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border space-y-4">
        <h3
          className="text-sm font-medium text-foreground"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Aircraft Type
        </h3>

        <div className="flex flex-wrap gap-2">
          {aircraftTypes.map((type) => (
            <Badge
              key={type}
              variant={selectedAircraft.includes(type) ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer hover:bg-primary/80 transition-colors',
                selectedAircraft.includes(type) && 'bg-primary text-primary-foreground'
              )}
              onClick={() => toggleAircraft(type)}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>
    </aside>
  );
}
