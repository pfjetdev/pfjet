'use client';

import Link from 'next/link';
import EmptyLegsCard from './EmptyLegsCard';
import { MoveRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { EmptyLeg } from '@/types/emptyLegs';

interface EmptyLegsSectionProps {
  emptyLegs: EmptyLeg[];
}

// Format date for card display (YYYY-MM-DD format)
function formatCardDate(dateStr: string): string {
  // Parse date string as local date to avoid timezone issues
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const monthName = monthNames[date.getMonth()];
  const dayNum = date.getDate();
  const dayOfWeek = dayNames[date.getDay()];

  return `${monthName} ${dayNum}, ${dayOfWeek}`;
}

// Format price for display
function formatPrice(price: number): string {
  return price.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

export default function EmptyLegsSection({ emptyLegs }: EmptyLegsSectionProps) {
  return (
    <section className="py-8 md:py-16 pl-4 pr-0 bg-background">
      <div className="max-w-7xl mx-auto pr-0">
        {/* Header with title and View all button */}
        <div className="flex items-center justify-between mb-4 md:mb-8">
          <h2 className="text-3xl md:text-6xl font-medium text-foreground" style={{ fontFamily: 'Clash Display, sans-serif' }}>
            Empty Legs
          </h2>
          <Link href="/empty-legs">
            <button className="flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 border border-foreground md:border-2 text-foreground hover:bg-foreground hover:text-background transition-all duration-300 rounded-lg group">
              <span className="font-semibold text-sm md:text-lg" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                View all
              </span>
              <MoveRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: false,
            skipSnaps: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-3">
            {emptyLegs.map((leg) => {
                const route = `${leg.from.city} - ${leg.to.city}`;
                const passengers = `Up to ${leg.availableSeats}`;
                const price = `From $ ${formatPrice(leg.discountedPrice)}`;
                const date = formatCardDate(leg.departureDate);
                const image = leg.from.image || leg.to.image || '/day.jpg';

                return (
                  <CarouselItem key={leg.id} className="pl-2 md:pl-3 basis-[60%] sm:basis-[48%] md:basis-[33%] lg:basis-[25%]">
                    <div className="p-1">
                      <Link href={`/empty-legs/${leg.id}`} className="block">
                        <EmptyLegsCard
                          date={date}
                          passengers={passengers}
                          route={route}
                          price={price}
                          image={image}
                        />
                      </Link>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden lg:flex -left-4 xl:-left-12" />
            <CarouselNext className="hidden lg:flex -right-4 xl:-right-12" />
          </Carousel>
      </div>
    </section>
  );
}