import React from 'react';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface NewsCardProps {
  title: string;
  date: string;
  readTime: string;
  image: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  date,
  readTime,
  image
}) => {
  return (
    <Card className="w-full overflow-hidden p-0 border-0 shadow-none flex flex-col gap-[1px] cursor-pointer group">
      {/* Content section */}
      <div className="bg-card rounded-t-[24px] p-6 flex flex-col justify-between h-64 transition-colors duration-300">
        {/* Title */}
        <h3
          className="text-2xl font-medium text-foreground leading-[1.4] group-hover:text-primary transition-colors"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {title}
        </h3>

        {/* Meta information */}
        <div
          className="flex items-center justify-between text-foreground/70 text-[15px] font-medium"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          <span>{date}</span>
          <span>{readTime}</span>
        </div>
      </div>

      {/* Image section */}
      <div className="relative h-[242px] w-full rounded-b-[24px] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </Card>
  );
};

export default NewsCard;
