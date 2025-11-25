'use client'

import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

interface EventCardProps {
  title: string
  price: string
  image: string
  onClick?: () => void
}

const EventCard = ({
  title,
  price,
  image,
  onClick
}: EventCardProps) => {
  return (
    <Card
      className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98] md:hover:scale-[1.02] h-[200px] md:h-[280px] p-0"
      onClick={onClick}
    >
      <div className="relative h-full">
        {/* Background Image */}
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 70vw, (max-width: 1024px) 33vw, 20vw"
        />

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />

        {/* Content */}
        <CardContent className="relative z-10 h-full flex flex-col justify-end items-start p-4 md:p-6">
          <div className="text-white">
            <h3 className="text-base md:text-lg font-bold mb-1.5 md:mb-2 leading-tight" style={{ fontFamily: 'Clash Display, sans-serif' }}>
              {title}
            </h3>
            <p className="text-lg md:text-xl font-semibold text-white/90">
              {price}
            </p>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

export default EventCard