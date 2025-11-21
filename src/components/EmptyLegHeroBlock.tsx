'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Calendar, Clock, Users } from 'lucide-react';
import { PassengerPicker } from './PassengerPicker';

interface EmptyLegHeroBlockProps {
  departureDate: string;
  departureTime: string;
  passengers: number;
  image: string;
  pricePerJet: string;
}

export default function EmptyLegHeroBlock({
  departureDate,
  departureTime,
  passengers,
  image,
  pricePerJet
}: EmptyLegHeroBlockProps) {
  const [selectedPassengers, setSelectedPassengers] = useState('1');
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
            <PassengerPicker
              value={selectedPassengers}
              onChange={setSelectedPassengers}
              maxPassengers={passengers}
              fullCard={true}
            />
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
                {selectedPassengers} {parseInt(selectedPassengers) === 1 ? 'Passenger' : 'Passengers'}
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
            From $ {pricePerJet}
          </p>
          <p
            className="text-xs sm:text-sm text-muted-foreground"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Per jet
          </p>
        </div>
      </div>
    </div>
  );
}
