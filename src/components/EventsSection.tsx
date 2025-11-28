'use client'

import { useState } from 'react'
import EventCard from './EventCard'
import EventModal from './EventModal'
import { MoveRight } from 'lucide-react'
import Link from 'next/link'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Event } from '@/lib/supabase'

interface EventData {
  title: string
  price: string
  description: string
  date: string
  location: string
  capacity: string
  image: string
}

interface EventsSectionProps {
  events: Event[]
}

const EventsSection = ({ events }: EventsSectionProps) => {
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Transform Supabase events to component format
  const eventsData: EventData[] = events.map(event => ({
    title: event.title,
    price: `$${event.price.toLocaleString()}`,
    description: event.description,
    date: event.date_display,
    location: event.location,
    capacity: `${event.capacity} seats`,
    image: event.image
  }))

  const handleCardClick = (event: EventData) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
  }

  return (
    <section className="py-8 md:py-16 pl-4 pr-0 bg-background">
      <div className="max-w-7xl mx-auto pr-0">
        {/* Header with title and View all button */}
        <div className="flex items-center justify-between mb-4 md:mb-8 pr-4">
          <div>
            <h2 className="text-3xl md:text-6xl font-medium text-foreground mb-2 md:mb-4" style={{ fontFamily: 'Clash Display, sans-serif' }}>
              Events 2026
            </h2>
            <p className="text-sm md:text-lg text-foreground/80 max-w-2xl hidden md:block">
              Exclusive events and unforgettable experiences await you
            </p>
          </div>
          <Link
            href="/events"
            className="flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 border border-foreground md:border-2 text-foreground hover:bg-foreground hover:text-background transition-all duration-300 rounded-lg group"
          >
            <span className="font-semibold text-sm md:text-lg" style={{ fontFamily: 'Clash Display, sans-serif' }}>
              View all
            </span>
            <MoveRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-3">
            {eventsData.map((event, index) => (
                <CarouselItem key={index} className="basis-[70%] sm:basis-1/2 md:basis-1/3 lg:basis-1/5 pl-3">
                  <EventCard
                    title={event.title}
                    price={event.price}
                    image={event.image}
                    onClick={() => handleCardClick(event)}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
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