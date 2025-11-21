'use client';

import { useState, useMemo, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Plane, Calendar as CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { JetCardSkeleton } from '@/components/JetCardSkeleton';
import { SearchProgressIndicator } from '@/components/SearchProgressIndicator';

interface Aircraft {
  id: string;
  name: string;
  slug: string;
  category: string;
  category_slug: string;
  image: string;
  passengers: string;
  range: string;
  speed: string;
  baggage: string;
  price_per_hour: number;
  estimatedPrice?: number;
}

interface SearchResultsClientProps {
  initialAircraft: Aircraft[];
  from: string;
  to: string;
  initialDate: string;
  initialTime: string;
  requiredDistance: number;
  passengers: number;
  seed: number;
  skipSearch?: boolean;
}

const aircraftCategories = [
  'Turboprop',
  'Very Light',
  'Light',
  'Midsize',
  'Super-mid',
  'Heavy',
  'Ultra Long',
  'VIP Airliner',
];

// Helper function to create a numeric seed from string
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Seeded random generator
function createSeededRandom(seed: number) {
  let value = seed;
  return function() {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

// Helper function to extract city name from "City, CODE" format
function extractCityName(cityString: string): string {
  const commaIndex = cityString.indexOf(',');
  if (commaIndex > 0) {
    return cityString.substring(0, commaIndex).trim();
  }
  return cityString.trim();
}

// Helper function to extract airport code from "City, CODE" format
function extractAirportCode(cityString: string): string {
  const commaIndex = cityString.indexOf(',');
  if (commaIndex > 0) {
    return cityString.substring(commaIndex + 1).trim();
  }
  // If no comma, assume it's already a code
  return cityString.trim();
}

export default function SearchResultsClient({
  initialAircraft,
  from,
  to,
  initialDate,
  initialTime,
  requiredDistance,
  passengers,
  seed,
  skipSearch = false,
}: SearchResultsClientProps) {
  // Parse date string correctly to avoid timezone issues
  const parseInitialDate = (dateStr: string): Date => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const [selectedDate, setSelectedDate] = useState<Date>(parseInitialDate(initialDate));
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(!skipSearch);

  // Simulate 5 second search (skip if returning from detail page)
  useEffect(() => {
    if (skipSearch) {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      setIsSearching(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [skipSearch]);

  // Generate prices for all aircraft
  const aircraftWithPrices = useMemo(() => {
    return initialAircraft.map(jet => {
      const priceRange = getPriceRangeByCategory(jet.category);
      const jetSeed = hashString(`${seed}-${jet.id}`);
      const random = createSeededRandom(jetSeed);
      const estimatedPrice = Math.floor(random() * (priceRange.max - priceRange.min + 1)) + priceRange.min;

      return {
        ...jet,
        estimatedPrice
      };
    });
  }, [initialAircraft, seed]);

  // Filter and sort aircraft by selected categories and price
  const filteredAircraft = useMemo(() => {
    let filtered = selectedCategories.length === 0
      ? aircraftWithPrices
      : aircraftWithPrices.filter(jet => selectedCategories.includes(jet.category));

    // Sort by price (cheapest first)
    return filtered.sort((a, b) => a.estimatedPrice - b.estimatedPrice);
  }, [aircraftWithPrices, selectedCategories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Extract clean city names for display
  const fromCity = extractCityName(from);
  const toCity = extractCityName(to);

  // Helper function to format date without timezone conversion
  const formatDateLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1
          className="text-4xl font-medium text-foreground"
          style={{ fontFamily: 'Clash Display, sans-serif' }}
        >
          {fromCity} → {toCity}
        </h1>
        <p className="text-muted-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {requiredDistance} nm · {passengers} {passengers === 1 ? 'passenger' : 'passengers'} · {isSearching ? '...' : `${filteredAircraft.length} available jets`}
        </p>
      </div>

      {/* Search Progress Indicator */}
      <SearchProgressIndicator isSearching={isSearching} />

      {/* Main Layout */}
      <div className="flex gap-6">
        {/* Left: Jet Cards Grid (3 columns) */}
        <div className="flex-1">
          {isSearching ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, index) => (
                <JetCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredAircraft.length === 0 ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center space-y-4">
                <Plane className="w-16 h-16 text-muted-foreground mx-auto" />
                <div className="space-y-2">
                  <h3
                    className="text-2xl font-bold text-foreground"
                    style={{ fontFamily: 'Clash Display, sans-serif' }}
                  >
                    No Jets Found
                  </h3>
                  <p className="text-muted-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Try adjusting your filters or search criteria
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAircraft.map((jet) => (
                <JetResultCard
                  key={jet.id}
                  jet={jet}
                  requiredDistance={requiredDistance}
                  from={from}
                  to={to}
                  date={formatDateLocal(selectedDate)}
                  time={initialTime}
                  passengers={passengers}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Filters Sidebar */}
        <aside className="w-80 shrink-0 space-y-6">
          {/* Calendar */}
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3
                    className="text-sm font-semibold text-foreground"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Departure Date
                  </h3>
                  <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  // Fix timezone issue by using local midnight
                  const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                  setSelectedDate(localDate);
                }
              }}
              disabled={(date) => {
                // Disable past dates
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
              showOutsideDays={false}
              fromDate={new Date()}
              className="rounded-xl [--cell-size:2.25rem] mx-auto"
            />
          </div>

          {/* Aircraft Type Filters */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            {isSearching ? (
              // Skeleton for Aircraft Type Filter
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-5 bg-muted animate-pulse rounded w-28"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-10"></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-8 bg-muted animate-pulse rounded-full"
                      style={{ width: `${80 + Math.random() * 40}px` }}
                    ></div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className="text-sm font-medium text-foreground"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Aircraft Type
                    {selectedCategories.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {selectedCategories.length}
                      </Badge>
                    )}
                  </h3>
                  {selectedCategories.length > 0 && (
                    <button
                      onClick={() => setSelectedCategories([])}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {aircraftCategories.map((category) => {
                    const isSelected = selectedCategories.includes(category);
                    const count = initialAircraft.filter(j => j.category === category).length;

                    return (
                      <button
                        key={category}
                        onClick={() => toggleCategory(category)}
                        disabled={count === 0}
                        className={cn(
                          'px-3 py-2 rounded-full text-xs font-medium transition-all duration-200',
                          isSelected
                            ? 'bg-foreground text-background'
                            : count > 0
                            ? 'bg-background border border-border text-foreground hover:bg-accent'
                            : 'bg-muted text-muted-foreground cursor-not-allowed',
                        )}
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {category} ({count})
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

// Helper function to get price range based on aircraft category
function getPriceRangeByCategory(category: string): { min: number; max: number } {
  const priceRanges: Record<string, { min: number; max: number }> = {
    'Turboprop': { min: 8000, max: 20000 },
    'Very Light': { min: 15000, max: 30000 },
    'Light': { min: 25000, max: 40000 },
    'Midsize': { min: 45000, max: 70000 },
    'Super-mid': { min: 60000, max: 85000 },
    'Heavy': { min: 75000, max: 100000 },
    'Ultra Long': { min: 90000, max: 120000 },
    'VIP Airliner': { min: 100000, max: 150000 },
  };

  return priceRanges[category] || { min: 30000, max: 60000 };
}

// Jet Result Card Component
function JetResultCard({
  jet,
  requiredDistance,
  from,
  to,
  date,
  time,
  passengers
}: {
  jet: Aircraft;
  requiredDistance: number;
  from: string;
  to: string;
  date: string;
  time: string;
  passengers: number;
}) {
  // Use the pre-calculated price from the jet object
  const estimatedPrice = jet.estimatedPrice || 0;

  // Extract clean airport codes
  const fromCode = extractAirportCode(from);
  const toCode = extractAirportCode(to);

  // Construct URL with search parameters using slug and clean codes
  const searchParams = new URLSearchParams({
    from: fromCode,
    to: toCode,
    date,
    time,
    passengers: passengers.toString(),
  });

  return (
    <Link href={`/jets/${jet.slug}?${searchParams.toString()}`}>
      <div className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 group">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <Image
            src={jet.image || '/placeholder-jet.jpg'}
            alt={jet.name}
            fill
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Name and Category */}
          <div className="space-y-2">
            <h3
              className="text-lg font-bold text-foreground group-hover:text-primary transition-colors"
              style={{ fontFamily: 'Clash Display, sans-serif' }}
            >
              {jet.name}
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {jet.category}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {jet.passengers} · {jet.range}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-end justify-between pt-2 border-t border-border">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Estimated Total
              </p>
              <p
                className="text-2xl font-bold text-foreground"
                style={{ fontFamily: 'Clash Display, sans-serif' }}
              >
                ${estimatedPrice.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
