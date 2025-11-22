import { Metadata } from 'next'
import { getAllJetSharingFlights } from '@/lib/jetSharingGenerator'
import { jetSharingConfig, getJetSharingMode } from '@/config/jetSharing'
import JetSharingClient from './JetSharingClient'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Jet Sharing - Shared Private Jet Flights | PrivateJet',
  description: 'Book individual seats on shared private jet flights. Share the luxury of private jet travel at a fraction of the cost.',
}

export const revalidate = 3600

export default async function JetSharingPage() {
  const mode = getJetSharingMode()
  const flights = await getAllJetSharingFlights(jetSharingConfig.defaultLimit, mode)

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-6 px-4 pb-24 lg:pb-12">
        <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
          {/* Title */}
          <div>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-medium text-foreground tracking-[2.4px]"
              style={{ fontFamily: 'Clash Display, sans-serif' }}
            >
              Jet Sharing
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Book individual seats on shared private jet flights and experience luxury travel at an affordable price
            </p>
          </div>

          {/* Main Content - Filters + Cards */}
          <JetSharingClient initialFlights={flights} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
