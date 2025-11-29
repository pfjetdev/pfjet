import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getJetSharingFlightById } from '@/lib/jetSharingGenerator'
import { convertTo12Hour } from '@/lib/emptyLegsGenerator'
import JetSharingDetailClient from './JetSharingDetailClient'
import Footer from '@/components/Footer'
import { parseDateString } from '@/lib/dateUtils'
import { format } from 'date-fns'
import { createJetSharingMetadata } from '@/lib/seo'
import { JetSharingJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd'

export const revalidate = 3600 // Revalidate every hour

interface PageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const flight = await getJetSharingFlightById(resolvedParams.id)

  if (!flight) {
    return {
      title: 'Flight Not Found',
    }
  }

  return createJetSharingMetadata({
    id: resolvedParams.id,
    from_city: flight.from.city,
    to_city: flight.to.city,
    departure_date: flight.departureDate,
    aircraft_type: flight.aircraft.name,
    price_per_seat: flight.pricePerSeat,
    available_seats: flight.availableSeats,
    image: flight.aircraft.image,
  })
}

export default async function JetSharingDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const flight = await getJetSharingFlightById(resolvedParams.id)

  if (!flight) {
    notFound()
  }

  // Format dates using date-fns to avoid timezone issues
  const departureDate = parseDateString(flight.departureDate)
  const formattedDepartureDate = format(departureDate, 'd MMMM yyyy')
  const shortDate = format(departureDate, 'd MMM yyyy').toUpperCase()

  // Format times in AM/PM
  const departureTime12h = convertTo12Hour(flight.departureTime)
  const arrivalTime12h = convertTo12Hour(flight.arrivalTime)

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* JSON-LD Structured Data */}
      <JetSharingJsonLd
        flight={{
          id: resolvedParams.id,
          from_city: flight.from.city,
          to_city: flight.to.city,
          departure_date: flight.departureDate,
          departure_time: flight.departureTime,
          aircraft_type: flight.aircraft.name,
          price_per_seat: flight.pricePerSeat,
          available_seats: flight.availableSeats,
          image: flight.aircraft.image,
        }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Jet Sharing', url: '/jet-sharing' },
          { name: `${flight.from.city} to ${flight.to.city}`, url: `/jet-sharing/${resolvedParams.id}` },
        ]}
      />

      <main className="pt-4 sm:pt-6 px-4 pb-20 lg:pb-12">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8">
          {/* Route Title */}
          <div>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-medium text-foreground tracking-[2.4px]"
              style={{ fontFamily: 'Clash Display, sans-serif' }}
            >
              {flight.from.city} - {flight.to.city}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Shared Private Jet Flight
            </p>
          </div>

          {/* Client Component with Interactive Elements */}
          <JetSharingDetailClient
            flight={flight}
            shortDate={shortDate}
            departureTime12h={departureTime12h}
            arrivalTime12h={arrivalTime12h}
            formattedDepartureDate={formattedDepartureDate}
          />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
