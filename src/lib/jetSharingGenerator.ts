import { JetSharingFlight, Airport } from '@/types/jetSharing'
import { supabase } from './supabase'
import airportsData from '@/data/airports.json'
import { formatDateString } from './dateUtils'

// Type for routes from Supabase
interface JetSharingRouteDB {
  id: string
  from_city_id: string
  to_city_id: string
  aircraft_category: string
  distance_nm: number | null
  duration: string
  is_popular: boolean
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
}

// Timezone mapping for cities (IANA timezone identifiers)
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

  // Canada & Mexico
  'Toronto': 'America/Toronto',
  'Vancouver': 'America/Vancouver',
  'Montreal': 'America/Montreal',
  'Mexico City': 'America/Mexico_City',
  'Cancun': 'America/Cancun',

  // Europe - Western
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

  // Europe - Southern
  'Madrid': 'Europe/Madrid',
  'Barcelona': 'Europe/Madrid',
  'Rome': 'Europe/Rome',
  'Milan': 'Europe/Rome',
  'Venice': 'Europe/Rome',
  'Florence': 'Europe/Rome',
  'Athens': 'Europe/Athens',
  'Lisbon': 'Europe/Lisbon',
  'Nice': 'Europe/Paris',
  'Monaco': 'Europe/Monaco',
  'Ibiza': 'Europe/Madrid',

  // Europe - Eastern & Northern
  'Istanbul': 'Europe/Istanbul',
  'Moscow': 'Europe/Moscow',
  'Prague': 'Europe/Prague',
  'Warsaw': 'Europe/Warsaw',
  'Budapest': 'Europe/Budapest',
  'Copenhagen': 'Europe/Copenhagen',
  'Stockholm': 'Europe/Stockholm',
  'Oslo': 'Europe/Oslo',
  'Helsinki': 'Europe/Helsinki',

  // Middle East
  'Dubai': 'Asia/Dubai',
  'Abu Dhabi': 'Asia/Dubai',
  'Doha': 'Asia/Qatar',
  'Riyadh': 'Asia/Riyadh',
  'Tel Aviv': 'Asia/Jerusalem',
  'Cairo': 'Africa/Cairo',

  // Africa
  'Casablanca': 'Africa/Casablanca',
  'Cape Town': 'Africa/Johannesburg',
  'Johannesburg': 'Africa/Johannesburg',
  'Nairobi': 'Africa/Nairobi',

  // Asia - East
  'Tokyo': 'Asia/Tokyo',
  'Osaka': 'Asia/Tokyo',
  'Hong Kong': 'Asia/Hong_Kong',
  'Shanghai': 'Asia/Shanghai',
  'Beijing': 'Asia/Shanghai',
  'Seoul': 'Asia/Seoul',
  'Taipei': 'Asia/Taipei',

  // Asia - Southeast
  'Singapore': 'Asia/Singapore',
  'Bangkok': 'Asia/Bangkok',
  'Phuket': 'Asia/Bangkok',
  'Kuala Lumpur': 'Asia/Kuala_Lumpur',
  'Jakarta': 'Asia/Jakarta',
  'Bali': 'Asia/Makassar',
  'Manila': 'Asia/Manila',
  'Ho Chi Minh City': 'Asia/Ho_Chi_Minh',
  'Hanoi': 'Asia/Ho_Chi_Minh',

  // Asia - South
  'Mumbai': 'Asia/Kolkata',
  'Delhi': 'Asia/Kolkata',
  'Bangalore': 'Asia/Kolkata',
  'Colombo': 'Asia/Colombo',
  'Maldives': 'Indian/Maldives',
  'Malé': 'Indian/Maldives',

  // Oceania
  'Sydney': 'Australia/Sydney',
  'Melbourne': 'Australia/Melbourne',
  'Brisbane': 'Australia/Brisbane',
  'Perth': 'Australia/Perth',
  'Auckland': 'Pacific/Auckland',

  // South America
  'Sao Paulo': 'America/Sao_Paulo',
  'Rio de Janeiro': 'America/Sao_Paulo',
  'Buenos Aires': 'America/Argentina/Buenos_Aires',
  'Santiago': 'America/Santiago',
  'Lima': 'America/Lima',
  'Bogota': 'America/Bogota',

  // Caribbean
  'Nassau': 'America/Nassau',
  'Kingston': 'America/Jamaica',
  'San Juan': 'America/Puerto_Rico',
  'Panama City': 'America/Panama',
  'San Jose': 'America/Costa_Rica',
  'Providenciales': 'America/Grand_Turk',
  'Gustavia': 'America/St_Barthelemy',
  'Philipsburg': 'America/Lower_Princes',

  // Ski Resorts
  'Aspen': 'America/Denver',
}

// Convert duration to display format
function convertDuration(duration: string): string {
  // Database format: "1h 40min" or "52min"
  // Display format: "1h 40m" or "52m"
  return duration.replace(/min/g, 'm')
}

// Parse duration string to minutes
function parseDurationToMinutes(duration: string): number {
  // Handle ranges like "50-58m" - take average
  const rangeMatch = duration.match(/(\d+)-(\d+)\s*m/)
  if (rangeMatch) {
    return Math.round((parseInt(rangeMatch[1]) + parseInt(rangeMatch[2])) / 2)
  }

  // Handle "1h 40m" format
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

// Fetch jet sharing routes from Supabase
async function fetchJetSharingRoutesFromSupabase(limit: number = 100): Promise<JetSharingRouteDB[]> {
  const { data, error } = await supabase
    .from('jet_sharing_routes')
    .select(`
      id,
      from_city_id,
      to_city_id,
      aircraft_category,
      distance_nm,
      duration,
      is_popular,
      from_city:cities!jet_sharing_routes_from_city_id_fkey (
        id,
        name,
        country_code,
        image
      ),
      to_city:cities!jet_sharing_routes_to_city_id_fkey (
        id,
        name,
        country_code,
        image
      )
    `)
    .limit(limit)

  if (error) {
    console.error('Error fetching jet sharing routes:', error)
    throw error
  }

  return data as unknown as JetSharingRouteDB[]
}

// Filter out flights that have already departed
function filterPastFlights(flights: JetSharingFlight[]): JetSharingFlight[] {
  const now = new Date()
  const todayStr = formatDateString(now)

  return flights.filter(flight => {
    const departureDateTime = new Date(`${flight.departureDate}T${flight.departureTime}`)

    // If the flight is today, check if departure time has passed
    if (flight.departureDate === todayStr) {
      return departureDateTime > now
    }

    // For future dates, include all flights
    return flight.departureDate >= todayStr
  })
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
    // airports.json uses 'code' field for IATA code
    if (airport.city && airport.code && airport.lat && airport.lon) {
      // Use lowercase city name as key for case-insensitive lookup
      lookupMap.set(airport.city.toLowerCase(), airport)
    }
  }

  airportLookupCache = lookupMap
  return lookupMap
}

// City name aliases for airport lookup
// Maps city names from database to city names in airports-full.json
const CITY_ALIASES: Record<string, string> = {
  'New York City': 'New York',  // NYC → JFK/LGA/EWR
  'São Paulo': 'Sao Paulo',     // São Paulo → GRU
  'Frankfurt': 'Frankfurt-am-Main', // Frankfurt → FRA
  // Add more aliases as needed when cities don't match
}

// Find airport data by city name from airports JSON
function findAirportDataByCityName(cityName: string): any | null {
  const lookupMap = getAirportLookupMap()

  // Try original city name first
  let result = lookupMap.get(cityName.toLowerCase())
  if (result) return result

  // Try alias if exists
  const alias = CITY_ALIASES[cityName]
  if (alias) {
    result = lookupMap.get(alias.toLowerCase())
    if (result) return result
  }

  return null
}

// Seeded random number generator
function seededRandom(seed: number): () => number {
  let state = seed
  return () => {
    state = (state * 9301 + 49297) % 233280
    return state / 233280
  }
}

// Get seed from today's date
function getTodaySeed(): number {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const day = today.getDate()
  return year * 10000 + month * 100 + day
}

// Calculate price per seat based on distance and category
function calculatePricePerSeat(distanceNm: number, category: string, random: () => number): number {
  // Convert NM to miles for calculation (1 NM = 1.15078 miles)
  const distanceMiles = distanceNm * 1.15078

  // Base price per seat by category
  const basePricePerSeat: Record<string, number> = {
    'Turboprop': 300,
    'Very Light': 400,
    'Light': 600,
    'Super Light': 800,
    'Midsize': 1000,
    'Super Midsize': 1200,
    'Heavy': 1800,
    'Ultra Long Range': 2500,
  }

  // Price per mile by category
  const pricePerMile: Record<string, number> = {
    'Turboprop': 1.2,
    'Very Light': 1.5,
    'Light': 2.0,
    'Super Light': 2.5,
    'Midsize': 3.0,
    'Super Midsize': 3.5,
    'Heavy': 5.0,
    'Ultra Long Range': 7.0,
  }

  const basePrice = basePricePerSeat[category] || 600
  const ratePerMile = pricePerMile[category] || 2.0

  // Calculate: Base + (Distance × Rate)
  const calculatedPrice = basePrice + (ratePerMile * distanceMiles)

  // Add random variation ±15%
  const randomFactor = 0.85 + random() * 0.3 // Range: 0.85 to 1.15
  const finalPrice = Math.round(calculatedPrice * randomFactor)

  // Ensure minimum price
  return Math.max(300, finalPrice)
}

// Get seats count by category
function getSeatsByCategory(category: string, random: () => number): number {
  const seatsRange: Record<string, [number, number]> = {
    'Turboprop': [4, 6],
    'Very Light': [4, 6],
    'Light': [6, 8],
    'Super Light': [7, 9],
    'Midsize': [8, 10],
    'Super Midsize': [9, 12],
    'Heavy': [12, 16],
    'Ultra Long Range': [14, 19],
  }

  const [min, max] = seatsRange[category] || [6, 8]
  return min + Math.floor(random() * (max - min + 1))
}

// Generate future dates
// Минимум 2 дня вперед (не сегодня и не завтра)
// Пользователю нужно время на оформление билета и дорогу до аэропорта
function generateFutureDates(random: () => number, count: number): Date[] {
  const dates: Date[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < count; i++) {
    const daysAhead = 2 + Math.floor(random() * 13) // 2-14 days ahead (минимум послезавтра)
    const date = new Date(today)
    date.setDate(date.getDate() + daysAhead)
    dates.push(date)
  }

  return dates.sort((a, b) => a.getTime() - b.getTime())
}

// Generate departure times
function generateDepartureTime(random: () => number): string {
  const hours = 6 + Math.floor(random() * 14) // 6 AM to 8 PM
  const minutes = Math.floor(random() * 4) * 15 // 0, 15, 30, 45
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

/**
 * Generate all Jet Sharing flights (from routes in database)
 * Uses predefined routes from Supabase database
 * EXACTLY LIKE Empty Legs - dynamic generation only
 * @param count - Total number of flights to generate (default 100)
 */
export async function generateAllJetSharingFlights(count: number = 100): Promise<JetSharingFlight[]> {
  const seed = getTodaySeed()
  const random = seededRandom(seed)

  // Fetch routes and aircraft in parallel
  const [routes, { data: aircraftData }] = await Promise.all([
    fetchJetSharingRoutesFromSupabase(count),
    supabase
      .from('aircraft')
      .select('id, name, slug, category, category_slug, image, passengers, range, speed')
  ])

  if (!routes || routes.length === 0) {
    throw new Error('No jet sharing routes available')
  }

  if (!aircraftData || aircraftData.length === 0) {
    throw new Error('No aircraft data available')
  }

  // Generate dates
  const dates = generateFutureDates(random, routes.length)

  // Generate flights from database routes
  const flights: JetSharingFlight[] = []

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i]

    // Skip if cities data is missing
    if (!route.from_city || !route.to_city) {
      console.warn(`Skipping route ${route.id}: missing city data`)
      continue
    }

    // Find matching IATA codes for cities (for airport data)
    const fromAirportData = findAirportDataByCityName(route.from_city.name)
    const toAirportData = findAirportDataByCityName(route.to_city.name)

    // Create Airport objects
    const fromAirport: Airport = {
      city: route.from_city.name,
      code: fromAirportData?.code || route.from_city.name.substring(0, 3).toUpperCase(),
      country: route.from_city.country_code === 'US' ? 'United States' : route.from_city.country_code,
      countryCode: route.from_city.country_code,
      lat: fromAirportData?.lat || 0,
      lng: fromAirportData?.lon || 0,
      image: route.from_city.image || undefined,
      timezone: CITY_TIMEZONES[route.from_city.name] || 'UTC',
    }

    const toAirport: Airport = {
      city: route.to_city.name,
      code: toAirportData?.code || route.to_city.name.substring(0, 3).toUpperCase(),
      country: route.to_city.country_code === 'US' ? 'United States' : route.to_city.country_code,
      countryCode: route.to_city.country_code,
      lat: toAirportData?.lat || 0,
      lng: toAirportData?.lon || 0,
      image: route.to_city.image || undefined,
      timezone: CITY_TIMEZONES[route.to_city.name] || 'UTC',
    }

    // Select aircraft from the specified category
    const categoryAircraft = aircraftData.filter(a => a.category === route.aircraft_category)
    const aircraft = categoryAircraft.length > 0
      ? categoryAircraft[Math.floor(random() * categoryAircraft.length)]
      : aircraftData[Math.floor(random() * aircraftData.length)]

    // Use the distance from route (already in nautical miles)
    const distanceNm = route.distance_nm || 0

    // Calculate price per seat
    const pricePerSeat = calculatePricePerSeat(distanceNm, aircraft.category, random)

    // Get total seats for this aircraft
    const totalSeats = getSeatsByCategory(aircraft.category, random)

    // Random available seats (20-80% of total)
    const availableSeats = Math.max(1, Math.floor(totalSeats * (0.2 + random() * 0.6)))

    // Use the duration from the route data (convert from Russian format)
    const flightDuration = convertDuration(route.duration)

    // Generate departure time and calculate arrival time
    const departureTime = generateDepartureTime(random)
    const arrivalTime = calculateArrivalTime(departureTime, flightDuration)

    // Generate flight with stable ID using route UUID
    flights.push({
      id: `js-${seed}-${route.id}`,
      from: fromAirport,
      to: toAirport,
      departureDate: formatDateString(dates[i % dates.length]),
      departureTime,
      arrivalTime,
      aircraft: {
        id: aircraft.id,
        name: aircraft.name,
        slug: aircraft.slug,
        category: aircraft.category,
        categorySlug: aircraft.category_slug,
        image: aircraft.image || '/placeholder-jet.jpg',
        passengers: aircraft.passengers,
        range: aircraft.range,
        speed: aircraft.speed,
      },
      totalSeats,
      availableSeats,
      pricePerSeat,
      flightDuration,
      status: 'available',
      isFeatured: random() > 0.85, // 15% chance to be featured
    })
  }

  // Sort by departure date and filter out past flights
  const sorted = flights.sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime())
  return filterPastFlights(sorted)
}

/**
 * Generate future dates with a specific seed
 */
function generateFutureDatesWithSeed(random: () => number, count: number, seed: number): Date[] {
  const dates: Date[] = []
  // Convert seed to date (format: YYYYMMDD)
  const year = Math.floor(seed / 10000)
  const month = Math.floor((seed % 10000) / 100) - 1
  const day = seed % 100
  const baseDate = new Date(year, month, day)
  baseDate.setHours(0, 0, 0, 0)

  for (let i = 0; i < count; i++) {
    const daysAhead = 2 + Math.floor(random() * 13)
    const date = new Date(baseDate)
    date.setDate(date.getDate() + daysAhead)
    dates.push(date)
  }

  return dates.sort((a, b) => a.getTime() - b.getTime())
}

/**
 * Generate all Jet Sharing flights with a specific seed (for ID lookup)
 */
async function generateAllJetSharingFlightsWithSeed(count: number, seed: number): Promise<JetSharingFlight[]> {
  const random = seededRandom(seed)

  // Fetch routes and aircraft in parallel
  const [routes, { data: aircraftData }] = await Promise.all([
    fetchJetSharingRoutesFromSupabase(count),
    supabase
      .from('aircraft')
      .select('id, name, slug, category, category_slug, image, passengers, range, speed')
  ])

  if (!routes || routes.length === 0) {
    return []
  }

  if (!aircraftData || aircraftData.length === 0) {
    return []
  }

  // Generate dates using the provided seed
  const dates = generateFutureDatesWithSeed(random, routes.length, seed)

  // Generate flights from database routes
  const flights: JetSharingFlight[] = []

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i]

    if (!route.from_city || !route.to_city) {
      continue
    }

    const fromAirportData = findAirportDataByCityName(route.from_city.name)
    const toAirportData = findAirportDataByCityName(route.to_city.name)

    const fromAirport: Airport = {
      city: route.from_city.name,
      code: fromAirportData?.code || route.from_city.name.substring(0, 3).toUpperCase(),
      country: route.from_city.country_code === 'US' ? 'United States' : route.from_city.country_code,
      countryCode: route.from_city.country_code,
      lat: fromAirportData?.lat || 0,
      lng: fromAirportData?.lon || 0,
      image: route.from_city.image || undefined,
      timezone: CITY_TIMEZONES[route.from_city.name] || 'UTC',
    }

    const toAirport: Airport = {
      city: route.to_city.name,
      code: toAirportData?.code || route.to_city.name.substring(0, 3).toUpperCase(),
      country: route.to_city.country_code === 'US' ? 'United States' : route.to_city.country_code,
      countryCode: route.to_city.country_code,
      lat: toAirportData?.lat || 0,
      lng: toAirportData?.lon || 0,
      image: route.to_city.image || undefined,
      timezone: CITY_TIMEZONES[route.to_city.name] || 'UTC',
    }

    const categoryAircraft = aircraftData.filter(a => a.category === route.aircraft_category)
    const aircraft = categoryAircraft.length > 0
      ? categoryAircraft[Math.floor(random() * categoryAircraft.length)]
      : aircraftData[Math.floor(random() * aircraftData.length)]

    const distanceNm = route.distance_nm || 0
    const pricePerSeat = calculatePricePerSeat(distanceNm, aircraft.category, random)
    const totalSeats = getSeatsByCategory(aircraft.category, random)
    const availableSeats = Math.max(1, Math.floor(totalSeats * (0.2 + random() * 0.6)))
    const flightDuration = convertDuration(route.duration)
    const departureTime = generateDepartureTime(random)
    const arrivalTime = calculateArrivalTime(departureTime, flightDuration)

    flights.push({
      id: `js-${seed}-${route.id}`,
      from: fromAirport,
      to: toAirport,
      departureDate: formatDateString(dates[i % dates.length]),
      departureTime,
      arrivalTime,
      aircraft: {
        id: aircraft.id,
        name: aircraft.name,
        slug: aircraft.slug,
        category: aircraft.category,
        categorySlug: aircraft.category_slug,
        image: aircraft.image || '/placeholder-jet.jpg',
        passengers: aircraft.passengers,
        range: aircraft.range,
        speed: aircraft.speed,
      },
      totalSeats,
      availableSeats,
      pricePerSeat,
      flightDuration,
      status: 'available',
      isFeatured: random() > 0.85,
    })
  }

  return flights
}

/**
 * Get a specific Jet Sharing flight by ID
 * @param id - Flight ID in format "js-{seed}-{route_uuid}"
 */
export async function getJetSharingFlightById(id: string): Promise<JetSharingFlight | null> {
  try {
    // Validate ID format: js-{seed}-{uuid}
    if (!id.startsWith('js-')) {
      return null
    }

    // Extract seed from ID to ensure we generate with the same seed
    const parts = id.split('-')
    if (parts.length < 3) {
      return null
    }
    const seedFromId = parseInt(parts[1])

    // Generate flights with the seed from the ID
    const allFlights = await generateAllJetSharingFlightsWithSeed(100, seedFromId)

    // Find the flight with matching ID
    return allFlights.find(flight => flight.id === id) || null
  } catch (error) {
    console.error('Error getting jet sharing flight by ID:', error)
    return null
  }
}

/**
 * Extract city name from "City, CODE" format
 */
function extractCityName(cityString: string): string {
  // If format is "City, CODE", extract just the city part
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
