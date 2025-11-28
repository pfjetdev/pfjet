'use client'

import { Calendar, MapPin } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/useIsMobile"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  event: {
    title: string
    price: string
    description?: string
    date?: string
    location?: string
    capacity?: string
    image?: string
  }
}

function EventContent({ event }: { event: EventModalProps['event'] }) {
  return (
    <div className="space-y-6">
      {/* Event Image */}
      {event.image && (
        <div className="w-full h-48 rounded-xl overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Event Title and Price */}
      <div className="flex justify-between items-start">
        <h3
          className="text-xl font-bold text-foreground"
          style={{ fontFamily: 'Clash Display, sans-serif' }}
        >
          {event.title}
        </h3>
        <p
          className="text-xl font-bold text-foreground"
          style={{ fontFamily: 'Clash Display, sans-serif' }}
        >
          {event.price}
        </p>
      </div>

      {/* Event Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {event.date && (
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>Date</p>
              <p className="text-sm font-medium text-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>{event.date}</p>
            </div>
          </div>
        )}

        {event.location && (
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>Location</p>
              <p className="text-sm font-medium text-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>{event.location}</p>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      {event.description && (
        <div>
          <h4
            className="text-base font-semibold text-foreground mb-2"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            Description
          </h4>
          <p
            className="text-sm text-muted-foreground leading-relaxed"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {event.description}
          </p>
        </div>
      )}

      {/* Action Button */}
      <button
        className="w-full text-white px-8 py-4 rounded-xl font-medium transition-colors duration-200 shadow-lg hover:opacity-90"
        style={{ backgroundColor: 'var(--brand-red)', fontFamily: 'Clash Display, sans-serif' }}
      >
        Ask for details
      </button>
    </div>
  )
}

const EventModal = ({ isOpen, onClose, event }: EventModalProps) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="pb-safe max-h-[90vh]">
          <DrawerHeader className="text-center pb-2">
            <DrawerTitle
              className="text-xl font-semibold"
              style={{ fontFamily: 'Clash Display, sans-serif' }}
            >
              Event Details
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-6 pb-6 overflow-y-auto">
            <EventContent event={event} />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <div className="p-6">
          <DialogHeader className="mb-4">
            <DialogTitle
              className="text-xl font-semibold"
              style={{ fontFamily: 'Clash Display, sans-serif' }}
            >
              Event Details
            </DialogTitle>
          </DialogHeader>
          <EventContent event={event} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EventModal
