'use client';

import { Plane, ArrowUpRight } from 'lucide-react';

interface FlightDetailsProps {
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  departureTime: string;
  arrivalTime: string;
  departureDate: string;
  arrivalDate: string;
  duration: string;
  passengers: number;
}

export default function FlightDetails({
  from,
  fromCode,
  to,
  toCode,
  departureTime,
  arrivalTime,
  departureDate,
  arrivalDate,
  duration,
  passengers
}: FlightDetailsProps) {
  return (
    <div className="bg-card rounded-2xl p-8 border border-border">
      {/* Title */}
      <h3
        className="text-lg font-medium text-foreground mb-6"
        style={{ fontFamily: 'Clash Display, sans-serif' }}
      >
        Destination
      </h3>

      {/* Route */}
      <div className="flex items-center justify-between mb-8">
        {/* From */}
        <div>
          <h2
            className="text-5xl font-bold text-foreground mb-1"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            {fromCode}
          </h2>
          <p
            className="text-sm text-muted-foreground uppercase"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {from}
          </p>
        </div>

        {/* Plane Icon with dashed line */}
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="flex-1 border-t-2 border-dashed border-muted-foreground/30" />
          <Plane className="w-6 h-6 text-foreground mx-4 rotate-90" />
          <div className="flex-1 border-t-2 border-dashed border-muted-foreground/30" />
        </div>

        {/* To */}
        <div className="text-right">
          <h2
            className="text-5xl font-bold text-foreground mb-1"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            {toCode}
          </h2>
          <p
            className="text-sm text-muted-foreground uppercase"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {to}
          </p>
        </div>
      </div>

      {/* Times */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p
            className="text-2xl font-bold text-foreground"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {departureTime}
          </p>
          <p
            className="text-sm text-muted-foreground"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {departureDate}
          </p>
        </div>

        <div className="text-center">
          <p
            className="text-lg font-medium text-foreground"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {duration}
          </p>
          <p
            className="text-xs text-muted-foreground"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Flight Duration
          </p>
        </div>

        <div className="text-right">
          <p
            className="text-2xl font-bold text-foreground"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {arrivalTime}
          </p>
          <p
            className="text-sm text-muted-foreground"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {arrivalDate}
          </p>
        </div>
      </div>

      {/* Details Cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* Departure */}
        <div className="bg-background rounded-xl p-4 border border-border relative cursor-pointer hover:bg-accent hover:shadow-md transition-all duration-200 group">
          <div className="absolute top-3 right-3 w-6 h-6 bg-foreground rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <ArrowUpRight className="w-3 h-3 text-background" strokeWidth={3} />
          </div>
          <p
            className="text-xs text-muted-foreground mb-2"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Departure
          </p>
          <p
            className="text-sm font-bold text-foreground uppercase"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {departureDate}
          </p>
        </div>

        {/* Departure time */}
        <div className="bg-background rounded-xl p-4 border border-border relative cursor-pointer hover:bg-accent hover:shadow-md transition-all duration-200 group">
          <div className="absolute top-3 right-3 w-6 h-6 bg-foreground rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <ArrowUpRight className="w-3 h-3 text-background" strokeWidth={3} />
          </div>
          <p
            className="text-xs text-muted-foreground mb-2"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Departure time
          </p>
          <p
            className="text-sm font-bold text-foreground uppercase"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {departureTime}
          </p>
        </div>

        {/* Passengers */}
        <div className="bg-background rounded-xl p-4 border border-border relative cursor-pointer hover:bg-accent hover:shadow-md transition-all duration-200 group">
          <div className="absolute top-3 right-3 w-6 h-6 bg-foreground rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <ArrowUpRight className="w-3 h-3 text-background" strokeWidth={3} />
          </div>
          <p
            className="text-xs text-muted-foreground mb-2"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Passengers
          </p>
          <p
            className="text-sm font-bold text-foreground uppercase"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {passengers} PASSENGERS
          </p>
        </div>
      </div>
    </div>
  );
}
