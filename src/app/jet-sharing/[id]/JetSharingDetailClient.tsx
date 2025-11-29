'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { JetSharingFlight } from '@/types/jetSharing'
import EmptyLegHeroBlock from '@/components/EmptyLegHeroBlock'
import EmptyLegFlightInfo from '@/components/EmptyLegFlightInfo'
import CreateOrderForm from '@/components/CreateOrderForm'
import MobileOrderBar from '@/components/MobileOrderBar'
import MobileOrderFormDrawer from '@/components/MobileOrderFormDrawer'

interface JetSharingDetailClientProps {
  flight: JetSharingFlight
  shortDate: string
  departureTime12h: string
  arrivalTime12h: string
  formattedDepartureDate: string
}

export default function JetSharingDetailClient({
  flight,
  shortDate,
  departureTime12h,
  arrivalTime12h,
  formattedDepartureDate,
}: JetSharingDetailClientProps) {
  const router = useRouter()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedPassengers, setSelectedPassengers] = useState(1)

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true)
  }

  const handlePassengersChange = (count: number) => {
    setSelectedPassengers(count)
  }

  // Calculate total price
  const totalPrice = flight.pricePerSeat * selectedPassengers

  return (
    <>
      {/* Back Button */}
      <button
        onClick={() => router.push('/jet-sharing')}
        className="group flex items-center gap-2 mb-4 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Jet Sharing</span>
      </button>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Hero Block */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Hero Block with Image */}
          <EmptyLegHeroBlock
            departureDate={shortDate}
            departureTime={departureTime12h}
            passengers={flight.availableSeats}
            image={flight.to.image || flight.aircraft.image}
            pricePerJet={`${flight.pricePerSeat.toLocaleString()}`}
            pricePerSeatNum={flight.pricePerSeat}
            isJetSharing={true}
            totalSeats={flight.totalSeats}
            availableSeats={flight.availableSeats}
            selectedPassengers={selectedPassengers}
            onPassengersChange={handlePassengersChange}
          />

          {/* Flight Information Component */}
          <EmptyLegFlightInfo
            aircraftName={flight.aircraft.name}
            aircraftCategory={flight.aircraft.category}
            fromCode={flight.from.code}
            fromCity={flight.from.city}
            toCode={flight.to.code}
            toCity={flight.to.city}
            departureTime={departureTime12h}
            departureDate={formattedDepartureDate}
            arrivalTime={arrivalTime12h}
            arrivalDate={formattedDepartureDate}
            duration={flight.flightDuration}
            aircraftImage={flight.aircraft.image}
            aircraftGallery={flight.aircraft.gallery}
          />
        </div>

        {/* Right Column - Order Form - Desktop Only */}
        <div className="hidden lg:block">
          <CreateOrderForm
            jetName={`Jet Sharing: ${flight.from.city} → ${flight.to.city}`}
            price={`$ ${flight.pricePerSeat.toLocaleString()}`}
            isJetSharing={true}
            availableSeats={flight.availableSeats}
            selectedPassengers={selectedPassengers}
            fromLocation={flight.from.city}
            toLocation={flight.to.city}
            departureDate={flight.departureDate}
            departureTime={flight.departureTime}
            productId={flight.id}
            productType="jet_sharing"
          />
        </div>
      </div>

      {/* Mobile Sticky Order Bar */}
      <MobileOrderBar
        price={`$ ${totalPrice.toLocaleString()}`}
        priceSubtitle={`${selectedPassengers} seat${selectedPassengers > 1 ? 's' : ''} × $${flight.pricePerSeat.toLocaleString()}`}
        onCreateOrder={handleOpenDrawer}
      />

      {/* Mobile Order Form Drawer */}
      <MobileOrderFormDrawer
        jetName={`Jet Sharing: ${flight.from.city} → ${flight.to.city}`}
        price={`$ ${flight.pricePerSeat.toLocaleString()}`}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        isJetSharing={true}
        availableSeats={flight.availableSeats}
        selectedPassengers={selectedPassengers}
        fromLocation={flight.from.city}
        toLocation={flight.to.city}
        departureDate={flight.departureDate}
        departureTime={flight.departureTime}
        productId={flight.id}
        productType="jet_sharing"
      />
    </>
  )
}
