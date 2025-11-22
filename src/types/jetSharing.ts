// Types for Jet Sharing feature

// Reuse Airport and Aircraft types from emptyLegs
export type { Airport, Aircraft } from './emptyLegs'

export interface JetSharingFlight {
  id: string
  from: import('./emptyLegs').Airport
  to: import('./emptyLegs').Airport
  departureDate: string // ISO date (YYYY-MM-DD)
  departureTime: string // 24-hour format (HH:MM)
  arrivalTime: string // 24-hour format (HH:MM)
  aircraft: import('./emptyLegs').Aircraft
  totalSeats: number // Total seats on this flight
  availableSeats: number // Remaining available seats
  pricePerSeat: number // Price per seat in USD
  flightDuration: string // e.g., "2h 30m"
  status: 'available' | 'full' | 'cancelled' | 'completed'
  isFeatured?: boolean // Flag for featured/promoted flights
}

export interface JetSharingFilters {
  from?: string
  to?: string
  dateFrom?: string
  dateTo?: string
  maxPrice?: number // Max price per seat
  minPrice?: number // Min price per seat
  minSeats?: number // Minimum available seats needed
  category?: string
  categories?: string[]
}
