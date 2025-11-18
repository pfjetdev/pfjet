import React from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, Users, MoveUpRight } from 'lucide-react';
import Link from 'next/link';

interface JetSharingCardProps {
  id: number;
  from: string;
  to: string;
  date: string;
  time: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  image: string;
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
  image
}) => {
  return (
    <Link href={`/jet-sharing/${id}`} className="block">
      <Card className="w-full max-w-sm overflow-hidden p-0 cursor-pointer hover:shadow-lg transition-all duration-300">
        {/* Image Background */}
        <div
          className="relative aspect-square bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Content at bottom left */}
          <div className="absolute bottom-4 left-4 text-white">
            {/* Date/Time and Passengers */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {/* Date with Time */}
              <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2.5 py-1.5 rounded-lg">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span className="text-xs font-medium whitespace-nowrap" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  {date} / {time}
                </span>
              </div>

              {/* Available Seats */}
              <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2.5 py-1.5 rounded-lg">
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span className="text-xs font-medium whitespace-nowrap" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  {availableSeats} out of {totalSeats} left
                </span>
              </div>
            </div>

            {/* Route */}
            <div className="font-sans" style={{ fontSize: '18px', fontWeight: '600' }}>
              {from} - {to}
            </div>
          </div>
        </div>

        {/* Price Section */}
        <div className="px-4 pb-4 flex items-center justify-center">
          <div className="text-lg font-medium" style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: '500' }}>
            From $ {price.toLocaleString()}
          </div>

          {/* Arrow Icon Button */}
          <div className="bg-black dark:bg-foreground text-white dark:text-background p-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer ml-auto">
            <MoveUpRight className="w-5 h-5" />
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default JetSharingCard;
