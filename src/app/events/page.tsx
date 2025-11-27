import { Metadata } from 'next'
import { supabase, Event } from '@/lib/supabase'
import EventsClient from './EventsClient'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Events 2026 - Exclusive VIP Events | PrivateJet',
  description: 'Discover exclusive VIP events worldwide. F1 races, Art Basel, Fashion Weeks, and more premium experiences with private jet travel.',
}

export const revalidate = 3600 // Revalidate every hour

export default async function EventsPage() {
  // Fetch events from Supabase
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('date_from', { ascending: true })

  const eventsData: Event[] = events || []

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
              Events 2026
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Exclusive events and unforgettable experiences await you
            </p>
          </div>

          {/* Main Content - Filters + Cards */}
          <EventsClient initialEvents={eventsData} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
