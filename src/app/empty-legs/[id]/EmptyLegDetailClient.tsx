'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { EmptyLeg } from '@/types/emptyLegs'
import EmptyLegHeroBlock from '@/components/EmptyLegHeroBlock'
import EmptyLegFlightInfo from '@/components/EmptyLegFlightInfo'
import CreateOrderForm from '@/components/CreateOrderForm'
import MobileOrderBar from '@/components/MobileOrderBar'
import MobileOrderFormDrawer from '@/components/MobileOrderFormDrawer'

interface EmptyLegDetailClientProps {
  emptyLeg: EmptyLeg
  shortDate: string
  departureTime12h: string
  arrivalTime12h: string
  formattedDepartureDate: string
}

export default function EmptyLegDetailClient({
  emptyLeg,
  shortDate,
  departureTime12h,
  arrivalTime12h,
  formattedDepartureDate,
}: EmptyLegDetailClientProps) {
  const router = useRouter()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true)
  }

  return (
    <>
      {/* Back Button */}
      <button
        onClick={() => router.push('/empty-legs')}
        className="group flex items-center gap-2 mb-4 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Empty Legs</span>
      </button>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Hero Block */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Hero Block with Image */}
          <EmptyLegHeroBlock
            departureDate={shortDate}
            departureTime={departureTime12h}
            passengers={emptyLeg.availableSeats}
            image={emptyLeg.to.image || emptyLeg.aircraft.image}
            pricePerJet={emptyLeg.discountedPrice.toLocaleString()}
          />

          {/* Flight Information Component */}
          <EmptyLegFlightInfo
            aircraftName={emptyLeg.aircraft.name}
            aircraftCategory={emptyLeg.aircraft.category}
            fromCode={emptyLeg.from.code}
            fromCity={emptyLeg.from.city}
            toCode={emptyLeg.to.code}
            toCity={emptyLeg.to.city}
            departureTime={departureTime12h}
            departureDate={formattedDepartureDate}
            arrivalTime={arrivalTime12h}
            arrivalDate={formattedDepartureDate}
            duration={emptyLeg.flightDuration}
            aircraftImage={emptyLeg.aircraft.image}
            aircraftGallery={emptyLeg.aircraft.gallery}
          />
        </div>

        {/* Right Column - Order Form - Desktop Only */}
        <div className="hidden lg:block">
          <CreateOrderForm
            jetName={`${emptyLeg.from.city} - ${emptyLeg.to.city}`}
            price={`$ ${emptyLeg.discountedPrice.toLocaleString()}`}
          />
        </div>
      </div>

      {/* Mobile Sticky Order Bar */}
      <MobileOrderBar
        price={`$ ${emptyLeg.discountedPrice.toLocaleString()}`}
        onCreateOrder={handleOpenDrawer}
      />

      {/* Mobile Order Form Drawer */}
      <MobileOrderFormDrawer
        jetName={`${emptyLeg.from.city} - ${emptyLeg.to.city}`}
        price={`$ ${emptyLeg.discountedPrice.toLocaleString()}`}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />
    </>
  )
}
