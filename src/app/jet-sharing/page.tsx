import { generateAllJetSharingFlights } from '@/lib/jetSharingGenerator'
import JetSharingClient from './JetSharingClient'
import Footer from '@/components/Footer'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata.jetSharing

export const revalidate = 86400 // Revalidate every 24 hours

export default async function JetSharingPage() {
  const flights = await generateAllJetSharingFlights(100)

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
