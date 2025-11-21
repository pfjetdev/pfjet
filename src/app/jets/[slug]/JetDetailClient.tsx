'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Plane, Users, Gauge, Briefcase, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CreateOrderForm from '@/components/CreateOrderForm';
import { DateTimePicker } from '@/components/DateTimePicker';
import { PassengerPicker } from '@/components/PassengerPicker';
import airportsData from '@/data/airports-full.json';

interface Aircraft {
  id: string;
  name: string;
  category: string;
  image: string;
  passengers: string;
  range: string;
  speed: string;
  baggage: string;
  cabin_width: string;
  cabin_height: string;
  features?: string[];
}

interface JetDetailClientProps {
  aircraft: Aircraft;
  from: string;
  to: string;
  date: string;
  time: string;
  passengers: number;
}

// Helper function to get airport info by code (IATA or ICAO)
function getAirportInfo(code: string): { name: string; city: string; code: string } {
  const airports = airportsData as Record<string, {
    lat: number;
    lon: number;
    iata: string;
    icao: string;
    name: string;
    city: string;
  }>;

  const upperCode = code.toUpperCase();

  // Try to find airport by IATA or ICAO code
  const airport = Object.values(airports).find(
    a => a.iata === upperCode || a.icao === upperCode
  );

  if (airport) {
    return {
      name: airport.name || airport.city || code,
      city: airport.city || code,
      code: airport.iata || airport.icao || code
    };
  }

  // Fallback if not found
  return {
    name: code,
    city: code,
    code: code
  };
}

// Haversine formula to calculate distance between two coordinates in nautical miles
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3440.065; // Earth's radius in nautical miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance);
}

// Helper function to calculate flight duration based on actual distance
function calculateFlightDuration(fromCode: string, toCode: string): string {
  try {
    const airports = airportsData as Record<string, { lat: number; lon: number; iata: string; icao: string }>;

    // Try to find airports by IATA or ICAO code
    let fromAirport = Object.values(airports).find(a => a.iata === fromCode || a.icao === fromCode);
    let toAirport = Object.values(airports).find(a => a.iata === toCode || a.icao === toCode);

    if (!fromAirport || !toAirport) {
      return '1h 30m'; // Default fallback
    }

    // Calculate distance in nautical miles
    const distanceNM = calculateDistance(
      fromAirport.lat,
      fromAirport.lon,
      toAirport.lat,
      toAirport.lon
    );

    // Average cruising speed for private jets: ~450 knots
    const averageSpeed = 450;
    const flightTimeHours = distanceNM / averageSpeed;

    // Add 15 minutes for taxi, takeoff, and landing
    const totalTimeHours = flightTimeHours + 0.25;

    const hours = Math.floor(totalTimeHours);
    const minutes = Math.round((totalTimeHours % 1) * 60);

    if (hours === 0) {
      return `${minutes}m`;
    }
    return `${hours}h ${minutes}m`;
  } catch (error) {
    console.error('Error calculating flight duration:', error);
    return '1h 30m'; // Fallback
  }
}

// Helper function to calculate arrival time
function calculateArrivalTime(departureTime: string, durationStr: string): string {
  const [hours, minutes] = departureTime.split(':').map(Number);
  const durationMatch = durationStr.match(/(\d+)h\s*(\d+)m|(\d+)m/);

  let durationHours = 0;
  let durationMinutes = 0;

  if (durationMatch) {
    if (durationMatch[1]) {
      durationHours = parseInt(durationMatch[1]);
      durationMinutes = parseInt(durationMatch[2] || '0');
    } else if (durationMatch[3]) {
      durationMinutes = parseInt(durationMatch[3]);
    }
  }

  const totalMinutes = hours * 60 + minutes + durationHours * 60 + durationMinutes;
  const arrivalHours = Math.floor(totalMinutes / 60) % 24;
  const arrivalMinutes = totalMinutes % 60;

  return `${arrivalHours.toString().padStart(2, '0')}:${arrivalMinutes.toString().padStart(2, '0')}`;
}

// Helper function to format time to AM/PM
function formatTimeAMPM(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

// Helper function to extract max passengers from string
function extractMaxPassengers(passengersStr: string): number {
  const matches = passengersStr.match(/(\d+)/g);
  if (!matches) return 10;
  const numbers = matches.map(Number);
  return Math.max(...numbers);
}

// Helper function to calculate estimated price based on category
function calculateEstimatedPrice(category: string): number {
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

  const range = priceRanges[category] || { min: 30000, max: 60000 };
  return Math.floor((range.min + range.max) / 2);
}

export default function JetDetailClient({
  aircraft,
  from,
  to,
  date: initialDate,
  time: initialTime,
  passengers: initialPassengers,
}: JetDetailClientProps) {
  const router = useRouter();
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);
  const [passengers, setPassengers] = useState(initialPassengers);

  // Get airport information
  const fromAirport = getAirportInfo(from);
  const toAirport = getAirportInfo(to);

  const flightDuration = calculateFlightDuration(fromAirport.code, toAirport.code);
  const arrivalTime = calculateArrivalTime(time, flightDuration);
  const estimatedPrice = calculateEstimatedPrice(aircraft.category);

  // Get max passengers for this aircraft
  const maxPassengers = useMemo(() => extractMaxPassengers(aircraft.passengers), [aircraft.passengers]);

  // Format date - parse directly from string without Date object to avoid timezone issues
  const dateParts = date.split('-');
  const yearStr = dateParts[0];
  const monthNum = parseInt(dateParts[1]);
  const dayOfMonth = parseInt(dateParts[2]);

  // Get month and day names
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = monthNames[monthNum - 1];

  // Get day of week
  const tempDate = new Date(`${date}T12:00:00`);
  const dayOfWeek = tempDate.toLocaleDateString('en-US', { weekday: 'short' });

  // Handler for passenger change with validation
  const handlePassengerChange = (value: string) => {
    const numValue = parseInt(value) || 1;
    if (numValue <= maxPassengers) {
      setPassengers(numValue);
    }
  };

  // Handler for back button
  const handleBack = () => {
    // Construct search results URL with current parameters
    const searchParams = new URLSearchParams({
      from: `${fromAirport.city}, ${fromAirport.code}`,
      to: `${toAirport.city}, ${toAirport.code}`,
      date,
      time,
      passengers: passengers.toString(),
      skipSearch: 'true', // Skip search animation when returning
    });
    router.push(`/search-results?${searchParams.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to results</span>
      </button>

      {/* Aircraft Name Title */}
      <div>
        <h1
          className="text-5xl font-medium text-foreground tracking-[2.4px]"
          style={{ fontFamily: 'Clash Display, sans-serif' }}
        >
          {aircraft.name}
        </h1>
        <p
          className="text-lg text-muted-foreground mt-2"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {aircraft.category}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Aircraft Image and Specifications */}
          <div className="bg-white dark:bg-card rounded-[24px] overflow-hidden border border-border">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-0">
              {/* Aircraft Photo - 70% */}
              <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto lg:min-h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <Image
                  src={aircraft.image || '/placeholder-jet.jpg'}
                  alt={aircraft.name}
                  fill
                  className="object-contain p-8"
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  priority
                />
              </div>

              {/* Aircraft Specifications - 30% */}
              <div className="lg:col-span-3 flex flex-col justify-center gap-4 p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-border/50">
                <div className="flex items-center gap-3 group hover:translate-x-1 transition-transform">
                  <Users className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground">
                    {aircraft.passengers}
                  </span>
                </div>

                <div className="flex items-center gap-3 group hover:translate-x-1 transition-transform">
                  <Plane className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground">
                    {aircraft.range}
                  </span>
                </div>

                <div className="flex items-center gap-3 group hover:translate-x-1 transition-transform">
                  <Gauge className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground">
                    {aircraft.speed}
                  </span>
                </div>

                <div className="flex items-center gap-3 group hover:translate-x-1 transition-transform">
                  <Briefcase className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground">
                    {aircraft.baggage}
                  </span>
                </div>

                <div className="h-px bg-border/50 my-2"></div>

                <div className="flex items-center gap-3 group hover:translate-x-1 transition-transform">
                  <div className="w-5 h-5 text-primary flex-shrink-0 flex items-center justify-center text-xs font-bold border border-primary rounded">
                    H
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {aircraft.cabin_height}
                  </span>
                </div>

                <div className="flex items-center gap-3 group hover:translate-x-1 transition-transform">
                  <div className="w-5 h-5 text-primary flex-shrink-0 flex items-center justify-center text-xs font-bold border border-primary rounded">
                    W
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {aircraft.cabin_width}
                  </span>
                </div>
              </div>
            </div>
          </div>

      {/* Destination Block */}
      <div className="bg-white dark:bg-card rounded-[24px] overflow-hidden p-8 border border-border">
        <div className="space-y-8">
          <h2
            className="text-2xl font-semibold text-foreground"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            Destination
          </h2>

          {/* Flight Route */}
          <div className="flex items-center justify-between gap-8">
            {/* From */}
            <div className="flex flex-col">
              <p
                className="font-bold text-foreground text-5xl tracking-wider uppercase mb-2"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {fromAirport.code}
              </p>
              <p
                className="font-semibold text-foreground text-xs tracking-wide uppercase"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {fromAirport.city}
              </p>
            </div>

            {/* Plane Icon with dashed line */}
            <div className="flex-1 flex items-center justify-center gap-4 relative">
              <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
              <Plane className="w-6 h-6 text-foreground rotate-90" strokeWidth={2} />
              <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
            </div>

            {/* To */}
            <div className="flex flex-col items-end">
              <p
                className="font-bold text-foreground text-5xl tracking-wider uppercase mb-2"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {toAirport.code}
              </p>
              <p
                className="font-semibold text-foreground text-xs tracking-wide uppercase"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {toAirport.city}
              </p>
            </div>
          </div>

          {/* Flight Times */}
          <div className="flex items-center justify-between">
            {/* Departure Time */}
            <div>
              <p className="text-2xl font-bold text-foreground">
                {formatTimeAMPM(time)}
              </p>
              <p className="text-sm text-muted-foreground">
                {dayOfWeek}, {dayOfMonth} {monthName}
              </p>
            </div>

            {/* Flight Duration */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">
                Flight Duration
              </p>
              <p className="text-base font-semibold text-foreground">
                {flightDuration}
              </p>
            </div>

            {/* Arrival Time */}
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">
                {formatTimeAMPM(arrivalTime)}
              </p>
              <p className="text-sm text-muted-foreground">
                {dayOfWeek}, {dayOfMonth} {monthName}
              </p>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="flex flex-wrap items-center gap-3 mt-6 bg-white dark:bg-card rounded-xl p-4 border border-border">
            {/* Date and Time Picker */}
            <div className="flex-1 min-w-[200px]">
              <DateTimePicker
                date={date}
                time={time}
                onDateChange={setDate}
                onTimeChange={setTime}
              />
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-border hidden sm:block"></div>

            {/* Passengers */}
            <div className="flex-shrink-0">
              <PassengerPicker
                value={passengers.toString()}
                onChange={handlePassengerChange}
                maxPassengers={maxPassengers}
              />
            </div>

            {/* Info text */}
            <div className="w-full sm:w-auto sm:ml-auto">
              <p className="text-xs text-muted-foreground">
                Max {maxPassengers} passengers
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Right Column - Order Form */}
      <div className="lg:col-span-1">
        <CreateOrderForm
          jetName={aircraft.name}
          price={`$ ${estimatedPrice.toLocaleString()}`}
        />
      </div>
      </div>
    </div>
  );
}
