import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getEmptyLegById, convertTo12Hour } from '@/lib/emptyLegsGenerator'
import EmptyLegDetailClient from './EmptyLegDetailClient'
import Footer from '@/components/Footer'
import { parseDateString } from '@/lib/dateUtils'
import { format } from 'date-fns'
import { createEmptyLegMetadata } from '@/lib/seo'
import { EmptyLegJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd'

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

  return createEmptyLegMetadata({
    id: resolvedParams.id,
    from_city: emptyLeg.from.city,
    to_city: emptyLeg.to.city,
    departure_date: emptyLeg.departureDate,
    aircraft_type: emptyLeg.aircraft.name,
    price: emptyLeg.discountedPrice,
    image: emptyLeg.aircraft.image,
  })
}

export default async function EmptyLegDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const emptyLeg = await getEmptyLegById(resolvedParams.id)

  if (!emptyLeg) {
    notFound()
  }

  // Format dates using date-fns to avoid timezone issues
  const departureDate = parseDateString(emptyLeg.departureDate)
  const formattedDepartureDate = format(departureDate, 'd MMMM')
  const shortDate = format(departureDate, 'd MMM yyyy').toUpperCase()

  // Format times in AM/PM
  const departureTime12h = convertTo12Hour(emptyLeg.departureTime)
  const arrivalTime12h = convertTo12Hour(emptyLeg.arrivalTime)

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* JSON-LD Structured Data */}
      <EmptyLegJsonLd
        emptyLeg={{
          id: resolvedParams.id,
          from_city: emptyLeg.from.city,
          from_airport: emptyLeg.from.code,
          to_city: emptyLeg.to.city,
          to_airport: emptyLeg.to.code,
          departure_date: emptyLeg.departureDate,
          departure_time: emptyLeg.departureTime,
          aircraft_type: emptyLeg.aircraft.name,
          price: emptyLeg.discountedPrice,
          image: emptyLeg.aircraft.image,
        }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Empty Legs', url: '/empty-legs' },
          { name: `${emptyLeg.from.city} to ${emptyLeg.to.city}`, url: `/empty-legs/${resolvedParams.id}` },
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
              {emptyLeg.from.city} - {emptyLeg.to.city}
            </h1>
          </div>

          {/* Client Component with Interactive Elements */}
          <EmptyLegDetailClient
            emptyLeg={emptyLeg}
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
