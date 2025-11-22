import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getJetSharingFlightById } from '@/lib/jetSharingGenerator'
import { convertTo12Hour } from '@/lib/emptyLegsGenerator'
import JetSharingDetailClient from './JetSharingDetailClient'
import Footer from '@/components/Footer'

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

  return {
    title: `${flight.from.city} to ${flight.to.city} - Shared Flight | PrivateJet`,
    description: `Book seats on this shared private jet from ${flight.from.city} to ${flight.to.city}. $${flight.pricePerSeat.toLocaleString()} per seat. ${flight.availableSeats} seats available.`,
  }
}

export default async function JetSharingDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const flight = await getJetSharingFlightById(resolvedParams.id)

  if (!flight) {
    notFound()
  }

  // Format dates
  const departureDate = new Date(flight.departureDate)
  const formattedDepartureDate = departureDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
  const shortDate = departureDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()

  // Format times in AM/PM
  const departureTime12h = convertTo12Hour(flight.departureTime)
  const arrivalTime12h = convertTo12Hour(flight.arrivalTime)

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
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
