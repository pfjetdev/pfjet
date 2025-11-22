import { JetSharingFlight, Airport } from '@/types/jetSharing'
import { supabase } from './supabase'
import airportsData from '@/data/airports-full.json'

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

// Timezone mapping (reuse from emptyLegsGenerator)
const CITY_TIMEZONES: Record<string, string> = {
  'New York': 'America/New_York',
  'Los Angeles': 'America/Los_Angeles',
  'Miami': 'America/New_York',
  'Las Vegas': 'America/Los_Angeles',
  'Chicago': 'America/Chicago',
  'San Francisco': 'America/Los_Angeles',
  'Boston': 'America/New_York',
  'Dallas': 'America/Chicago',
  'Houston': 'America/Chicago',
  'London': 'Europe/London',
  'Paris': 'Europe/Paris',
  'Amsterdam': 'Europe/Amsterdam',
  'Nice': 'Europe/Paris',
  'Geneva': 'Europe/Zurich',
  'Zurich': 'Europe/Zurich',
  'Milan': 'Europe/Rome',
  'Barcelona': 'Europe/Madrid',
  'Dubai': 'Asia/Dubai',
  'Tokyo': 'Asia/Tokyo',
  'Singapore': 'Asia/Singapore',
  'Hong Kong': 'Asia/Hong_Kong',
}

// Cache для airport lookup
let airportLookupCache: Map<string, any> | null = null

function getAirportLookupMap(): Map<string, any> {
  if (airportLookupCache) return airportLookupCache

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

function findAirportDataByCityName(cityName: string): any | null {
  const lookupMap = getAirportLookupMap()
  return lookupMap.get(cityName.toLowerCase()) || null
}

// Seeded random number generator
function seededRandom(seed: number): () => number {
  let state = seed
  return () => {
    state = (state * 9301 + 49297) % 233280
    return state / 233280
  }
}

// Fallback routes when database is empty (same as before)
const FALLBACK_ROUTES = [
  // US Routes
  { from: 'New York', to: 'Miami', category: 'Light' },
  { from: 'Miami', to: 'New York', category: 'Light' },
  { from: 'Los Angeles', to: 'Las Vegas', category: 'Very Light' },
  { from: 'Las Vegas', to: 'Los Angeles', category: 'Very Light' },
  { from: 'San Francisco', to: 'Los Angeles', category: 'Very Light' },
  { from: 'Los Angeles', to: 'San Francisco', category: 'Very Light' },
  { from: 'New York', to: 'Boston', category: 'Very Light' },
  { from: 'Boston', to: 'New York', category: 'Very Light' },
  { from: 'Chicago', to: 'New York', category: 'Midsize' },
  { from: 'New York', to: 'Chicago', category: 'Midsize' },
  // European Routes
  { from: 'London', to: 'Paris', category: 'Very Light' },
  { from: 'Paris', to: 'London', category: 'Very Light' },
  { from: 'Paris', to: 'Nice', category: 'Very Light' },
  { from: 'Nice', to: 'Paris', category: 'Very Light' },
  { from: 'Geneva', to: 'Paris', category: 'Very Light' },
  { from: 'Paris', to: 'Geneva', category: 'Very Light' },
  { from: 'Milan', to: 'Paris', category: 'Light' },
  { from: 'Barcelona', to: 'Paris', category: 'Light' },
  // Transatlantic
  { from: 'New York', to: 'London', category: 'Heavy' },
  { from: 'London', to: 'New York', category: 'Heavy' },
]

// Fetch jet sharing routes from Supabase
async function fetchJetSharingRoutesFromSupabase(limit: number = 100): Promise<JetSharingRouteDB[]> {
  try {
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
      return []
    }

    return (data as unknown as JetSharingRouteDB[]) || []
  } catch (error) {
    console.error('Error in fetchJetSharingRoutesFromSupabase:', error)
    return []
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

// Calculate distance using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959 // Earth's radius in miles
  const lat1Rad = lat1 * Math.PI / 180
  const lat2Rad = lat2 * Math.PI / 180
  const deltaLat = (lat2 - lat1) * Math.PI / 180
  const deltaLng = (lng2 - lng1) * Math.PI / 180

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Calculate flight duration based on distance
function calculateFlightDuration(distanceMiles: number): string {
  const cruiseSpeed = 480 // mph
  let totalFlightTime = distanceMiles / cruiseSpeed

  // Add taxi, climb, descent time
  if (distanceMiles < 500) {
    totalFlightTime += 0.5
  } else if (distanceMiles < 2000) {
    totalFlightTime += 0.75
  } else {
    totalFlightTime += 1.0
  }

  const hours = Math.floor(totalFlightTime)
  const minutes = Math.round((totalFlightTime - hours) * 60)

  if (hours === 0) {
    return `${minutes}m`
  }
  return `${hours}h ${minutes}m`
}

// Calculate price per seat based on distance and category
function calculatePricePerSeat(distanceMiles: number, category: string, random: () => number): number {
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

// Generate departure time
function generateDepartureTime(random: () => number): string {
  const hours = 6 + Math.floor(random() * 14) // 6 AM to 8 PM
  const minutes = Math.floor(random() * 4) * 15 // 0, 15, 30, 45
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

// Parse duration to minutes
function parseDurationToMinutes(duration: string): number {
  const hoursMatch = duration.match(/(\d+)\s*h/)
  const minutesMatch = duration.match(/(\d+)\s*m/)

  let totalMinutes = 0
  if (hoursMatch) totalMinutes += parseInt(hoursMatch[1]) * 60
  if (minutesMatch) totalMinutes += parseInt(minutesMatch[1])

  return totalMinutes || 60
}

// Calculate arrival time
function calculateArrivalTime(departureTime: string, duration: string): string {
  const durationMinutes = parseDurationToMinutes(duration)
  const [hours, minutes] = departureTime.split(':').map(Number)

  const departure = new Date()
  departure.setHours(hours, minutes, 0, 0)

  const arrival = new Date(departure.getTime() + durationMinutes * 60000)

  const arrivalHours = arrival.getHours().toString().padStart(2, '0')
  const arrivalMinutes = arrival.getMinutes().toString().padStart(2, '0')

  return `${arrivalHours}:${arrivalMinutes}`
}

// Filter past flights
function filterPastFlights(flights: JetSharingFlight[]): JetSharingFlight[] {
  const now = new Date()

  return flights.filter(flight => {
    const departureDateTime = new Date(`${flight.departureDate}T${flight.departureTime}`)

    if (flight.departureDate === now.toISOString().split('T')[0]) {
      return departureDateTime > now
    }

    return new Date(flight.departureDate) >= new Date(now.toISOString().split('T')[0])
  })
}

/**
 * Динамическая генерация рейсов Jet Sharing на основе seed
 * Использует маршруты из базы данных (ТОЧНО КАК Empty Legs)
 * Fallback на hardcoded маршруты если база пуста
 * Генерирует рейсы на ближайшие 2 недели
 *
 * ВАЖНО: Каждый маршрут = 1 рейс (как в Empty Legs)
 * Если в базе 7 маршрутов, будет 7 рейсов
 */
export async function generateDynamicJetSharingFlights(count: number = 50): Promise<JetSharingFlight[]> {
  const seed = getTodaySeed()
  const random = seededRandom(seed)

  // Fetch routes from database (как в Empty Legs - берем ВСЕ маршруты)
  const dbRoutes = await fetchJetSharingRoutesFromSupabase(count)

  // Determine which routes to use
  const routes = dbRoutes && dbRoutes.length > 0 ? dbRoutes : null

  if (!routes) {
    console.warn('⚠️  No routes in database, using fallback routes. Please run migration script.')
  }

  // Use fallback routes if database is empty
  const useDatabase = routes !== null

  // Fetch aircraft from database
  const { data: aircraftData } = await supabase
    .from('aircraft')
    .select('id, name, slug, category, category_slug, image, passengers, range, speed')

  if (!aircraftData || aircraftData.length === 0) {
    throw new Error('No aircraft data available')
  }

  // Determine which routes array to use
  const routesToUse = useDatabase ? routes : FALLBACK_ROUTES

  // Generate dates based on NUMBER OF ROUTES (как в Empty Legs)
  const dates = generateFutureDates(random, routesToUse.length)

  const flights: JetSharingFlight[] = []

  // ВАЖНО: Цикл по КАЖДОМУ МАРШРУТУ (как в Empty Legs)
  // Каждый маршрут генерирует ОДИН рейс
  for (let i = 0; i < routesToUse.length; i++) {
    let fromCityName: string
    let toCityName: string
    let category: string
    let routeId: string
    let storedDuration: string | null = null

    if (useDatabase) {
      // Use database route
      const route = routes![i]  // Берем i-й маршрут, НЕ случайный!
      fromCityName = route.from_city.name
      toCityName = route.to_city.name
      category = route.aircraft_category
      routeId = route.id
      storedDuration = route.duration
    } else {
      // Use fallback route
      const route = FALLBACK_ROUTES[i]  // Берем i-й маршрут, НЕ случайный!
      fromCityName = route.from
      toCityName = route.to
      category = route.category
      // Generate deterministic ID for fallback routes
      routeId = `fallback-${route.from}-${route.to}`.toLowerCase().replace(/\s+/g, '-')
    }

    // Find airport data for cities
    const fromAirportData = findAirportDataByCityName(fromCityName)
    const toAirportData = findAirportDataByCityName(toCityName)

    if (!fromAirportData || !toAirportData) {
      console.warn(`Skipping route: ${fromCityName} → ${toCityName} (airport data not found)`)
      continue
    }

    // Create Airport objects
    const fromAirport: Airport = {
      city: fromCityName,
      code: fromAirportData.iata,
      country: fromAirportData.country === 'US' ? 'United States' : fromAirportData.country,
      countryCode: fromAirportData.country,
      lat: fromAirportData.lat,
      lng: fromAirportData.lon,
      timezone: CITY_TIMEZONES[fromCityName] || 'UTC',
    }

    const toAirport: Airport = {
      city: toCityName,
      code: toAirportData.iata,
      country: toAirportData.country === 'US' ? 'United States' : toAirportData.country,
      countryCode: toAirportData.country,
      lat: toAirportData.lat,
      lng: toAirportData.lon,
      timezone: CITY_TIMEZONES[toCityName] || 'UTC',
    }

    // Select aircraft from category
    const categoryAircraft = aircraftData.filter(a => a.category === category)
    const aircraft = categoryAircraft.length > 0
      ? categoryAircraft[Math.floor(random() * categoryAircraft.length)]
      : aircraftData[Math.floor(random() * aircraftData.length)]

    // Calculate distance and duration
    const distanceMiles = calculateDistance(
      fromAirport.lat, fromAirport.lng,
      toAirport.lat, toAirport.lng
    )
    const duration = storedDuration || calculateFlightDuration(distanceMiles)

    // Calculate price per seat
    const pricePerSeat = calculatePricePerSeat(distanceMiles, aircraft.category, random)

    // Get total seats for this aircraft
    const totalSeats = getSeatsByCategory(aircraft.category, random)

    // Random available seats (20-80% of total)
    const availableSeats = Math.max(1, Math.floor(totalSeats * (0.2 + random() * 0.6)))

    // Generate times
    const departureTime = generateDepartureTime(random)
    const arrivalTime = calculateArrivalTime(departureTime, duration)

    // Generate departure date
    const departureDate = dates[i % dates.length].toISOString().split('T')[0]

    // Create ID using route UUID (КАК В EMPTY LEGS - БЕЗ индекса!)
    // Format: js-{seed}-{routeUUID}
    const flightId = `js-${seed}-${routeId}`

    flights.push({
      id: flightId,
      from: fromAirport,
      to: toAirport,
      departureDate,
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
      flightDuration: duration,
      status: 'available',
      isFeatured: random() > 0.85, // 15% chance to be featured
    })
  }

  return filterPastFlights(flights)
}

/**
 * Получить рейс по ID из динамически сгенерированных данных
 */
export async function getDynamicJetSharingFlightById(id: string): Promise<JetSharingFlight | null> {
  try {
    // Validate ID format
    if (!id.startsWith('js-')) {
      return null
    }

    // Generate all flights for today's seed
    const allFlights = await generateDynamicJetSharingFlights(50)

    // Find matching flight
    return allFlights.find(flight => flight.id === id) || null
  } catch (error) {
    console.error('Error getting dynamic jet sharing flight by ID:', error)
    return null
  }
}
