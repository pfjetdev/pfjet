'use client';

import { useState } from 'react';
import { MapPin, Calendar, Users, X, SlidersHorizontal } from 'lucide-react';

interface FiltersProps {
  onFilterChange?: (filters: any) => void;
}

export default function JetSharingFilters({ onFilterChange }: FiltersProps) {
  const [destination, setDestination] = useState('');
  const [dateInterval, setDateInterval] = useState('');
  const [passengers, setPassengers] = useState('');

  const handleReset = () => {
    setDestination('');
    setDateInterval('');
    setPassengers('');
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
            Filters
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

        {/* Destination */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Destination"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          />
        </div>

        {/* Date/Interval */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={dateInterval}
            onChange={(e) => setDateInterval(e.target.value)}
            placeholder="Date/Interval"
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
      </div>
    </aside>
  );
}
