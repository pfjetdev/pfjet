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
  const formattedDate = new Date(emptyLeg.departureDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    weekday: 'short'
  })

  const departureTime12h = convertTo12Hour(emptyLeg.departureTime)

  return (
    <Link href={`/empty-legs/${emptyLeg.id}`} className="block">
      <div className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 group flex h-[200px] cursor-pointer">
        {/* Image - Left Side - Show destination city image if available, otherwise aircraft image */}
        <div className="relative w-[35%] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <Image
            src={emptyLeg.to.image || emptyLeg.aircraft.image}
            alt={`${emptyLeg.to.city}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Content - Right Side */}
        <div className="flex-1 p-4 flex flex-col justify-between">
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
            className="text-base font-bold text-foreground uppercase leading-tight"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            {emptyLeg.from.city} - {emptyLeg.to.city}
          </h3>

          {/* Bottom Section: Price and Arrow Button */}
          <div className="flex items-end justify-between">
            <div>
              <p
                className="text-sm font-semibold text-foreground"
                style={{ fontFamily: 'Clash Display, sans-serif' }}
              >
                FROM ${emptyLeg.discountedPrice.toLocaleString()}
              </p>
            </div>

            <div className="w-9 h-9 bg-[#1A1A1A] dark:bg-foreground text-white dark:text-background rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
