// Types for Empty Legs feature

export interface Airport {
  city: string
  code: string
  country: string
  countryCode: string
  lat: number
  lng: number
  image?: string
  timezone?: string // e.g., "Europe/Paris", "America/New_York"
}

export interface Aircraft {
  id: string
  name: string
  slug: string
  category: string
  categorySlug: string
  image: string
  passengers: string
  range: string
  speed: string
}

export interface EmptyLeg {
  id: string
  from: Airport
  to: Airport
  departureDate: string // ISO date
  departureTime: string
  arrivalTime: string
  aircraft: Aircraft
  originalPrice: number
  discountedPrice: number
  discount: number // percentage
  availableSeats: number
  flightDuration: string // e.g., "2h 30m"
  status: 'available' | 'booked' | 'expired'
}

export interface EmptyLegFilters {
  from?: string
  to?: string
  dateFrom?: string
  dateTo?: string
  maxPrice?: number
  minSeats?: number
  category?: string
}
