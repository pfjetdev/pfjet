import { JetSharingFlight } from '@/types/jetSharing'
import { Airport } from '@/types/emptyLegs'
import { supabase } from './supabase'
import airportsData from '@/data/airports-full.json'

// Type for flights from Supabase
interface JetSharingFlightDB {
  id: string
  from_city_id: string
  to_city_id: string
  aircraft_id: string
  departure_date: string
  departure_time: string
  total_seats: number
  available_seats: number
  price_per_seat: number
  distance_nm: number | null
  duration: string
  status: string
  is_featured: boolean
  from_city: {
    id: string
    name: string
    country_code: string
    image: string | null
  }
  to_city: {
    id: string
    name: string
    country_code: string
    image: string | null
  }
  aircraft: {
    id: string
    name: string
    slug: string
    category: string
    category_slug: string
    image: string | null
    passengers: string
    range: string
    speed: string
  }
}

// Timezone mapping for cities (IANA timezone identifiers)
// Reuse from emptyLegsGenerator or import if needed
const CITY_TIMEZONES: Record<string, string> = {
  // North America - United States
  'New York': 'America/New_York',
  'Los Angeles': 'America/Los_Angeles',
  'Miami': 'America/New_York',
  'Las Vegas': 'America/Los_Angeles',
  'Chicago': 'America/Chicago',
  'San Francisco': 'America/Los_Angeles',
  'Boston': 'America/New_York',
  'Seattle': 'America/Los_Angeles',
  'Washington': 'America/New_York',
  'Atlanta': 'America/New_York',
  'Dallas': 'America/Chicago',
  'Houston': 'America/Chicago',
  'Phoenix': 'America/Phoenix',
  'Denver': 'America/Denver',
  'Orlando': 'America/New_York',

  // Europe
  'London': 'Europe/London',
  'Paris': 'Europe/Paris',
  'Amsterdam': 'Europe/Amsterdam',
  'Brussels': 'Europe/Brussels',
  'Frankfurt': 'Europe/Berlin',
  'Munich': 'Europe/Berlin',
  'Berlin': 'Europe/Berlin',
  'Zurich': 'Europe/Zurich',
  'Geneva': 'Europe/Zurich',
  'Vienna': 'Europe/Vienna',
  'Madrid': 'Europe/Madrid',
  'Barcelona': 'Europe/Madrid',
  'Rome': 'Europe/Rome',
  'Milan': 'Europe/Rome',
  'Venice': 'Europe/Rome',
  'Athens': 'Europe/Athens',
  'Lisbon': 'Europe/Lisbon',
  'Nice': 'Europe/Paris',
  'Monaco': 'Europe/Monaco',
  'Ibiza': 'Europe/Madrid',
  'Istanbul': 'Europe/Istanbul',
  'Moscow': 'Europe/Moscow',
  'Prague': 'Europe/Prague',
  'Copenhagen': 'Europe/Copenhagen',
  'Stockholm': 'Europe/Stockholm',
  'Oslo': 'Europe/Oslo',

  // Middle East & Asia
  'Dubai': 'Asia/Dubai',
  'Abu Dhabi': 'Asia/Dubai',
  'Doha': 'Asia/Qatar',
  'Singapore': 'Asia/Singapore',
  'Bangkok': 'Asia/Bangkok',
  'Tokyo': 'Asia/Tokyo',
  'Hong Kong': 'Asia/Hong_Kong',
}

// Convert duration to display format
function convertDuration(duration: string): string {
  // Database format: "1h 40min" or "52min"
  // Display format: "1h 40m" or "52m"
  return duration.replace(/min/g, 'm')
}

// Parse duration string to minutes
function parseDurationToMinutes(duration: string): number {
  const hoursMatch = duration.match(/(\d+)\s*h/)
  const minutesMatch = duration.match(/(\d+)\s*m/)

  let totalMinutes = 0
  if (hoursMatch) totalMinutes += parseInt(hoursMatch[1]) * 60
  if (minutesMatch) totalMinutes += parseInt(minutesMatch[1])

  return totalMinutes || 60 // Default to 60 minutes if parsing fails
}

// Calculate arrival time based on departure time and flight duration
function calculateArrivalTime(departureTime: string, flightDuration: string): string {
  const durationMinutes = parseDurationToMinutes(flightDuration)

  // Parse departure time (HH:MM format)
  const [hours, minutes] = departureTime.split(':').map(Number)

  // Create a date object with departure time
  const departure = new Date()
  departure.setHours(hours, minutes, 0, 0)

  // Add flight duration
  const arrival = new Date(departure.getTime() + durationMinutes * 60000)

  // Format as HH:MM
  const arrivalHours = arrival.getHours().toString().padStart(2, '0')
  const arrivalMinutes = arrival.getMinutes().toString().padStart(2, '0')

  return `${arrivalHours}:${arrivalMinutes}`
}

// Cache for airport lookup by city name
let airportLookupCache: Map<string, any> | null = null

// Build airport lookup map (runs once and caches)
function getAirportLookupMap(): Map<string, any> {
  if (airportLookupCache) {
    return airportLookupCache
  }

  const lookupMap = new Map<string, any>()
  const airportsList = Object.values(airportsData) as any[]

  for (const airport of airportsList) {
    if (airport.city && airport.iata && airport.lat && airport.lon) {
      lookupMap.set(airport.city.toLowerCase(), airport)
    }
  }

  airportLookupCache = lookupMap
  return lookupMap
}

// Find airport data by city name from airports JSON
function findAirportDataByCityName(cityName: string): any | null {
  const lookupMap = getAirportLookupMap()
  return lookupMap.get(cityName.toLowerCase()) || null
}

// Filter out past flights
function filterPastFlights(flights: JetSharingFlight[]): JetSharingFlight[] {
  const now = new Date()

  return flights.filter(flight => {
    const departureDateTime = new Date(`${flight.departureDate}T${flight.departureTime}`)

    // If the flight is today, check if departure time has passed
    if (flight.departureDate === now.toISOString().split('T')[0]) {
      return departureDateTime > now
    }

    // For future dates, include all flights
    return new Date(flight.departureDate) >= new Date(now.toISOString().split('T')[0])
  })
}

/**
 * Fetch static Jet Sharing flights from Supabase database
 * @param limit - Maximum number of flights to fetch (default 100)
 */
export async function getStaticJetSharingFlights(limit: number = 100): Promise<JetSharingFlight[]> {
  const { data, error } = await supabase
    .from('jet_sharing_flights')
    .select(`
      id,
      from_city_id,
      to_city_id,
      aircraft_id,
      departure_date,
      departure_time,
      total_seats,
      available_seats,
      price_per_seat,
      distance_nm,
      duration,
      status,
      is_featured,
      from_city:cities!jet_sharing_flights_from_city_id_fkey (
        id,
        name,
        country_code,
        image
      ),
      to_city:cities!jet_sharing_flights_to_city_id_fkey (
        id,
        name,
        country_code,
        image
      ),
      aircraft:aircraft!jet_sharing_flights_aircraft_id_fkey (
        id,
        name,
        slug,
        category,
        category_slug,
        image,
        passengers,
        range,
        speed
      )
    `)
    .eq('status', 'available')
    .gte('departure_date', new Date().toISOString().split('T')[0])
    .order('departure_date', { ascending: true })
    .limit(limit)

  if (error) {
    console.error('Error fetching jet sharing flights:', error)
    throw error
  }

  if (!data || data.length === 0) {
    return []
  }

  // Transform database records to JetSharingFlight objects
  const flights: JetSharingFlight[] = []

  for (const flight of data as unknown as JetSharingFlightDB[]) {
    // Skip if cities or aircraft data is missing
    if (!flight.from_city || !flight.to_city || !flight.aircraft) {
      console.warn(`Skipping flight ${flight.id}: missing city or aircraft data`)
      continue
    }

    // Find matching IATA codes for cities
    const fromAirportData = findAirportDataByCityName(flight.from_city.name)
    const toAirportData = findAirportDataByCityName(flight.to_city.name)

    // Create Airport objects
    const fromAirport: Airport = {
      city: flight.from_city.name,
      code: fromAirportData?.iata || flight.from_city.name.substring(0, 3).toUpperCase(),
      country: flight.from_city.country_code === 'US' ? 'United States' : flight.from_city.country_code,
      countryCode: flight.from_city.country_code,
      lat: fromAirportData?.lat || 0,
      lng: fromAirportData?.lon || 0,
      image: flight.from_city.image || undefined,
      timezone: CITY_TIMEZONES[flight.from_city.name] || 'UTC',
    }

    const toAirport: Airport = {
      city: flight.to_city.name,
      code: toAirportData?.iata || flight.to_city.name.substring(0, 3).toUpperCase(),
      country: flight.to_city.country_code === 'US' ? 'United States' : flight.to_city.country_code,
      countryCode: flight.to_city.country_code,
      lat: toAirportData?.lat || 0,
      lng: toAirportData?.lon || 0,
      image: flight.to_city.image || undefined,
      timezone: CITY_TIMEZONES[flight.to_city.name] || 'UTC',
    }

    // Convert duration format
    const flightDuration = convertDuration(flight.duration)

    // Calculate arrival time
    const arrivalTime = calculateArrivalTime(flight.departure_time, flightDuration)

    flights.push({
      id: flight.id,
      from: fromAirport,
      to: toAirport,
      departureDate: flight.departure_date,
      departureTime: flight.departure_time,
      arrivalTime,
      aircraft: {
        id: flight.aircraft.id,
        name: flight.aircraft.name,
        slug: flight.aircraft.slug,
        category: flight.aircraft.category,
        categorySlug: flight.aircraft.category_slug,
        image: flight.aircraft.image || '/placeholder-jet.jpg',
        passengers: flight.aircraft.passengers,
        range: flight.aircraft.range,
        speed: flight.aircraft.speed,
      },
      totalSeats: flight.total_seats,
      availableSeats: flight.available_seats,
      pricePerSeat: Number(flight.price_per_seat),
      flightDuration,
      status: flight.status as 'available' | 'full' | 'cancelled' | 'completed',
      isFeatured: flight.is_featured,
    })
  }

  // Filter out past flights and sort by departure date
  return filterPastFlights(flights)
}

// NOTE: getJetSharingFlightById is now defined in the HYBRID MODE section below

/**
 * Extract city name from "City, CODE" format
 */
function extractCityName(cityString: string): string {
  const commaIndex = cityString.indexOf(',')
  if (commaIndex > 0) {
    return cityString.substring(0, commaIndex).trim()
  }
  return cityString.trim()
}

/**
 * Filter Jet Sharing flights
 */
export function filterJetSharingFlights(
  flights: JetSharingFlight[],
  filters: {
    from?: string
    to?: string
    dateFrom?: string
    dateTo?: string
    maxPrice?: number
    minPrice?: number
    minSeats?: number
    category?: string
    categories?: string[]
  }
): JetSharingFlight[] {
  return flights.filter(flight => {
    // Filter by departure city
    if (filters.from) {
      const filterCity = extractCityName(filters.from).toLowerCase()
      const flightCity = flight.from.city.toLowerCase()
      if (!flightCity.includes(filterCity) && !filterCity.includes(flightCity)) {
        return false
      }
    }

    // Filter by destination city
    if (filters.to) {
      const filterCity = extractCityName(filters.to).toLowerCase()
      const flightCity = flight.to.city.toLowerCase()
      if (!flightCity.includes(filterCity) && !filterCity.includes(flightCity)) {
        return false
      }
    }

    // Filter by date from
    if (filters.dateFrom && flight.departureDate < filters.dateFrom) {
      return false
    }

    // Filter by date to
    if (filters.dateTo && flight.departureDate > filters.dateTo) {
      return false
    }

    // Filter by max price per seat
    if (filters.maxPrice && flight.pricePerSeat > filters.maxPrice) {
      return false
    }

    // Filter by min price per seat
    if (filters.minPrice && flight.pricePerSeat < filters.minPrice) {
      return false
    }

    // Filter by minimum available seats
    if (filters.minSeats && flight.availableSeats < filters.minSeats) {
      return false
    }

    // Filter by single category (legacy)
    if (filters.category && flight.aircraft.category !== filters.category) {
      return false
    }

    // Filter by multiple categories
    if (filters.categories && filters.categories.length > 0) {
      if (!filters.categories.includes(flight.aircraft.category)) {
        return false
      }
    }

    return true
  })
}

// ============================================================================
// HYBRID MODE: Combine Static + Dynamic Data
// ============================================================================

import { generateDynamicJetSharingFlights, getDynamicJetSharingFlightById } from './jetSharingDynamicGenerator'

/**
 * HYBRID: Get all flights (static from DB + dynamically generated)
 * @param limit - Maximum number of flights to return
 * @param mode - 'hybrid' (default), 'static', or 'dynamic'
 */
export async function getAllJetSharingFlights(
  limit: number = 100,
  mode: 'hybrid' | 'static' | 'dynamic' = 'hybrid'
): Promise<JetSharingFlight[]> {
  try {
    if (mode === 'static') {
      return await getStaticJetSharingFlights(limit)
    }

    if (mode === 'dynamic') {
      return await generateDynamicJetSharingFlights(limit)
    }

    // HYBRID MODE: Combine both sources
    const [staticFlights, dynamicFlights] = await Promise.all([
      getStaticJetSharingFlights(Math.floor(limit / 2)),
      generateDynamicJetSharingFlights(Math.floor(limit / 2)),
    ])

    // Combine and sort by date
    const allFlights = [...staticFlights, ...dynamicFlights]
    return allFlights.sort((a, b) =>
      new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime()
    )
  } catch (error) {
    console.error('Error in getAllJetSharingFlights:', error)
    // Fallback to dynamic generation if DB fails
    return await generateDynamicJetSharingFlights(limit)
  }
}

/**
 * HYBRID: Get flight by ID (try static first, then dynamic)
 */
export async function getJetSharingFlightById(id: string): Promise<JetSharingFlight | null> {
  // Check if it's a dynamic ID (starts with 'js-')
  if (id.startsWith('js-')) {
    return await getDynamicJetSharingFlightById(id)
  }

  // Otherwise, try to fetch from database
  try {
    const { data, error } = await supabase
      .from('jet_sharing_flights')
      .select(`
        id,
        from_city_id,
        to_city_id,
        aircraft_id,
        departure_date,
        departure_time,
        total_seats,
        available_seats,
        price_per_seat,
        distance_nm,
        duration,
        status,
        is_featured,
        from_city:cities!jet_sharing_flights_from_city_id_fkey (
          id,
          name,
          country_code,
          image
        ),
        to_city:cities!jet_sharing_flights_to_city_id_fkey (
          id,
          name,
          country_code,
          image
        ),
        aircraft:aircraft!jet_sharing_flights_aircraft_id_fkey (
          id,
          name,
          slug,
          category,
          category_slug,
          image,
          passengers,
          range,
          speed
        )
      `)
      .eq('id', id)
      .single()

    if (error || !data) {
      console.error('Error fetching jet sharing flight:', error)
      return null
    }

    const flight = data as unknown as JetSharingFlightDB

    if (!flight.from_city || !flight.to_city || !flight.aircraft) {
      return null
    }

    const fromAirportData = findAirportDataByCityName(flight.from_city.name)
    const toAirportData = findAirportDataByCityName(flight.to_city.name)

    const fromAirport: Airport = {
      city: flight.from_city.name,
      code: fromAirportData?.iata || flight.from_city.name.substring(0, 3).toUpperCase(),
      country: flight.from_city.country_code === 'US' ? 'United States' : flight.from_city.country_code,
      countryCode: flight.from_city.country_code,
      lat: fromAirportData?.lat || 0,
      lng: fromAirportData?.lon || 0,
      image: flight.from_city.image || undefined,
      timezone: CITY_TIMEZONES[flight.from_city.name] || 'UTC',
    }

    const toAirport: Airport = {
      city: flight.to_city.name,
      code: toAirportData?.iata || flight.to_city.name.substring(0, 3).toUpperCase(),
      country: flight.to_city.country_code === 'US' ? 'United States' : flight.to_city.country_code,
      countryCode: flight.to_city.country_code,
      lat: toAirportData?.lat || 0,
      lng: toAirportData?.lon || 0,
      image: flight.to_city.image || undefined,
      timezone: CITY_TIMEZONES[flight.to_city.name] || 'UTC',
    }

    const flightDuration = convertDuration(flight.duration)
    const arrivalTime = calculateArrivalTime(flight.departure_time, flightDuration)

    return {
      id: flight.id,
      from: fromAirport,
      to: toAirport,
      departureDate: flight.departure_date,
      departureTime: flight.departure_time,
      arrivalTime,
      aircraft: {
        id: flight.aircraft.id,
        name: flight.aircraft.name,
        slug: flight.aircraft.slug,
        category: flight.aircraft.category,
        categorySlug: flight.aircraft.category_slug,
        image: flight.aircraft.image || '/placeholder-jet.jpg',
        passengers: flight.aircraft.passengers,
        range: flight.aircraft.range,
        speed: flight.aircraft.speed,
      },
      totalSeats: flight.total_seats,
      availableSeats: flight.available_seats,
      pricePerSeat: Number(flight.price_per_seat),
      flightDuration,
      status: flight.status as 'available' | 'full' | 'cancelled' | 'completed',
      isFeatured: flight.is_featured,
    }
  } catch (error) {
    console.error('Error getting jet sharing flight by ID:', error)
    return null
  }
}
