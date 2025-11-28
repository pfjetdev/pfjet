'use client'

import Image from 'next/image'
import { useFormContext } from '@/contexts/FormContext'
import { formatRoutePrice } from '@/lib/topRoutesGenerator'
import { findAirportByCity } from '@/data/airports'

interface TopRouteCardProps {
  id: string
  fromCity: string
  toCity: string
  price: number
  image: string
}

export default function TopRouteCard({ fromCity, toCity, price, image }: TopRouteCardProps) {
  const { updateFormData, triggerDateFocus, triggerMobileDrawer } = useFormContext()

  const handleClick = () => {
    // Find airports for the cities to get IATA codes
    const fromAirport = findAirportByCity(fromCity)
    const toAirport = findAirportByCity(toCity)

    // Format as "City, IATA" or just city name if no airport found
    const fromValue = fromAirport
      ? `${fromAirport.city}, ${fromAirport.code}`
      : fromCity
    const toValue = toAirport
      ? `${toAirport.city}, ${toAirport.code}`
      : toCity

    // Update form with route data
    updateFormData('from', fromValue)
    updateFormData('to', toValue)

    // Desktop: open date picker, Mobile: open search drawer
    const isDesktop = window.innerWidth >= 768
    setTimeout(() => {
      if (isDesktop) {
        triggerDateFocus()
      } else {
        triggerMobileDrawer()
      }
    }, 100)
  }

  return (
    <div
      onClick={handleClick}
      className="relative h-40 md:h-64 rounded-lg overflow-hidden group cursor-pointer active:scale-[0.98] md:hover:scale-[1.02] transition-transform duration-300"
    >
      {/* Background Image */}
      <Image
        src={image}
        alt={toCity}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />

      {/* Content */}
      <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 text-white">
        <h3 className="text-sm md:text-lg font-semibold mb-0.5 md:mb-1 drop-shadow-lg" style={{ fontFamily: 'Clash Display, sans-serif' }}>
          {fromCity} → {toCity}
        </h3>
        <p className="text-base md:text-xl font-bold drop-shadow-lg" style={{ fontFamily: 'Clash Display, sans-serif' }}>
          {formatRoutePrice(price)}
        </p>
      </div>
    </div>
  )
}
