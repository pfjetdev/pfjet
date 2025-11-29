'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Plane, Users, Gauge, Briefcase, ArrowLeft, ArrowUpRight, ChevronDown, Clock, Minus, Plus, ZoomIn, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { WheelPicker, WheelPickerWrapper } from '@/components/wheel-picker';
import type { WheelPickerOption } from '@/components/wheel-picker';
import CreateOrderForm from '@/components/CreateOrderForm';
import MobileOrderFormDrawer from '@/components/MobileOrderFormDrawer';
import airportsData from '@/data/airports.json';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/useIsMobile';

interface Aircraft {
  id: string;
  name: string;
  category: string;
  image: string;
  gallery?: string[];
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
    code: string;
    icao: string;
    name: string;
    city: string;
    country: string;
    lat?: number;
    lon?: number;
  }>;

  const upperCode = code.toUpperCase();

  // Try to find by IATA code (direct key lookup) or ICAO code
  const directMatch = airports[upperCode];
  if (directMatch) {
    return {
      name: directMatch.name || directMatch.city || code,
      city: directMatch.city || code,
      code: directMatch.code
    };
  }

  // Try to find airport by ICAO code
  const airport = Object.values(airports).find(
    a => a.icao === upperCode
  );

  if (airport) {
    return {
      name: airport.name || airport.city || code,
      city: airport.city || code,
      code: airport.code || airport.icao || code
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
    const airports = airportsData as Record<string, { code: string; icao: string; lat?: number; lon?: number }>;

    // Try to find airports by IATA code (direct key) or ICAO code
    const fromUpper = fromCode.toUpperCase();
    const toUpper = toCode.toUpperCase();

    let fromAirport = airports[fromUpper] || Object.values(airports).find(a => a.icao === fromUpper);
    let toAirport = airports[toUpper] || Object.values(airports).find(a => a.icao === toUpper);

    if (!fromAirport || !toAirport || !fromAirport.lat || !fromAirport.lon || !toAirport.lat || !toAirport.lon) {
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
  const isMobile = useIsMobile();
  const [orderDrawerOpen, setOrderDrawerOpen] = useState(false);

  // Gallery state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const gallery = aircraft.gallery && aircraft.gallery.length > 0
    ? aircraft.gallery
    : [aircraft.image || '/placeholder-jet.jpg'];

  // Sync carousel with lightbox index
  useEffect(() => {
    if (!carouselApi) return;

    carouselApi.scrollTo(lightboxImageIndex);

    const onSelect = () => {
      setLightboxImageIndex(carouselApi.selectedScrollSnap());
    };

    carouselApi.on('select', onSelect);
    return () => {
      carouselApi.off('select', onSelect);
    };
  }, [carouselApi, lightboxImageIndex]);

  // State for editable fields
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(() => {
    const [year, month, day] = initialDate.split('-').map(Number);
    return new Date(year, month - 1, day);
  });
  const [time, setTime] = useState(initialTime);
  const [passengers, setPassengers] = useState(initialPassengers);
  const [passengersPickerOpen, setPassengersPickerOpen] = useState(false);

  // Calendar month state for swipe navigation
  const [calendarMonth, setCalendarMonth] = useState<Date | undefined>(date || new Date());

  // Touch swipe handling for calendar
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      const newMonth = new Date(calendarMonth || new Date());
      newMonth.setMonth(newMonth.getMonth() + 1);
      setCalendarMonth(newMonth);
    }

    if (isRightSwipe) {
      const newMonth = new Date(calendarMonth || new Date());
      const today = new Date();
      newMonth.setMonth(newMonth.getMonth() - 1);
      if (newMonth >= new Date(today.getFullYear(), today.getMonth(), 1)) {
        setCalendarMonth(newMonth);
      }
    }
  };

  // Time picker state
  const parseTime = (timeStr: string) => {
    if (!timeStr) return { hour: 12, minute: '00', period: 'AM' };
    const [h, m] = timeStr.split(':');
    const hour24 = parseInt(h);
    const period = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    return { hour: hour12, minute: m, period };
  };

  const { hour, minute, period } = parseTime(time);
  const [selectedPeriod, setSelectedPeriod] = useState(period);
  const [selectedHour, setSelectedHour] = useState(hour);
  const [selectedMinute, setSelectedMinute] = useState(minute);

  const convertTo24Hour = (hour12: number, period: string) => {
    if (period === 'AM') {
      return hour12 === 12 ? 0 : hour12;
    } else {
      return hour12 === 12 ? 12 : hour12 + 12;
    }
  };

  const handleTimeHourClick = (hour: number) => {
    setSelectedHour(hour);
    const hour24 = convertTo24Hour(hour, selectedPeriod);
    setTime(`${hour24.toString().padStart(2, '0')}:${selectedMinute}`);
  };

  const handleTimeMinuteClick = (minute: string) => {
    setSelectedMinute(minute);
    const hour24 = convertTo24Hour(selectedHour, selectedPeriod);
    setTime(`${hour24.toString().padStart(2, '0')}:${minute}`);
  };

  const handleTimePeriodChange = (newPeriod: string) => {
    setSelectedPeriod(newPeriod);
    const hour24 = convertTo24Hour(selectedHour, newPeriod);
    setTime(`${hour24.toString().padStart(2, '0')}:${selectedMinute}`);
  };

  const formatTime = (time: string) => {
    if (!time) return 'Select time';
    const [h, m] = time.split(':');
    const hour24 = parseInt(h);
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    const displayHour = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    return `${displayHour}:${m} ${ampm}`;
  };

  // Mobile wheel picker - convert minutes for wheel
  const getWheelMinutes = () => {
    if (!time) return 0;
    const m = parseInt(time.split(':')[1]);
    return Math.round(m / 5) * 5;
  };

  const [wheelMinutes, setWheelMinutes] = useState(getWheelMinutes());

  // Generate wheel picker options
  const hourOptions: WheelPickerOption[] = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString().padStart(2, '0'),
  }));

  const minuteOptions: WheelPickerOption[] = Array.from({ length: 12 }, (_, i) => ({
    value: (i * 5).toString(),
    label: (i * 5).toString().padStart(2, '0'),
  }));

  const periodOptions: WheelPickerOption[] = [
    { value: 'AM', label: 'AM' },
    { value: 'PM', label: 'PM' },
  ];

  const handleMobileTimeConfirm = () => {
    const hour24 = convertTo24Hour(selectedHour, selectedPeriod);
    setTime(`${hour24.toString().padStart(2, '0')}:${wheelMinutes.toString().padStart(2, '0')}`);
    setTimePickerOpen(false);
  };

  // Get airport information
  const fromAirport = getAirportInfo(from);
  const toAirport = getAirportInfo(to);

  const flightDuration = calculateFlightDuration(fromAirport.code, toAirport.code);
  const arrivalTime = calculateArrivalTime(time, flightDuration);
  const estimatedPrice = calculateEstimatedPrice(aircraft.category);

  // Format date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Handle date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setDatePickerOpen(false);
  };

  // Handle passenger increment/decrement
  const incrementPassengers = () => {
    if (passengers < maxPassengers) {
      setPassengers(passengers + 1);
    }
  };

  const decrementPassengers = () => {
    if (passengers > 1) {
      setPassengers(passengers - 1);
    }
  };

  // Get max passengers for this aircraft
  const maxPassengers = useMemo(() => extractMaxPassengers(aircraft.passengers), [aircraft.passengers]);

  // Format date - using current date state
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayOfMonth = date?.getDate() || 1;
  const monthNum = (date?.getMonth() || 0) + 1;
  const monthName = monthNames[monthNum - 1];
  const dayOfWeek = date?.toLocaleDateString('en-US', { weekday: 'short' }) || '';

  // Handler for back button
  const handleBack = () => {
    // Format current date to string
    const dateStr = date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      : initialDate;

    // Construct search results URL with current parameters
    const searchParams = new URLSearchParams({
      from: `${fromAirport.city}, ${fromAirport.code}`,
      to: `${toAirport.city}, ${toAirport.code}`,
      date: dateStr,
      time: time,
      passengers: passengers.toString(),
      skipSearch: 'true', // Skip search animation when returning
    });
    router.push(`/search-results?${searchParams.toString()}`);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-24 lg:pb-0">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to results</span>
      </button>

      {/* Aircraft Name Title */}
      <div>
        <h1
          className="text-2xl sm:text-3xl lg:text-5xl font-medium text-foreground tracking-[1.2px] sm:tracking-[2.4px]"
          style={{ fontFamily: 'Clash Display, sans-serif' }}
        >
          {aircraft.name}
        </h1>
        <p
          className="text-base sm:text-lg text-muted-foreground mt-1 sm:mt-2"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {aircraft.category}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Aircraft Gallery and Specifications */}
          <div className="bg-white dark:bg-card rounded-2xl sm:rounded-[24px] overflow-hidden border border-border">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-0">
              {/* Aircraft Gallery - 70% */}
              <div className="lg:col-span-7 p-2 lg:p-3">
                <div className="flex flex-col gap-2">
                  {/* Main Image */}
                  <button
                    onClick={() => {
                      setLightboxImageIndex(0);
                      setIsLightboxOpen(true);
                    }}
                    className="relative w-full aspect-[16/9] overflow-hidden rounded-xl group cursor-pointer"
                  >
                    <Image
                      src={gallery[0]}
                      alt={aircraft.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 1024px) 100vw, 70vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 dark:bg-black/90 rounded-full p-3 shadow-lg">
                        <ZoomIn className="w-5 h-5 text-foreground" />
                      </div>
                    </div>
                  </button>

                  {/* Thumbnail Row */}
                  {gallery.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 h-[60px] lg:h-[80px]">
                      {gallery.slice(1, 5).map((image, index) => {
                        const actualIndex = index + 1;
                        const isLastVisible = actualIndex === 4;
                        const remainingImages = gallery.length - 5;
                        const shouldShowCounter = isLastVisible && remainingImages > 0;

                        return (
                          <button
                            key={actualIndex}
                            onClick={() => {
                              setLightboxImageIndex(actualIndex);
                              setIsLightboxOpen(true);
                            }}
                            className="relative overflow-hidden rounded-lg group cursor-pointer"
                          >
                            <Image
                              src={image}
                              alt={`${aircraft.name} - ${actualIndex + 1}`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="120px"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

                            {shouldShowCounter && (
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                <span className="text-white text-lg font-bold">+{remainingImages}</span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Aircraft Specifications - 30% */}
              <div className="lg:col-span-3 p-4 sm:p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-border/50">
                {/* Mobile: 2 columns, Desktop: 1 column */}
                <div className="grid grid-cols-2 lg:flex lg:flex-col lg:justify-center gap-3 sm:gap-4">
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
          </div>

      {/* Destination Block */}
      <div className="bg-white dark:bg-card rounded-2xl sm:rounded-[24px] overflow-hidden p-4 sm:p-6 lg:p-8 border border-border">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          <h2
            className="text-xl sm:text-2xl font-semibold text-foreground"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            Destination
          </h2>

          {/* Flight Route */}
          <div className="flex items-center justify-between gap-3 sm:gap-6 lg:gap-8">
            {/* From */}
            <div className="flex flex-col">
              <p
                className="font-bold text-foreground text-3xl sm:text-4xl lg:text-5xl tracking-wider uppercase mb-1 sm:mb-2"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {fromAirport.code}
              </p>
              <p
                className="font-semibold text-foreground text-[10px] sm:text-xs tracking-wide uppercase"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {fromAirport.city}
              </p>
            </div>

            {/* Plane Icon with dashed line */}
            <div className="flex-1 flex items-center justify-center gap-2 sm:gap-4 relative">
              <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
              <Plane className="w-5 h-5 sm:w-6 sm:h-6 text-foreground rotate-90" strokeWidth={2} />
              <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
            </div>

            {/* To */}
            <div className="flex flex-col items-end">
              <p
                className="font-bold text-foreground text-3xl sm:text-4xl lg:text-5xl tracking-wider uppercase mb-1 sm:mb-2"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {toAirport.code}
              </p>
              <p
                className="font-semibold text-foreground text-[10px] sm:text-xs tracking-wide uppercase"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {toAirport.city}
              </p>
            </div>
          </div>

          {/* Flight Times */}
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Departure Time */}
            <div className="flex-1">
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                {formatTimeAMPM(time)}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {dayOfWeek}, {dayOfMonth} {monthName}
              </p>
            </div>

            {/* Flight Duration */}
            <div className="text-center flex-shrink-0">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                Duration
              </p>
              <p className="text-sm sm:text-base font-semibold text-foreground">
                {flightDuration}
              </p>
            </div>

            {/* Arrival Time */}
            <div className="text-right flex-1">
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                {formatTimeAMPM(arrivalTime)}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {dayOfWeek}, {dayOfMonth} {monthName}
              </p>
            </div>
          </div>

          {/* Editable Fields - Shadcn Pattern */}
          <div className="flex flex-wrap gap-4 mt-6">
            {/* Date Picker */}
            <div className="flex flex-col gap-3 flex-1 min-w-[140px]">
              <Label htmlFor="date-picker" className="px-1 text-muted-foreground">
                Departure
              </Label>
              {isMobile ? (
                <Drawer open={datePickerOpen} onOpenChange={setDatePickerOpen} shouldScaleBackground={false}>
                  <DrawerTrigger asChild>
                    <Button variant="outline" id="date-picker" className="w-full justify-between font-normal">
                      {formatDate(date)}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="overflow-hidden pb-safe">
                    <DrawerHeader className="text-center pt-6 pb-2">
                      <DrawerTitle className="text-xl font-semibold">Select departure date</DrawerTitle>
                      <DrawerDescription className="text-sm text-muted-foreground mt-1">Choose when you want to depart</DrawerDescription>
                      <div className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-2">
                        <span>←</span>
                        <span>Swipe to change month</span>
                        <span>→</span>
                      </div>
                    </DrawerHeader>
                    <div
                      className="px-4 pb-6 touch-pan-y"
                      style={{ touchAction: 'pan-y' }}
                      onTouchStart={onTouchStart}
                      onTouchMove={onTouchMove}
                      onTouchEnd={onTouchEnd}
                      data-vaul-no-drag
                    >
                      <Calendar
                        mode="single"
                        month={calendarMonth}
                        onMonthChange={setCalendarMonth}
                        selected={date}
                        onSelect={handleDateSelect}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        fromDate={new Date()}
                        fromMonth={new Date()}
                        initialFocus
                        fixedWeeks
                        showOutsideDays={false}
                        className="mx-auto rounded-lg [--cell-size:clamp(0px,calc(100vw/7.5),52px)]"
                      />
                    </div>
                  </DrawerContent>
                </Drawer>
              ) : (
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date-picker"
                    className="w-full justify-between font-normal"
                  >
                    {formatDate(date)}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                  />
                </PopoverContent>
              </Popover>
              )}
            </div>

            {/* Time Picker */}
            <div className="flex flex-col gap-3 flex-1 min-w-[140px]">
              <Label htmlFor="time-picker" className="px-1 text-muted-foreground">
                Departure time
              </Label>
              {isMobile ? (
                <Drawer open={timePickerOpen} onOpenChange={setTimePickerOpen} shouldScaleBackground={false}>
                  <DrawerTrigger asChild>
                    <Button variant="outline" id="time-picker" className="w-full justify-between font-normal">
                      {formatTime(time)}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader className="text-center pb-2">
                      <DrawerTitle className="text-xl font-semibold">Select departure time</DrawerTitle>
                      <DrawerDescription className="text-sm text-muted-foreground mt-1">Choose your preferred departure time</DrawerDescription>
                      <div className="mt-4 pt-4 border-t">
                        <div className="text-5xl font-bold tabular-nums">
                          {selectedHour.toString().padStart(2, '0')}:{wheelMinutes.toString().padStart(2, '0')}<span className="text-3xl ml-2">{selectedPeriod}</span>
                        </div>
                      </div>
                    </DrawerHeader>
                    <div className="px-6 pb-6 space-y-6">
                      {/* Quick Presets */}
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground text-center">
                          Quick select
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { label: 'Morning', time: '09:00' },
                            { label: 'Afternoon', time: '14:00' },
                            { label: 'Evening', time: '18:00' },
                            { label: 'Night', time: '21:00' },
                          ].map((preset) => (
                            <Button
                              key={preset.label}
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const [h, m] = preset.time.split(':');
                                const h24 = parseInt(h);
                                const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
                                const period = h24 >= 12 ? 'PM' : 'AM';
                                setSelectedHour(h12);
                                setWheelMinutes(parseInt(m));
                                setSelectedPeriod(period);
                                setTime(preset.time);
                                setTimePickerOpen(false);
                              }}
                              className="flex flex-col h-auto py-3 transition-all hover:scale-105"
                            >
                              <span className="text-xs text-muted-foreground mb-1">{preset.label}</span>
                              <span className="font-semibold text-sm">{formatTime(preset.time)}</span>
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Wheel Picker */}
                      <div data-vaul-no-drag>
                        <div className="flex items-end justify-center gap-4 py-4">
                          <div className="flex flex-col items-center gap-2 flex-shrink-0">
                            <div className="text-xs font-medium text-muted-foreground px-2 py-1 bg-secondary rounded-md">Hour</div>
                            <WheelPickerWrapper className="!w-20"><WheelPicker value={selectedHour.toString()} options={hourOptions} onValueChange={(value) => setSelectedHour(parseInt(value as string))} infinite /></WheelPickerWrapper>
                          </div>
                          <span className="text-2xl font-bold mb-[90px] flex-shrink-0">:</span>
                          <div className="flex flex-col items-center gap-2 flex-shrink-0">
                            <div className="text-xs font-medium text-muted-foreground px-2 py-1 bg-secondary rounded-md">Minutes</div>
                            <WheelPickerWrapper className="!w-20"><WheelPicker value={wheelMinutes.toString()} options={minuteOptions} onValueChange={(value) => setWheelMinutes(parseInt(value as string))} infinite /></WheelPickerWrapper>
                          </div>
                          <div className="flex flex-col items-center gap-2 flex-shrink-0">
                            <div className="text-xs font-medium text-muted-foreground px-2 py-1 bg-secondary rounded-md">Period</div>
                            <WheelPickerWrapper className="!w-20"><WheelPicker value={selectedPeriod} options={periodOptions} onValueChange={(value) => setSelectedPeriod(value as 'AM' | 'PM')} /></WheelPickerWrapper>
                          </div>
                        </div>
                      </div>

                      {/* Confirm Button */}
                      <Button onClick={handleMobileTimeConfirm} className="w-full h-12 text-base font-semibold" size="lg">
                        Confirm Time - {selectedHour.toString().padStart(2, '0')}:{wheelMinutes.toString().padStart(2, '0')} {selectedPeriod}
                      </Button>
                    </div>
                  </DrawerContent>
                </Drawer>
              ) : (
                <Popover open={timePickerOpen} onOpenChange={setTimePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="time-picker"
                    className="w-full justify-between font-normal"
                  >
                    {formatTime(time)}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="start">
                  <div className="p-3 border-b flex justify-between items-center">
                    <span className="text-sm font-medium">Select Time</span>
                    <div className="flex gap-1 rounded-lg p-1 border">
                      <button
                        onClick={() => handleTimePeriodChange('AM')}
                        className={cn(
                          'px-4 py-1.5 text-xs rounded-md transition-all font-medium',
                          selectedPeriod === 'AM'
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'bg-transparent hover:bg-muted'
                        )}
                      >
                        AM
                      </button>
                      <button
                        onClick={() => handleTimePeriodChange('PM')}
                        className={cn(
                          'px-4 py-1.5 text-xs rounded-md transition-all font-medium',
                          selectedPeriod === 'PM'
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'bg-transparent hover:bg-muted'
                        )}
                      >
                        PM
                      </button>
                    </div>
                  </div>

                  <div className="p-3">
                    {/* Hours Grid */}
                    <div className="mb-4">
                      <span className="text-xs font-medium text-muted-foreground mb-2 block">
                        Hour
                      </span>
                      <div className="grid grid-cols-6 gap-1">
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                          <button
                            key={h}
                            onClick={() => handleTimeHourClick(h)}
                            className={cn(
                              'aspect-square rounded-md text-sm font-medium transition-all hover:bg-accent',
                              selectedHour === h
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                : 'bg-muted'
                            )}
                          >
                            {h}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Minutes Grid */}
                    <div>
                      <span className="text-xs font-medium text-muted-foreground mb-2 block">
                        Minute
                      </span>
                      <div className="grid grid-cols-4 gap-2">
                        {['00', '15', '30', '45'].map((m) => (
                          <button
                            key={m}
                            onClick={() => handleTimeMinuteClick(m)}
                            className={cn(
                              'py-2 rounded-md text-sm font-medium transition-all hover:bg-accent',
                              selectedMinute === m
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                : 'bg-muted'
                            )}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Confirm Button */}
                    <Button
                      onClick={() => setTimePickerOpen(false)}
                      className="w-full mt-4"
                      size="sm"
                    >
                      Confirm
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              )}
            </div>

            {/* Passengers Picker */}
            <div className="flex flex-col gap-3 flex-1 min-w-[140px]">
              <Label htmlFor="passengers-picker" className="px-1 text-muted-foreground">
                Passengers
              </Label>
              {isMobile ? (
                <Drawer open={passengersPickerOpen} onOpenChange={setPassengersPickerOpen} shouldScaleBackground={false}>
                  <DrawerTrigger asChild>
                    <Button variant="outline" id="passengers-picker" className="w-full justify-between font-normal">
                      <span className="flex items-center gap-2"><Users className="h-4 w-4" />{passengers}</span>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader className="text-center pt-6 pb-4">
                      <DrawerTitle className="text-xl font-semibold">Select passengers</DrawerTitle>
                      <DrawerDescription className="text-sm text-muted-foreground mt-1">How many people are flying?</DrawerDescription>
                    </DrawerHeader>
                    <div className="px-6 pb-6 space-y-6">
                      <div className="flex items-center justify-center gap-6 py-8">
                        <Button variant="outline" size="icon" onClick={decrementPassengers} disabled={passengers <= 1} className="h-12 w-12 rounded-full"><Minus className="h-5 w-5" /></Button>
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-5xl font-bold">{passengers}</span>
                          <span className="text-sm text-muted-foreground">{passengers === 1 ? 'passenger' : 'passengers'}</span>
                        </div>
                        <Button variant="outline" size="icon" onClick={incrementPassengers} disabled={passengers >= maxPassengers} className="h-12 w-12 rounded-full"><Plus className="h-5 w-5" /></Button>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 4, Math.min(8, maxPassengers)].map((count) => (
                          <Button key={count} variant={passengers === count ? "default" : "outline"} size="sm" onClick={() => setPassengers(count)} className="h-10">{count}</Button>
                        ))}
                      </div>
                      <Button onClick={() => setPassengersPickerOpen(false)} className="w-full" size="lg">Confirm</Button>
                    </div>
                  </DrawerContent>
                </Drawer>
              ) : (
                <Popover open={passengersPickerOpen} onOpenChange={setPassengersPickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="passengers-picker"
                    className="w-full justify-between font-normal"
                  >
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {passengers}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64" align="start">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Passengers</span>
                      <span className="text-xs text-muted-foreground">Max {maxPassengers}</span>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={decrementPassengers}
                        disabled={passengers <= 1}
                      >
                        -
                      </Button>
                      <span className="text-2xl font-bold w-12 text-center">{passengers}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={incrementPassengers}
                        disabled={passengers >= maxPassengers}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Right Column - Order Form - Desktop Only */}
      <div className="hidden lg:block lg:col-span-1">
        <CreateOrderForm
          jetName={aircraft.name}
          price={`$ ${estimatedPrice.toLocaleString()}`}
        />
      </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40 safe-area-bottom">
        <div className="px-4 py-3 flex items-center justify-between gap-4">
          <div>
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
          <Button
            onClick={() => setOrderDrawerOpen(true)}
            size="lg"
            className="h-12 px-6 text-white font-medium gap-2"
            style={{ backgroundColor: 'var(--brand-red)', fontFamily: 'Montserrat, sans-serif' }}
          >
            <span>Book Now</span>
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Order Drawer */}
      <MobileOrderFormDrawer
        jetName={aircraft.name}
        price={`$ ${estimatedPrice.toLocaleString()}`}
        open={orderDrawerOpen}
        onOpenChange={setOrderDrawerOpen}
      />

      {/* Lightbox Dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-[100vw] md:max-w-[95vw] w-full h-[100vh] md:h-[95vh] p-0 bg-black border-0 rounded-none md:rounded-lg">
          <VisuallyHidden>
            <DialogTitle>{aircraft.name} Gallery</DialogTitle>
          </VisuallyHidden>
          <div className="relative w-full h-full flex flex-col">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-3 md:p-4 bg-gradient-to-b from-black/60 to-transparent">
              <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full">
                <span className="text-white text-xs md:text-sm font-medium">
                  {lightboxImageIndex + 1} / {gallery.length}
                </span>
              </div>

              <DialogClose className="rounded-full bg-white/10 hover:bg-white/20 p-2 transition-all duration-300 backdrop-blur-sm">
                <X className="h-5 w-5 md:h-6 md:w-6 text-white" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </div>

            {/* Carousel */}
            <div className="flex-1 flex items-center justify-center pt-16 pb-24 md:pt-20 md:pb-28">
              <Carousel
                setApi={setCarouselApi}
                opts={{
                  align: "center",
                  loop: true,
                  startIndex: lightboxImageIndex,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {gallery.map((image, index) => (
                    <CarouselItem key={index} className="pl-0">
                      <div className="relative w-full h-[35vh] md:h-[60vh] mx-auto">
                        <Image
                          src={image}
                          alt={`${aircraft.name} - ${index + 1}`}
                          fill
                          className="object-contain"
                          priority={index === lightboxImageIndex}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Navigation Arrows - Desktop only */}
                <CarouselPrevious className="hidden md:flex left-4 h-12 w-12 bg-white/10 hover:bg-white/20 border-0 backdrop-blur-sm text-white" />
                <CarouselNext className="hidden md:flex right-4 h-12 w-12 bg-white/10 hover:bg-white/20 border-0 backdrop-blur-sm text-white" />
              </Carousel>
            </div>

            {/* Thumbnail Navigation */}
            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[95vw] md:max-w-[90vw] overflow-x-auto scrollbar-hide">
              <div className="flex gap-1.5 md:gap-2 p-1.5 md:p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                {gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setLightboxImageIndex(index)}
                    className={`
                      relative flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-md overflow-hidden border-2 transition-all duration-300
                      ${
                        lightboxImageIndex === index
                          ? "border-white scale-105 md:scale-110 shadow-lg"
                          : "border-white/30 hover:border-white/60 opacity-60 hover:opacity-100"
                      }
                    `}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
