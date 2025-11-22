'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Calendar, Clock, Users, UserPlus, Minus, Plus, ChevronDown } from 'lucide-react';
import { PassengerPicker } from './PassengerPicker';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/lib/utils';

interface EmptyLegHeroBlockProps {
  departureDate: string;
  departureTime: string;
  passengers: number;
  image: string;
  pricePerJet: string;
  isJetSharing?: boolean;
  totalSeats?: number;
  availableSeats?: number;
  selectedPassengers?: number;
  onPassengersChange?: (count: number) => void;
}

export default function EmptyLegHeroBlock({
  departureDate,
  departureTime,
  passengers,
  image,
  pricePerJet,
  isJetSharing = false,
  totalSeats,
  availableSeats,
  selectedPassengers: externalSelectedPassengers,
  onPassengersChange
}: EmptyLegHeroBlockProps) {
  const [internalSelectedPassengers, setInternalSelectedPassengers] = useState('1');
  const [passengersPickerOpen, setPassengersPickerOpen] = useState(false);
  const isMobile = useIsMobile();

  // For Jet Sharing, use external state; for Empty Legs, use internal state
  const selectedPassengers = isJetSharing && externalSelectedPassengers !== undefined
    ? externalSelectedPassengers.toString()
    : internalSelectedPassengers;
  const passengersCount = parseInt(selectedPassengers) || 1;

  const updatePassengers = (newCount: string) => {
    if (isJetSharing && onPassengersChange) {
      onPassengersChange(parseInt(newCount) || 1);
    } else {
      setInternalSelectedPassengers(newCount);
    }
  };

  const handleIncrement = () => {
    if (passengersCount < passengers) {
      updatePassengers((passengersCount + 1).toString());
    }
  };

  const handleDecrement = () => {
    if (passengersCount > 1) {
      updatePassengers((passengersCount - 1).toString());
    }
  };
  return (
    <div className="bg-card rounded-2xl sm:rounded-3xl border border-border overflow-hidden">
      {/* Image Section */}
      <div className="relative h-[280px] sm:h-[360px] lg:h-[420px]">
        <Image
          src={image}
          alt="Destination"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 66vw"
          priority
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />

        {/* Overlayed Cards */}
        <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6 flex flex-wrap gap-2 sm:gap-3 justify-center">
          {/* Departure Date Card - Disabled */}
          <div className="bg-white/95 dark:bg-white backdrop-blur-md rounded-xl sm:rounded-2xl px-3 py-2 sm:px-5 sm:py-3 shadow-lg flex items-center gap-2 sm:gap-3 opacity-60">
            <div className="flex-1">
              <p
                className="text-[10px] sm:text-xs text-gray-500 mb-0.5"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Departure
              </p>
              <p
                className="text-xs sm:text-base font-bold text-gray-900"
                style={{ fontFamily: 'Clash Display, sans-serif' }}
              >
                {departureDate}
              </p>
            </div>
          </div>

          {/* Departure Time Card - Disabled */}
          <div className="bg-white/95 dark:bg-white backdrop-blur-md rounded-xl sm:rounded-2xl px-3 py-2 sm:px-5 sm:py-3 shadow-lg flex items-center gap-2 sm:gap-3 opacity-60">
            <div className="flex-1">
              <p
                className="text-[10px] sm:text-xs text-gray-500 mb-0.5"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Departure time
              </p>
              <p
                className="text-xs sm:text-base font-bold text-gray-900"
                style={{ fontFamily: 'Clash Display, sans-serif' }}
              >
                {departureTime}
              </p>
            </div>
          </div>

          {/* Passengers Card - Editable */}
          <div className="bg-white/95 dark:bg-white backdrop-blur-md rounded-xl sm:rounded-2xl px-3 py-2 sm:px-5 sm:py-3 shadow-lg">
            {isMobile ? (
              <Drawer open={passengersPickerOpen} onOpenChange={setPassengersPickerOpen} shouldScaleBackground={false}>
                <DrawerTrigger asChild>
                  <div className="w-full cursor-pointer">
                    <p
                      className="text-[10px] sm:text-xs text-gray-500 mb-0.5"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Passengers
                    </p>
                    <p
                      className="text-xs sm:text-base font-bold text-gray-900 flex items-center gap-2"
                      style={{ fontFamily: 'Clash Display, sans-serif' }}
                    >
                      <UserPlus className="w-4 h-4 text-gray-600" />
                      <span>{passengersCount}</span>
                    </p>
                  </div>
                </DrawerTrigger>
                <DrawerContent className="pb-safe">
                  <DrawerHeader className="text-center pb-2">
                    <DrawerTitle className="text-xl font-semibold">Select passengers</DrawerTitle>
                    <DrawerDescription className="text-sm text-muted-foreground mt-1">
                      Choose number of passengers (up to {passengers})
                    </DrawerDescription>
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-6xl font-bold tabular-nums">
                        {passengersCount}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        {passengersCount === 1 ? 'Passenger' : 'Passengers'}
                      </div>
                    </div>
                  </DrawerHeader>
                  <div className="px-6 pb-6 space-y-6">
                    {/* Plus/Minus Controls */}
                    <div className="flex items-center justify-center gap-6">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleDecrement}
                        disabled={passengersCount <= 1}
                        className="h-14 w-14 rounded-full transition-all hover:scale-110 disabled:hover:scale-100"
                      >
                        <Minus className="h-6 w-6" />
                      </Button>

                      <div className="flex items-center justify-center min-w-[80px]">
                        <span className="text-4xl font-bold tabular-nums">{passengersCount}</span>
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleIncrement}
                        disabled={passengersCount >= passengers}
                        className="h-14 w-14 rounded-full transition-all hover:scale-110 disabled:hover:scale-100"
                      >
                        <Plus className="h-6 w-6" />
                      </Button>
                    </div>

                    {/* Quick selection buttons */}
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground text-center">
                        Quick select
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {[2, 5, 10, 15].filter(num => num <= passengers).map((num) => (
                          <Button
                            key={num}
                            variant="outline"
                            size="sm"
                            onClick={() => updatePassengers(num.toString())}
                            className={cn(
                              'h-12 text-base font-semibold transition-all hover:scale-105',
                              passengersCount === num
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                : 'bg-muted'
                            )}
                          >
                            {num}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => setPassengersPickerOpen(false)}
                      className="w-full h-12 text-base font-semibold"
                      size="lg"
                    >
                      Confirm - {passengersCount} {passengersCount === 1 ? 'Passenger' : 'Passengers'}
                    </Button>
                  </div>
                </DrawerContent>
              </Drawer>
            ) : (
              <Popover open={passengersPickerOpen} onOpenChange={setPassengersPickerOpen}>
                <PopoverTrigger asChild>
                  <div className="w-full cursor-pointer">
                    <p
                      className="text-[10px] sm:text-xs text-gray-500 mb-0.5"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Passengers
                    </p>
                    <p
                      className="text-xs sm:text-base font-bold text-gray-900 flex items-center gap-2"
                      style={{ fontFamily: 'Clash Display, sans-serif' }}
                    >
                      <UserPlus className="w-4 h-4 text-gray-600" />
                      <span>{passengersCount}</span>
                    </p>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="start">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Number of passengers</span>
                        <span className="text-xs text-muted-foreground">
                          Select from 1 to {passengers} passengers
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 mt-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleDecrement}
                        disabled={passengersCount <= 1}
                        className="h-10 w-10 rounded-full"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>

                      <div className="flex items-center justify-center min-w-[60px]">
                        <span className="text-2xl font-bold">{passengersCount}</span>
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleIncrement}
                        disabled={passengersCount >= passengers}
                        className="h-10 w-10 rounded-full"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Quick selection buttons */}
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {[2, 5, 10, 15].filter(num => num <= passengers).map((num) => (
                        <button
                          key={num}
                          onClick={() => updatePassengers(num.toString())}
                          className={cn(
                            'py-2 rounded-md text-sm font-medium transition-all hover:bg-accent',
                            passengersCount === num
                              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                              : 'bg-muted'
                          )}
                        >
                          {num}
                        </button>
                      ))}
                    </div>

                    <Button
                      onClick={() => setPassengersPickerOpen(false)}
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
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="bg-card px-4 sm:px-8 py-4 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 border-t border-border">
        <div className="flex flex-wrap items-center gap-4 sm:gap-8 w-full sm:w-auto">
          {/* Date */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
            <div>
              <p
                className="text-sm sm:text-base font-semibold text-foreground"
                style={{ fontFamily: 'Clash Display, sans-serif' }}
              >
                {departureDate.split(',')[0]}
              </p>
              <p
                className="text-[10px] sm:text-xs text-muted-foreground"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Date
              </p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
            <div>
              <p
                className="text-sm sm:text-base font-semibold text-foreground"
                style={{ fontFamily: 'Clash Display, sans-serif' }}
              >
                {departureTime}
              </p>
              <p
                className="text-[10px] sm:text-xs text-muted-foreground"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Time
              </p>
            </div>
          </div>

          {/* Passengers */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
            <div>
              <p
                className="text-sm sm:text-base font-semibold text-foreground"
                style={{ fontFamily: 'Clash Display, sans-serif' }}
              >
                {passengersCount} {passengersCount === 1 ? 'Passenger' : 'Passengers'}
              </p>
              <p
                className="text-[10px] sm:text-xs text-muted-foreground"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Selected (up to {passengers})
              </p>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="text-left sm:text-right w-full sm:w-auto">
          <p
            className="text-2xl sm:text-3xl font-bold text-foreground"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            {isJetSharing ? (
              <>$ {pricePerJet}</>
            ) : (
              <>From $ {pricePerJet}</>
            )}
          </p>
          <p
            className="text-xs sm:text-sm text-muted-foreground"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {isJetSharing ? 'Per seat' : 'Per jet'}
          </p>
        </div>
      </div>
    </div>
  );
}
