'use client';

import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface JetCardProps {
  id: number;
  name: string;
  category: string;
  price: string;
  seats: number;
  image: string;
  onSelect?: () => void;
}

export default function JetCard({
  id,
  name,
  category,
  price,
  seats,
  image,
  onSelect
}: JetCardProps) {
  const router = useRouter();

  const handleSelect = () => {
    if (onSelect) {
      onSelect();
    }
    router.push(`/jet/${id}`);
  };

  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 group">
      {/* Image Section */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Name and Category */}
        <div className="flex items-start justify-between">
          <h3
            className="text-lg font-bold text-foreground"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            {name}
          </h3>
          <span
            className="text-xs font-medium text-muted-foreground px-2 py-1 bg-muted rounded"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {category}
          </span>
        </div>

        {/* Price and Seats */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: 'Clash Display, sans-serif' }}
            >
              {price}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-muted-foreground"
            >
              <path
                d="M10 2L3 7V13C3 16 10 18 10 18C10 18 17 16 17 13V7L10 2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 10C11.1046 10 12 9.10457 12 8C12 6.89543 11.1046 6 10 6C8.89543 6 8 6.89543 8 8C8 9.10457 8.89543 10 10 10Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M7 14C7 12.8954 8.34315 12 10 12C11.6569 12 13 12.8954 13 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span
              className="text-sm font-medium"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {seats} Seats
            </span>
          </div>
        </div>

        {/* Select Button */}
        <button
          onClick={handleSelect}
          className="w-full flex items-center justify-between px-4 py-3 bg-background border-2 border-foreground rounded-full hover:bg-foreground hover:text-background transition-all duration-200 group/btn active:scale-95"
        >
          <span
            className="text-sm font-medium"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Select jet
          </span>
          <div className="w-5 h-5 bg-foreground text-background rounded-full flex items-center justify-center group-hover/btn:bg-background group-hover/btn:text-foreground transition-colors">
            <ArrowUpRight className="w-3 h-3" strokeWidth={3} />
          </div>
        </button>
      </div>
    </div>
  );
}
