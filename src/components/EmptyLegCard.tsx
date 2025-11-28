'use client';

import { Calendar, Users, ArrowUpRight, Plane } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { EmptyLeg } from '@/types/emptyLegs';
import { convertTo12Hour } from '@/lib/emptyLegsGenerator';

interface EmptyLegCardProps {
  emptyLeg: EmptyLeg;
}

export default function EmptyLegCard({ emptyLeg }: EmptyLegCardProps) {
  // Parse date as local to avoid timezone issues (YYYY-MM-DD parsed as UTC by default)
  const [year, month, day] = emptyLeg.departureDate.split('-').map(Number)
  const localDate = new Date(year, month - 1, day)
  const formattedDate = localDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    weekday: 'short'
  })

  const departureTime12h = convertTo12Hour(emptyLeg.departureTime)

  return (
    <Link href={`/empty-legs/${emptyLeg.id}`} className="block">
      <div className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 group flex h-[140px] sm:h-[160px] cursor-pointer">
        {/* Image - Left Side */}
        <div className="relative w-[35%] sm:w-[30%] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <Image
            src={emptyLeg.to.image || emptyLeg.aircraft.image}
            alt={`${emptyLeg.to.city}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Content - Right Side */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between relative">
          {/* Arrow Button - Top Right */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-9 sm:h-9 bg-muted text-muted-foreground rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
          </div>

          {/* Top Section: Date, Time and Aircraft */}
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {formattedDate} at {departureTime12h}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Plane className="w-3.5 h-3.5" />
              <span style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {emptyLeg.aircraft.name}
              </span>
            </div>
          </div>

          {/* Middle Section: Route */}
          <h3
            className="text-sm sm:text-base font-semibold text-foreground uppercase leading-tight"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            {emptyLeg.from.city} - {emptyLeg.to.city}
          </h3>

          {/* Bottom Section: Price */}
          <div>
            <p
              className="text-xs sm:text-sm font-normal text-foreground"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              FROM ${emptyLeg.discountedPrice.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
