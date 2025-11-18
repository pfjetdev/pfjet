'use client';

import { useState } from 'react';
import { Plane, Calendar, Users, DollarSign, X, SlidersHorizontal } from 'lucide-react';

const aircraftTypes = [
  'Turboprops',
  'Very Light',
  'Light',
  'Midsize',
  'Super-Mid',
  'Heavy',
  'Long Range Jet',
];

interface FiltersProps {
  onFilterChange?: (filters: any) => void;
}

export default function EmptyLegsFilters({ onFilterChange }: FiltersProps) {
  const [searchFrom, setSearchFrom] = useState('London, LHR');
  const [searchTo, setSearchTo] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState('');
  const [price, setPrice] = useState('');
  const [selectedAircraft, setSelectedAircraft] = useState<string[]>(['Turboprops']);

  const handleReset = () => {
    setSearchFrom('');
    setSearchTo('');
    setDate('');
    setPassengers('');
    setPrice('');
    setSelectedAircraft([]);
  };

  const toggleAircraft = (type: string) => {
    setSelectedAircraft(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const clearSearchFrom = () => {
    setSearchFrom('');
  };

  return (
    <aside className="w-80 shrink-0 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-foreground" />
          <h2
            className="text-lg font-medium text-foreground"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            By location
          </h2>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          <X className="w-4 h-4" />
          Reset all
        </button>
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
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Plane className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchFrom}
            onChange={(e) => setSearchFrom(e.target.value)}
            placeholder="From"
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          />
          {searchFrom && (
            <button
              onClick={clearSearchFrom}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* To */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Plane className="w-4 h-4 rotate-90" />
          </div>
          <input
            type="text"
            value={searchTo}
            onChange={(e) => setSearchTo(e.target.value)}
            placeholder="Going to"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          />
        </div>

        {/* Date */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="Date"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          />
        </div>

        {/* Passengers */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Users className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={passengers}
            onChange={(e) => setPassengers(e.target.value)}
            placeholder="Passengers"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          />
        </div>

        {/* Price */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            <DollarSign className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          />
        </div>
      </div>

      {/* Aircraft Section */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h3
          className="text-sm font-medium text-foreground mb-4"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Aircraft
        </h3>

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
