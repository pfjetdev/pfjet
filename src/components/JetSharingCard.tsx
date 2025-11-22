import React from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, Users, ArrowUpRight, Plane } from 'lucide-react';
import Link from 'next/link';

interface JetSharingCardProps {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  image: string;
  aircraftName: string;
}

const JetSharingCard: React.FC<JetSharingCardProps> = ({
  id,
  from,
  to,
  date,
  time,
  totalSeats,
  availableSeats,
  price,
  image,
  aircraftName
}) => {
  return (
    <Link href={`/jet-sharing/${id}`} className="block">
      <Card className="group w-full overflow-hidden border border-border/50 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 p-0 gap-0 bg-background">
        {/* Image container with overlay */}
        <div
          className="relative aspect-square overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Gradient overlay - enhanced on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all duration-300 group-hover:from-black/80" />

          {/* Content overlay */}
          <div className="absolute inset-x-0 bottom-0 p-2.5 md:p-3 text-white">
            {/* Date/Time and Available Seats badges */}
            <div className="flex items-center gap-1.5 mb-1.5 md:mb-2 flex-wrap">
              {/* Date with Time badge */}
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-2 py-1 rounded-md border border-white/20 transition-all duration-300 group-hover:bg-white/20">
                <Calendar className="w-3 h-3" />
                <span className="text-xs font-medium whitespace-nowrap" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  {date} / {time}
                </span>
              </div>

              {/* Available Seats badge */}
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-2 py-1 rounded-md border border-white/20 transition-all duration-300 group-hover:bg-white/20">
                <Users className="w-3 h-3" />
                <span className="text-xs font-medium whitespace-nowrap" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  {availableSeats}/{totalSeats} left
                </span>
              </div>
            </div>

            {/* Aircraft Name */}
            <div className="flex items-center gap-1 mb-1.5">
              <Plane className="w-3 h-3" />
              <span className="text-xs font-medium" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                {aircraftName}
              </span>
            </div>

            {/* Route */}
            <h3 className="text-sm md:text-lg font-semibold tracking-tight transition-all duration-300 group-hover:translate-x-1" style={{ fontFamily: 'Clash Display, sans-serif' }}>
              {from} - {to}
            </h3>
          </div>
        </div>

        {/* Price footer */}
        <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-2.5 bg-background">
          <div className="text-sm md:text-base font-semibold text-foreground" style={{ fontFamily: 'Clash Display, sans-serif' }}>
            From $ {price.toLocaleString()}
          </div>

          {/* Arrow button */}
          <div className="w-7 h-7 sm:w-9 sm:h-9 bg-muted text-muted-foreground rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default JetSharingCard;
