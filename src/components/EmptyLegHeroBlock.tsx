'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Calendar, Clock, Users, Minus, Plus, MoveUpRight } from 'lucide-react';
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
import { cn } from '@/lib/utils';

interface EmptyLegHeroBlockProps {
  departureDate: string;
  departureTime: string;
  passengers: number;
  image: string;
  pricePerJet: string;
  pricePerSeatNum?: number; // Numeric price for calculations
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
  pricePerSeatNum,
  isJetSharing = false,
  totalSeats,
  availableSeats,
  selectedPassengers: externalSelectedPassengers,
  onPassengersChange
}: EmptyLegHeroBlockProps) {
  const [internalSelectedPassengers, setInternalSelectedPassengers] = useState('1');
  const [desktopPickerOpen, setDesktopPickerOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Use external state if provided, otherwise use internal state
  const selectedPassengers = externalSelectedPassengers !== undefined
    ? externalSelectedPassengers.toString()
    : internalSelectedPassengers;
  const passengersCount = parseInt(selectedPassengers) || 1;

  const updatePassengers = (newCount: string) => {
    if (onPassengersChange) {
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

  // Calculate total price for jet sharing
  // Use numeric prop if available, otherwise parse from string
  const priceNum = pricePerSeatNum ?? (parseInt(pricePerJet.replace(/,/g, '')) || 0);
  const totalPrice = isJetSharing ? priceNum * passengersCount : priceNum;

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
      </div>

      {/* Bottom Info Bar - Desktop only */}
      <div className="hidden sm:flex bg-card px-4 sm:px-8 py-4 sm:py-6 flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 border-t border-border">
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

          {/* Passengers - Editable */}
          <Popover open={desktopPickerOpen} onOpenChange={setDesktopPickerOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:opacity-80 transition-opacity text-left"
              >
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
                    Click to change (up to {passengers})
                  </p>
                </div>
              </button>
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
                  {[1, 2, 4, 8].filter(num => num <= passengers).map((num) => (
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
                  onClick={() => setDesktopPickerOpen(false)}
                  className="w-full mt-4"
                  size="sm"
                >
                  Confirm
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Price */}
        <div className="text-left sm:text-right w-full sm:w-auto">
          <p
            className="text-2xl sm:text-3xl font-bold text-foreground"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            {isJetSharing ? (
              <>$ {totalPrice.toLocaleString()}</>
            ) : (
              <>From $ {pricePerJet}</>
            )}
          </p>
          <p
            className="text-xs sm:text-sm text-muted-foreground"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {isJetSharing ? `${passengersCount} seat${passengersCount > 1 ? 's' : ''} × $${priceNum.toLocaleString()}` : 'Per jet'}
          </p>
        </div>
      </div>

      {/* Mobile Bottom Section */}
      <div className="sm:hidden border-t border-border">
        {/* Date & Time - Two columns, non-editable */}
        <div className="grid grid-cols-2 divide-x divide-border">
          {/* Date */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-muted">
                <Calendar className="w-4 h-4 text-foreground" />
              </div>
              <div>
                <p
                  className="text-sm font-semibold text-foreground"
                  style={{ fontFamily: 'Clash Display, sans-serif' }}
                >
                  {departureDate.split(',')[0]}
                </p>
                <p
                  className="text-[10px] text-muted-foreground"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Date
                </p>
              </div>
            </div>
          </div>

          {/* Time */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-muted">
                <Clock className="w-4 h-4 text-foreground" />
              </div>
              <div>
                <p
                  className="text-sm font-semibold text-foreground"
                  style={{ fontFamily: 'Clash Display, sans-serif' }}
                >
                  {departureTime}
                </p>
                <p
                  className="text-[10px] text-muted-foreground"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Time
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Passengers - Editable */}
        <Drawer open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen} shouldScaleBackground={false}>
          <DrawerTrigger asChild>
            <div className="bg-card px-4 py-3 border-t border-border cursor-pointer active:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-muted">
                    <Users className="w-4 h-4 text-foreground" />
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold text-foreground"
                      style={{ fontFamily: 'Clash Display, sans-serif' }}
                    >
                      {passengersCount} {passengersCount === 1 ? 'Passenger' : 'Passengers'}
                    </p>
                    <p
                      className="text-[10px] text-muted-foreground"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Tap to change (up to {passengers} available)
                    </p>
                  </div>
                </div>
                <div className="p-1.5 rounded-full bg-muted">
                  <MoveUpRight className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              </div>
            </div>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="text-center pt-6 pb-4">
              <DrawerTitle className="text-xl font-semibold">Select passengers</DrawerTitle>
              <DrawerDescription className="text-sm text-muted-foreground mt-1">
                How many seats do you need?
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-6 pb-6 space-y-6">
              {/* Passenger Counter */}
              <div className="flex items-center justify-center gap-6 py-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDecrement}
                  disabled={passengersCount <= 1}
                  className="h-12 w-12 rounded-full"
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-5xl font-bold">
                    {passengersCount}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {passengersCount === 1 ? 'passenger' : 'passengers'}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleIncrement}
                  disabled={passengersCount >= passengers}
                  className="h-12 w-12 rounded-full"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>

              {/* Quick Selection Presets */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 4, 8].filter(num => num <= passengers).map((count) => (
                  <Button
                    key={count}
                    variant={passengersCount === count ? "default" : "outline"}
                    size="sm"
                    onClick={() => updatePassengers(count.toString())}
                    className="h-10"
                  >
                    {count}
                  </Button>
                ))}
              </div>

              {/* Confirm Button */}
              <Button
                onClick={() => setMobileDrawerOpen(false)}
                className="w-full"
                size="lg"
              >
                Confirm
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
