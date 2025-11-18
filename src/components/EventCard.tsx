'use client'

import { Card, CardContent } from '@/components/ui/card'

interface EventCardProps {
  title: string
  price: string
  onClick?: () => void
}

const EventCard = ({
  title,
  price,
  onClick
}: EventCardProps) => {
  return (
    <Card 
      className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] h-[280px] p-0"
      onClick={onClick}
    >
      <div className="relative h-full">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
        
        {/* Overlay for hover effect */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
        
        {/* Content */}
        <CardContent className="relative z-10 h-full flex flex-col justify-end items-start p-6">
          <div className="text-white">
            <h3 className="text-lg font-bold mb-2 leading-tight" style={{ fontFamily: 'Clash Display, sans-serif' }}>
              {title}
            </h3>
            <p className="text-xl font-semibold text-white/90">
              {price}
            </p>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

export default EventCard