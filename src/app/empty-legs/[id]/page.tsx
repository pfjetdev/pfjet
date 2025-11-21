import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getEmptyLegById, convertTo12Hour } from '@/lib/emptyLegsGenerator'
import EmptyLegHeroBlock from '@/components/EmptyLegHeroBlock'
import EmptyLegFlightInfo from '@/components/EmptyLegFlightInfo'
import CreateOrderForm from '@/components/CreateOrderForm'
import Footer from '@/components/Footer'

export const revalidate = 86400 // Revalidate every 24 hours

interface PageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const emptyLeg = await getEmptyLegById(resolvedParams.id)

  if (!emptyLeg) {
    return {
      title: 'Empty Leg Not Found',
    }
  }

  return {
    title: `${emptyLeg.from.city} to ${emptyLeg.to.city} - Empty Leg Flight | PrivateJet`,
    description: `Book this empty leg flight from ${emptyLeg.from.city} to ${emptyLeg.to.city} with ${emptyLeg.discount}% discount. Only $${emptyLeg.discountedPrice.toLocaleString()}.`,
  }
}

export default async function EmptyLegDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const emptyLeg = await getEmptyLegById(resolvedParams.id)

  if (!emptyLeg) {
    notFound()
  }

  // Format dates
  const departureDate = new Date(emptyLeg.departureDate)
  const formattedDepartureDate = departureDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })
  const shortDate = departureDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()

  // Format times in AM/PM
  const departureTime12h = convertTo12Hour(emptyLeg.departureTime)
  const arrivalTime12h = convertTo12Hour(emptyLeg.arrivalTime)

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-6 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Route Title */}
          <div>
            <h1
              className="text-5xl font-medium text-foreground tracking-[2.4px]"
              style={{ fontFamily: 'Clash Display, sans-serif' }}
            >
              {emptyLeg.from.city} - {emptyLeg.to.city}
            </h1>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Hero Block */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Block with Image - Show destination city image if available */}
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
              />
            </div>

            {/* Right Column - Order Form */}
            <div>
              <CreateOrderForm
                jetName={`${emptyLeg.from.city} - ${emptyLeg.to.city}`}
                price={`$ ${emptyLeg.discountedPrice.toLocaleString()}`}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
