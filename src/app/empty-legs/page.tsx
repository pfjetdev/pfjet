import { Metadata } from 'next'
import { generateAllEmptyLegs } from '@/lib/emptyLegsGenerator'
import EmptyLegsClient from './EmptyLegsClient'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Empty Legs - Discounted Private Jet Flights | PrivateJet',
  description: 'Find discounted private jet empty leg flights. Save up to 75% on luxury private jet travel with our exclusive empty leg deals.',
}

export const revalidate = 86400 // Revalidate every 24 hours

export default async function EmptyLegsPage() {
  const emptyLegs = await generateAllEmptyLegs(100)

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-6 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Title */}
          <div>
            <h1
              className="text-5xl font-medium text-foreground tracking-[2.4px]"
              style={{ fontFamily: 'Clash Display, sans-serif' }}
            >
              Empty Legs
            </h1>
            <p className="mt-2 text-muted-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Find exclusive empty leg flights with up to 75% discount on private jet travel
            </p>
          </div>

          {/* Main Content - Filters + Cards */}
          <EmptyLegsClient initialEmptyLegs={emptyLegs} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
