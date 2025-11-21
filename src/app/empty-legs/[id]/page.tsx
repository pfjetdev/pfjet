import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getEmptyLegById, convertTo12Hour } from '@/lib/emptyLegsGenerator'
import EmptyLegDetailClient from './EmptyLegDetailClient'
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
