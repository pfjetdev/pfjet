'use client'

import { useState, useMemo } from 'react'
import { Event } from '@/lib/supabase'
import EventCard from '@/components/EventCard'
import EventModal from '@/components/EventModal'
import { cn } from '@/lib/utils'

interface EventsClientProps {
  initialEvents: Event[]
}

// Event categories derived from event titles/types
const categories = [
  { id: 'all', label: 'All Events' },
  { id: 'sports', label: 'Sports' },
  { id: 'art', label: 'Art & Culture' },
  { id: 'music', label: 'Music' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'motorsport', label: 'Motorsport' },
]

// Helper function to categorize events
function getEventCategory(title: string): string {
  const titleLower = title.toLowerCase()

  if (titleLower.includes('f1') || titleLower.includes('grand prix') || titleLower.includes('monaco gp') || titleLower.includes('formula')) {
    return 'motorsport'
  }
  if (titleLower.includes('art') || titleLower.includes('basel') || titleLower.includes('biennale') || titleLower.includes('gallery') || titleLower.includes('cannes') || titleLower.includes('film')) {
    return 'art'
  }
  if (titleLower.includes('fashion') || titleLower.includes('week') || titleLower.includes('couture') || titleLower.includes('met gala')) {
    return 'fashion'
  }
  if (titleLower.includes('coachella') || titleLower.includes('concert') || titleLower.includes('festival') || titleLower.includes('music') || titleLower.includes('grammy') || titleLower.includes('super bowl halftime')) {
    return 'music'
  }
  if (titleLower.includes('super bowl') || titleLower.includes('wimbledon') || titleLower.includes('champions') || titleLower.includes('world cup') || titleLower.includes('olympic') || titleLower.includes('tennis') || titleLower.includes('golf') || titleLower.includes('masters')) {
    return 'sports'
  }

  return 'other'
}

interface EventData {
  title: string
  price: string
  description: string
  date: string
  location: string
  capacity: string
  image: string
}

export default function EventsClient({ initialEvents }: EventsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Transform and filter events
  const filteredEvents = useMemo(() => {
    let events = initialEvents

    if (selectedCategory !== 'all') {
      events = events.filter(event => getEventCategory(event.title) === selectedCategory)
    }

    return events
  }, [initialEvents, selectedCategory])

  // Transform event for modal
  const handleCardClick = (event: Event) => {
    const eventData: EventData = {
      title: event.title,
      price: `$${event.price.toLocaleString()}`,
      description: event.description,
      date: event.date_display,
      location: event.location,
      capacity: `${event.capacity} seats`,
      image: event.image
    }
    setSelectedEvent(eventData)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
  }

  return (
    <>
      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0",
              selectedCategory === category.id
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
      </p>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              title={event.title}
              price={`$${event.price.toLocaleString()}`}
              image={event.image}
              onClick={() => handleCardClick(event)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            No events found in this category
          </p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="mt-4 text-primary hover:underline"
          >
            View all events
          </button>
        </div>
      )}

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          event={selectedEvent}
        />
      )}
    </>
  )
}
