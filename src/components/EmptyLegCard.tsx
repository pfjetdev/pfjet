'use client';

import { Calendar, Users, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface EmptyLegCardProps {
  id: number;
  from: string;
  to: string;
  date: string;
  passengers: number;
  price: number;
  image: string;
  onSelect?: () => void;
}

export default function EmptyLegCard({
  id,
  from,
  to,
  date,
  passengers,
  price,
  image,
  onSelect
}: EmptyLegCardProps) {
  return (
    <Link href={`/empty-legs/${id}`} className="block">
      <div className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 group flex h-[180px] cursor-pointer">
      {/* Image - Left Side */}
      <div className="relative w-[35%] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <Image
          src={image}
          alt={`${from} to ${to}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Content - Right Side */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        {/* Top Section: Date and Passengers */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span style={{ fontFamily: 'Montserrat, sans-serif' }}>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Up to {passengers}
            </span>
          </div>
        </div>

        {/* Middle Section: Route */}
        <h3
          className="text-base font-bold text-foreground uppercase leading-tight"
          style={{ fontFamily: 'Clash Display, sans-serif' }}
        >
          {from} - {to}
        </h3>

        {/* Bottom Section: Price and Arrow Button */}
        <div className="flex items-end justify-between">
          <div>
            <p
              className="text-sm font-semibold text-foreground"
              style={{ fontFamily: 'Clash Display, sans-serif' }}
            >
              FROM $ {price.toLocaleString()}
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
