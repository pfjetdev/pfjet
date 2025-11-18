'use client'

import { useState } from 'react'
import EventCard from './EventCard'
import EventModal from './EventModal'
import { MoveRight } from 'lucide-react'

interface EventData {
  title: string
  price: string
  description: string
  date: string
  location: string
  capacity: string
  image: string
}

const EventsSection = () => {
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const eventsData: EventData[] = [
    {
      title: "Monaco Grand Prix 2026",
      price: "$15,000",
      description: "Exclusive access to the most prestigious Formula 1 race in Monaco. Includes VIP seats, paddock access and meet & greet with drivers.",
      date: "May 25-28, 2026",
      location: "Monte Carlo, Monaco",
      capacity: "50 seats",
      image: "/car.jpg"
    },
    {
      title: "Cannes Film Festival 2026",
      price: "$8,500",
      description: "Join movie stars on the red carpet at the Cannes Film Festival. Film premieres, gala dinners and exclusive parties.",
      date: "May 12-23, 2026",
      location: "Cannes, France",
      capacity: "100 seats",
      image: "/night.jpg"
    },
    {
      title: "Wimbledon Finals 2026",
      price: "$12,000",
      description: "Centre Court at Wimbledon awaits you! Enjoy the final matches of the world's most prestigious tennis tournament.",
      date: "June 29 - July 12, 2026",
      location: "London, United Kingdom",
      capacity: "75 seats",
      image: "/day.jpg"
    },
    {
      title: "Art Basel Miami 2026",
      price: "$6,000",
      description: "Discover contemporary art at one of the world's most influential art fairs. Private viewings and artist meet & greets.",
      date: "December 3-6, 2026",
      location: "Miami Beach, USA",
      capacity: "120 seats",
      image: "/night.jpg"
    },
    {
      title: "World Economic Forum 2026",
      price: "$25,000",
      description: "Participate in global discussions about the future of economy and technology. Networking with world leaders and innovators.",
      date: "January 17-21, 2026",
      location: "Davos, Switzerland",
      capacity: "200 seats",
      image: "/hotel.jpg"
    }
  ]

  const handleCardClick = (event: EventData) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
  }

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header with title and View all button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-6xl font-medium text-foreground mb-4" style={{ fontFamily: 'Clash Display, sans-serif' }}>
              Events 2026
            </h2>
            <p className="text-lg text-foreground/80 max-w-2xl">
              Exclusive events and unforgettable experiences await you
            </p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-all duration-300 rounded-lg group">
            <span className="font-semibold text-lg" style={{ fontFamily: 'Clash Display, sans-serif' }}>
              View all
            </span>
            <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {eventsData.map((event, index) => (
            <EventCard
              key={index}
              title={event.title}
              price={event.price}
              onClick={() => handleCardClick(event)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedEvent && (
        <EventModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          event={selectedEvent}
        />
      )}
    </section>
  )
}

export default EventsSection