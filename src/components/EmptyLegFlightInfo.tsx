'use client';

import Image from 'next/image';
import { Plane } from 'lucide-react';

interface EmptyLegFlightInfoProps {
  aircraftName: string;
  aircraftCategory: string;
  fromCode: string;
  fromCity: string;
  toCode: string;
  toCity: string;
  departureTime: string;
  departureDate: string;
  arrivalTime: string;
  arrivalDate: string;
  duration: string;
  aircraftImage?: string;
}

export default function EmptyLegFlightInfo({
  aircraftName,
  aircraftCategory,
  fromCode,
  fromCity,
  toCode,
  toCity,
  departureTime,
  departureDate,
  arrivalTime,
  arrivalDate,
  duration,
  aircraftImage = '/aircraft/light.png'
}: EmptyLegFlightInfoProps) {
  return (
    <div className="bg-white dark:bg-card rounded-2xl sm:rounded-[24px] overflow-hidden px-4 sm:px-6 py-3 sm:py-3">
      <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
        {/* Left Side - Flight Information */}
        <div className="flex flex-col gap-4 sm:gap-6 w-full md:w-[414px] shrink-0">
          {/* Header - Aircraft Name and Category */}
          <div className="flex items-center justify-between w-full leading-normal">
            <p
              className="font-medium text-[#0f142e] dark:text-foreground text-sm sm:text-[18px] tracking-[0.9px]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {aircraftName}
            </p>
            <p
              className="font-normal text-[#959595] dark:text-muted-foreground text-[11px] sm:text-[13px] tracking-[0.65px]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {aircraftCategory}
            </p>
          </div>

          {/* Flight Route - Large Airport Codes */}
          <div className="flex gap-6 sm:gap-[48px] items-center py-2 sm:py-3 w-full">
            {/* From Code */}
            <div className="flex flex-col leading-normal">
              <p
                className="font-semibold text-[#0f142e] dark:text-foreground text-3xl sm:text-[48px] tracking-[1.8px] sm:tracking-[2.4px] uppercase"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {fromCode}
              </p>
              <p
                className="font-semibold text-[#0f142e] dark:text-foreground text-[10px] sm:text-[12px] tracking-[0.6px] uppercase"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {fromCity}
              </p>
            </div>

            {/* Plane Icon with lines */}
            <div className="flex flex-1 gap-2 sm:gap-[12px] items-center justify-center min-w-0 min-h-0">
              <div className="h-0 w-3 sm:w-[20px] relative shrink-0">
                <div className="absolute inset-0 top-[-1px]">
                  <div className="h-[1px] w-full bg-[#959595] dark:bg-muted-foreground"></div>
                </div>
              </div>
              <Plane className="w-5 h-5 sm:w-6 sm:h-6 text-[#0f142e] dark:text-foreground rotate-90 shrink-0" strokeWidth={2} />
              <div className="h-0 w-3 sm:w-[20px] relative shrink-0">
                <div className="absolute inset-0 top-[-1px]">
                  <div className="h-[1px] w-full bg-[#959595] dark:bg-muted-foreground"></div>
                </div>
              </div>
            </div>

            {/* To Code */}
            <div className="flex flex-col items-end justify-center leading-normal">
              <p
                className="font-semibold text-[#0f142e] dark:text-foreground text-3xl sm:text-[48px] tracking-[1.8px] sm:tracking-[2.4px] uppercase"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {toCode}
              </p>
              <p
                className="font-semibold text-[#0f142e] dark:text-foreground text-[10px] sm:text-[12px] tracking-[0.6px] uppercase"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {toCity}
              </p>
            </div>
          </div>

          {/* Flight Times and Duration */}
          <div className="flex items-center justify-between h-auto sm:h-[60px] relative w-full">
            {/* Departure */}
            <div className="flex flex-col items-start justify-center leading-normal text-[#0f142e] dark:text-foreground">
              <p
                className="font-bold text-sm sm:text-[18px] tracking-[0.9px] uppercase"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {departureTime}
              </p>
              <p
                className="font-medium text-[10px] sm:text-[12px] tracking-[0.6px]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {departureDate}
              </p>
            </div>

            {/* Duration - Centered */}
            <div className="flex flex-col items-center justify-center absolute left-1/2 -translate-x-1/2 top-0 sm:top-[7px] leading-normal text-[#0f142e] dark:text-foreground">
              <p
                className="font-medium text-xs sm:text-[15px] tracking-[0.75px]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {duration}
              </p>
              <p
                className="font-medium text-[10px] sm:text-[12px] tracking-[0.6px] whitespace-nowrap"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Flight Duration
              </p>
            </div>

            {/* Arrival */}
            <div className="flex flex-col items-end justify-center leading-normal text-[#0f142e] dark:text-foreground">
              <p
                className="font-bold text-sm sm:text-[18px] tracking-[0.9px] uppercase"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {arrivalTime}
              </p>
              <p
                className="font-medium text-[10px] sm:text-[12px] tracking-[0.6px]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {arrivalDate}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-[1px] bg-[#959595] dark:bg-border self-stretch"></div>

        {/* Right Side - Aircraft Image */}
        <div className="flex flex-1 flex-col gap-[10px] items-start overflow-hidden py-[21px] self-stretch min-w-0 min-h-0">
          <div className="aspect-[317/162] relative w-full">
            <Image
              src={aircraftImage}
              alt={aircraftName}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
