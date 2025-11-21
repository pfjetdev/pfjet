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
    <div className="bg-card rounded-3xl border border-border overflow-hidden">
      {/* Image Section */}
      <div className="relative h-[420px]">
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
        <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-3 justify-center">
          {/* Departure Date Card - Disabled */}
          <div className="bg-white/95 dark:bg-white backdrop-blur-md rounded-2xl px-5 py-3 shadow-lg flex items-center gap-3 opacity-60">
            <div className="flex-1">
              <p
                className="text-xs text-gray-500 mb-0.5"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Departure
              </p>
              <p
                className="text-base font-bold text-gray-900"
                style={{ fontFamily: 'Clash Display, sans-serif' }}
              >
                {departureDate}
              </p>
            </div>
          </div>

          {/* Departure Time Card - Disabled */}
          <div className="bg-white/95 dark:bg-white backdrop-blur-md rounded-2xl px-5 py-3 shadow-lg flex items-center gap-3 opacity-60">
            <div className="flex-1">
              <p
                className="text-xs text-gray-500 mb-0.5"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Departure time
              </p>
              <p
                className="text-base font-bold text-gray-900"
                style={{ fontFamily: 'Clash Display, sans-serif' }}
              >
                {departureTime}
              </p>
            </div>
          </div>

          {/* Passengers Card - Editable */}
          <div className="bg-white/95 dark:bg-white backdrop-blur-md rounded-2xl px-5 py-3 shadow-lg">
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
      <div className="bg-card px-8 py-6 flex items-center justify-between border-t border-border">
        <div className="flex items-center gap-8">
          {/* Date */}
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-foreground" />
            <div>
              <p
                className="text-base font-semibold text-foreground"
                style={{ fontFamily: 'Clash Display, sans-serif' }}
              >
                {departureDate.split(',')[0]}
              </p>
              <p
                className="text-xs text-muted-foreground"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Date
              </p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-foreground" />
            <div>
              <p
                className="text-base font-semibold text-foreground"
                style={{ fontFamily: 'Clash Display, sans-serif' }}
              >
                {departureTime}
              </p>
              <p
                className="text-xs text-muted-foreground"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Time
              </p>
            </div>
          </div>

          {/* Passengers */}
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-foreground" />
            <div>
              <p
                className="text-base font-semibold text-foreground"
                style={{ fontFamily: 'Clash Display, sans-serif' }}
              >
                {selectedPassengers} {parseInt(selectedPassengers) === 1 ? 'Passenger' : 'Passengers'}
              </p>
              <p
                className="text-xs text-muted-foreground"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Selected (up to {passengers})
              </p>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="text-right">
          <p
            className="text-3xl font-bold text-foreground"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            From $ {pricePerJet}
          </p>
          <p
            className="text-sm text-muted-foreground"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Per jet
          </p>
        </div>
      </div>
    </div>
  );
}
