import { EmptyLeg, Airport } from '@/types/emptyLegs'
import { supabase } from './supabase'
import airportsData from '@/data/airports-full.json'
import { formatDateString } from './dateUtils'
import { unstable_cache } from 'next/cache'

// Type for routes from Supabase
interface EmptyLegRouteDB {
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

// Convert 24-hour time to 12-hour AM/PM format
export function convertTo12Hour(time24: string): string {
  const [hours, minutes] = time24.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const hours12 = hours % 12 || 12 // Convert 0 to 12 for midnight
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`
}

// Get timezone abbreviation from IANA timezone
export function getTimezoneAbbr(timezone: string): string {
  try {
    const date = new Date()
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      timeZoneName: 'short'
    }
    const formatted = new Intl.DateTimeFormat('en-US', options).format(date)
    const match = formatted.match(/\b[A-Z]{3,5}\b/)
    return match ? match[0] : ''
  } catch (error) {
    return ''
  }
}

// Convert duration to display format
// Database already stores in correct format (e.g., "1h 40min", "52min")
// Just normalize the format for display
function convertDuration(duration: string): string {
  // Database format: "1h 40min" or "52min"
  // Display format: "1h 40m" or "52m"
  return duration.replace(/min/g, 'm')
}

// Parse duration string to minutes (e.g., "1h 40m" -> 100, "50m" -> 50, "50-58m" -> 54)
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

// Fetch empty leg routes from Supabase (inner function)
async function fetchEmptyLegRoutesFromSupabaseInner(limit: number = 100): Promise<EmptyLegRouteDB[]> {
  const { data, error } = await supabase
    .from('empty_leg_routes')
    .select(`
      id,
      from_city_id,
      to_city_id,
      aircraft_category,
      distance_nm,
      duration,
      is_popular,
      from_city:cities!empty_leg_routes_from_city_id_fkey (
        id,
        name,
        country_code,
        image
      ),
      to_city:cities!empty_leg_routes_to_city_id_fkey (
        id,
        name,
        country_code,
        image
      )
    `)
    .limit(limit)

  if (error) {
    console.error('Error fetching empty leg routes:', error)
    throw error
  }

  return data as unknown as EmptyLegRouteDB[]
}

// Cached version - revalidates every hour
const fetchEmptyLegRoutesFromSupabase = unstable_cache(
  fetchEmptyLegRoutesFromSupabaseInner,
  ['empty-leg-routes'],
  { revalidate: 3600 }
)

// Aircraft data type
interface AircraftDB {
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

// Fetch aircraft data (inner function)
async function fetchAircraftDataInner(): Promise<AircraftDB[]> {
  const { data, error } = await supabase
    .from('aircraft')
    .select('id, name, slug, category, category_slug, image, passengers, range, speed')

  if (error) {
    console.error('Error fetching aircraft:', error)
    return []
  }

  return data || []
}

// Cached version - revalidates every hour
const fetchAircraftData = unstable_cache(
  fetchAircraftDataInner,
  ['aircraft-data'],
  { revalidate: 3600 }
)

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
}

// Filter out flights that have already departed
function filterPastFlights(emptyLegs: EmptyLeg[]): EmptyLeg[] {
  const now = new Date()
  const todayStr = formatDateString(now)

  return emptyLegs.filter(leg => {
    const departureDateTime = new Date(`${leg.departureDate}T${leg.departureTime}`)

    // If the flight is today, check if departure time has passed
    if (leg.departureDate === todayStr) {
      return departureDateTime > now
    }

    // For future dates, include all flights
    return leg.departureDate >= todayStr
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
    if (airport.city && airport.iata && airport.lat && airport.lon) {
      // Use lowercase city name as key for case-insensitive lookup
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

// Popular routes and cities for Empty Legs - 100 major destinations worldwide
const MAJOR_AIRPORTS: Airport[] = [
  // North America - United States
  { city: 'New York', code: 'JFK', country: 'United States', countryCode: 'US', lat: 40.6413, lng: -73.7781 },
  { city: 'Los Angeles', code: 'LAX', country: 'United States', countryCode: 'US', lat: 33.9416, lng: -118.4085 },
  { city: 'Miami', code: 'MIA', country: 'United States', countryCode: 'US', lat: 25.7959, lng: -80.2870 },
  { city: 'Las Vegas', code: 'LAS', country: 'United States', countryCode: 'US', lat: 36.0840, lng: -115.1537 },
  { city: 'Chicago', code: 'ORD', country: 'United States', countryCode: 'US', lat: 41.9742, lng: -87.9073 },
  { city: 'San Francisco', code: 'SFO', country: 'United States', countryCode: 'US', lat: 37.6213, lng: -122.3790 },
  { city: 'Boston', code: 'BOS', country: 'United States', countryCode: 'US', lat: 42.3656, lng: -71.0096 },
  { city: 'Seattle', code: 'SEA', country: 'United States', countryCode: 'US', lat: 47.4502, lng: -122.3088 },
  { city: 'Washington', code: 'DCA', country: 'United States', countryCode: 'US', lat: 38.8521, lng: -77.0377 },
  { city: 'Atlanta', code: 'ATL', country: 'United States', countryCode: 'US', lat: 33.6407, lng: -84.4277 },
  { city: 'Dallas', code: 'DFW', country: 'United States', countryCode: 'US', lat: 32.8998, lng: -97.0403 },
  { city: 'Houston', code: 'IAH', country: 'United States', countryCode: 'US', lat: 29.9902, lng: -95.3368 },
  { city: 'Phoenix', code: 'PHX', country: 'United States', countryCode: 'US', lat: 33.4373, lng: -112.0078 },
  { city: 'Denver', code: 'DEN', country: 'United States', countryCode: 'US', lat: 39.8561, lng: -104.6737 },
  { city: 'Orlando', code: 'MCO', country: 'United States', countryCode: 'US', lat: 28.4312, lng: -81.3081 },

  // North America - Canada & Mexico
  { city: 'Toronto', code: 'YYZ', country: 'Canada', countryCode: 'CA', lat: 43.6777, lng: -79.6248 },
  { city: 'Vancouver', code: 'YVR', country: 'Canada', countryCode: 'CA', lat: 49.1939, lng: -123.1844 },
  { city: 'Montreal', code: 'YUL', country: 'Canada', countryCode: 'CA', lat: 45.4657, lng: -73.7455 },
  { city: 'Mexico City', code: 'MEX', country: 'Mexico', countryCode: 'MX', lat: 19.4363, lng: -99.0721 },
  { city: 'Cancun', code: 'CUN', country: 'Mexico', countryCode: 'MX', lat: 21.0365, lng: -86.8771 },

  // Europe - Western
  { city: 'London', code: 'LHR', country: 'United Kingdom', countryCode: 'GB', lat: 51.4700, lng: -0.4543 },
  { city: 'Paris', code: 'CDG', country: 'France', countryCode: 'FR', lat: 49.0097, lng: 2.5479 },
  { city: 'Amsterdam', code: 'AMS', country: 'Netherlands', countryCode: 'NL', lat: 52.3105, lng: 4.7683 },
  { city: 'Brussels', code: 'BRU', country: 'Belgium', countryCode: 'BE', lat: 50.9010, lng: 4.4856 },
  { city: 'Frankfurt', code: 'FRA', country: 'Germany', countryCode: 'DE', lat: 50.0379, lng: 8.5622 },
  { city: 'Munich', code: 'MUC', country: 'Germany', countryCode: 'DE', lat: 48.3538, lng: 11.7861 },
  { city: 'Berlin', code: 'BER', country: 'Germany', countryCode: 'DE', lat: 52.3667, lng: 13.5033 },
  { city: 'Zurich', code: 'ZRH', country: 'Switzerland', countryCode: 'CH', lat: 47.4582, lng: 8.5481 },
  { city: 'Geneva', code: 'GVA', country: 'Switzerland', countryCode: 'CH', lat: 46.2381, lng: 6.1090 },
  { city: 'Vienna', code: 'VIE', country: 'Austria', countryCode: 'AT', lat: 48.1103, lng: 16.5697 },

  // Europe - Southern
  { city: 'Madrid', code: 'MAD', country: 'Spain', countryCode: 'ES', lat: 40.4719, lng: -3.5626 },
  { city: 'Barcelona', code: 'BCN', country: 'Spain', countryCode: 'ES', lat: 41.2974, lng: 2.0833 },
  { city: 'Rome', code: 'FCO', country: 'Italy', countryCode: 'IT', lat: 41.8003, lng: 12.2389 },
  { city: 'Milan', code: 'MXP', country: 'Italy', countryCode: 'IT', lat: 45.6306, lng: 8.7281 },
  { city: 'Venice', code: 'VCE', country: 'Italy', countryCode: 'IT', lat: 45.5053, lng: 12.3519 },
  { city: 'Florence', code: 'FLR', country: 'Italy', countryCode: 'IT', lat: 43.8100, lng: 11.2051 },
  { city: 'Athens', code: 'ATH', country: 'Greece', countryCode: 'GR', lat: 37.9364, lng: 23.9445 },
  { city: 'Lisbon', code: 'LIS', country: 'Portugal', countryCode: 'PT', lat: 38.7813, lng: -9.1361 },
  { city: 'Nice', code: 'NCE', country: 'France', countryCode: 'FR', lat: 43.6584, lng: 7.2159 },
  { city: 'Monaco', code: 'MCM', country: 'Monaco', countryCode: 'MC', lat: 43.7384, lng: 7.4246 },

  // Europe - Eastern & Northern
  { city: 'Istanbul', code: 'IST', country: 'Turkey', countryCode: 'TR', lat: 41.2753, lng: 28.7519 },
  { city: 'Moscow', code: 'SVO', country: 'Russia', countryCode: 'RU', lat: 55.9726, lng: 37.4146 },
  { city: 'Prague', code: 'PRG', country: 'Czech Republic', countryCode: 'CZ', lat: 50.1008, lng: 14.2600 },
  { city: 'Warsaw', code: 'WAW', country: 'Poland', countryCode: 'PL', lat: 52.1657, lng: 20.9671 },
  { city: 'Budapest', code: 'BUD', country: 'Hungary', countryCode: 'HU', lat: 47.4367, lng: 19.2556 },
  { city: 'Copenhagen', code: 'CPH', country: 'Denmark', countryCode: 'DK', lat: 55.6180, lng: 12.6508 },
  { city: 'Stockholm', code: 'ARN', country: 'Sweden', countryCode: 'SE', lat: 59.6519, lng: 17.9186 },
  { city: 'Oslo', code: 'OSL', country: 'Norway', countryCode: 'NO', lat: 60.1939, lng: 11.1004 },
  { city: 'Helsinki', code: 'HEL', country: 'Finland', countryCode: 'FI', lat: 60.3172, lng: 24.9633 },

  // Middle East & Africa
  { city: 'Dubai', code: 'DXB', country: 'United Arab Emirates', countryCode: 'AE', lat: 25.2532, lng: 55.3657 },
  { city: 'Abu Dhabi', code: 'AUH', country: 'United Arab Emirates', countryCode: 'AE', lat: 24.4330, lng: 54.6511 },
  { city: 'Doha', code: 'DOH', country: 'Qatar', countryCode: 'QA', lat: 25.2731, lng: 51.6080 },
  { city: 'Riyadh', code: 'RUH', country: 'Saudi Arabia', countryCode: 'SA', lat: 24.9578, lng: 46.6988 },
  { city: 'Tel Aviv', code: 'TLV', country: 'Israel', countryCode: 'IL', lat: 32.0114, lng: 34.8867 },
  { city: 'Cairo', code: 'CAI', country: 'Egypt', countryCode: 'EG', lat: 30.1219, lng: 31.4056 },
  { city: 'Casablanca', code: 'CMN', country: 'Morocco', countryCode: 'MA', lat: 33.3676, lng: -7.5898 },
  { city: 'Cape Town', code: 'CPT', country: 'South Africa', countryCode: 'ZA', lat: -33.9715, lng: 18.6021 },
  { city: 'Johannesburg', code: 'JNB', country: 'South Africa', countryCode: 'ZA', lat: -26.1392, lng: 28.2460 },
  { city: 'Nairobi', code: 'NBO', country: 'Kenya', countryCode: 'KE', lat: -1.3192, lng: 36.9278 },

  // Asia - East
  { city: 'Tokyo', code: 'NRT', country: 'Japan', countryCode: 'JP', lat: 35.7720, lng: 140.3929 },
  { city: 'Osaka', code: 'KIX', country: 'Japan', countryCode: 'JP', lat: 34.4273, lng: 135.2444 },
  { city: 'Hong Kong', code: 'HKG', country: 'Hong Kong', countryCode: 'HK', lat: 22.3080, lng: 113.9185 },
  { city: 'Shanghai', code: 'PVG', country: 'China', countryCode: 'CN', lat: 31.1443, lng: 121.8083 },
  { city: 'Beijing', code: 'PEK', country: 'China', countryCode: 'CN', lat: 40.0799, lng: 116.6031 },
  { city: 'Seoul', code: 'ICN', country: 'South Korea', countryCode: 'KR', lat: 37.4602, lng: 126.4407 },
  { city: 'Taipei', code: 'TPE', country: 'Taiwan', countryCode: 'TW', lat: 25.0797, lng: 121.2342 },

  // Asia - Southeast
  { city: 'Singapore', code: 'SIN', country: 'Singapore', countryCode: 'SG', lat: 1.3644, lng: 103.9915 },
  { city: 'Bangkok', code: 'BKK', country: 'Thailand', countryCode: 'TH', lat: 13.6900, lng: 100.7501 },
  { city: 'Phuket', code: 'HKT', country: 'Thailand', countryCode: 'TH', lat: 8.1132, lng: 98.3169 },
  { city: 'Kuala Lumpur', code: 'KUL', country: 'Malaysia', countryCode: 'MY', lat: 2.7456, lng: 101.7072 },
  { city: 'Jakarta', code: 'CGK', country: 'Indonesia', countryCode: 'ID', lat: -6.1256, lng: 106.6559 },
  { city: 'Bali', code: 'DPS', country: 'Indonesia', countryCode: 'ID', lat: -8.7467, lng: 115.1671 },
  { city: 'Manila', code: 'MNL', country: 'Philippines', countryCode: 'PH', lat: 14.5086, lng: 121.0194 },
  { city: 'Ho Chi Minh City', code: 'SGN', country: 'Vietnam', countryCode: 'VN', lat: 10.8188, lng: 106.6519 },
  { city: 'Hanoi', code: 'HAN', country: 'Vietnam', countryCode: 'VN', lat: 21.2212, lng: 105.8072 },

  // Asia - South
  { city: 'Mumbai', code: 'BOM', country: 'India', countryCode: 'IN', lat: 19.0896, lng: 72.8656 },
  { city: 'Delhi', code: 'DEL', country: 'India', countryCode: 'IN', lat: 28.5562, lng: 77.1000 },
  { city: 'Bangalore', code: 'BLR', country: 'India', countryCode: 'IN', lat: 13.1986, lng: 77.7066 },
  { city: 'Colombo', code: 'CMB', country: 'Sri Lanka', countryCode: 'LK', lat: 7.1807, lng: 79.8842 },
  { city: 'Maldives', code: 'MLE', country: 'Maldives', countryCode: 'MV', lat: 4.1917, lng: 73.5294 },

  // Oceania
  { city: 'Sydney', code: 'SYD', country: 'Australia', countryCode: 'AU', lat: -33.9399, lng: 151.1753 },
  { city: 'Melbourne', code: 'MEL', country: 'Australia', countryCode: 'AU', lat: -37.6690, lng: 144.8410 },
  { city: 'Brisbane', code: 'BNE', country: 'Australia', countryCode: 'AU', lat: -27.3842, lng: 153.1175 },
  { city: 'Perth', code: 'PER', country: 'Australia', countryCode: 'AU', lat: -31.9403, lng: 115.9672 },
  { city: 'Auckland', code: 'AKL', country: 'New Zealand', countryCode: 'NZ', lat: -37.0082, lng: 174.7850 },

  // South America
  { city: 'Sao Paulo', code: 'GRU', country: 'Brazil', countryCode: 'BR', lat: -23.4356, lng: -46.4731 },
  { city: 'Rio de Janeiro', code: 'GIG', country: 'Brazil', countryCode: 'BR', lat: -22.8099, lng: -43.2505 },
  { city: 'Buenos Aires', code: 'EZE', country: 'Argentina', countryCode: 'AR', lat: -34.8222, lng: -58.5358 },
  { city: 'Santiago', code: 'SCL', country: 'Chile', countryCode: 'CL', lat: -33.3930, lng: -70.7858 },
  { city: 'Lima', code: 'LIM', country: 'Peru', countryCode: 'PE', lat: -12.0219, lng: -77.1143 },
  { city: 'Bogota', code: 'BOG', country: 'Colombia', countryCode: 'CO', lat: 4.7016, lng: -74.1469 },

  // Caribbean & Central America
  { city: 'Nassau', code: 'NAS', country: 'Bahamas', countryCode: 'BS', lat: 25.0389, lng: -77.4662 },
  { city: 'Kingston', code: 'KIN', country: 'Jamaica', countryCode: 'JM', lat: 17.9357, lng: -76.7875 },
  { city: 'San Juan', code: 'SJU', country: 'Puerto Rico', countryCode: 'PR', lat: 18.4394, lng: -66.0018 },
  { city: 'Panama City', code: 'PTY', country: 'Panama', countryCode: 'PA', lat: 9.0714, lng: -79.3834 },
  { city: 'San Jose', code: 'SJO', country: 'Costa Rica', countryCode: 'CR', lat: 9.9939, lng: -84.2088 },
]

// Fetch all city images from Supabase (inner function)
async function fetchCityImagesInner(): Promise<Record<string, string>> {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('name, image, country_code')
      .not('image', 'is', null)

    if (error) {
      console.error('Error fetching city images:', error)
      return {}
    }

    const imageMap: Record<string, string> = {}
    data?.forEach((city) => {
      // Use city name as key (case-insensitive)
      const key = city.name.toLowerCase()
      if (city.image) {
        imageMap[key] = city.image
      }
    })

    return imageMap
  } catch (error) {
    console.error('Error in fetchCityImages:', error)
    return {}
  }
}

// Cached version - revalidates every hour
const fetchCityImages = unstable_cache(
  fetchCityImagesInner,
  ['city-images'],
  { revalidate: 3600 }
)

// Helper to convert record to Map for compatibility
async function getCityImagesMap(): Promise<Map<string, string>> {
  const imageRecord = await fetchCityImages()
  return new Map(Object.entries(imageRecord))
}

// Get city image from cache
function getCityImage(cityName: string, imageMap: Map<string, string>): string | undefined {
  return imageMap.get(cityName.toLowerCase())
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

// Calculate distance between two coordinates using Haversine formula
// Returns distance in miles
function calculateDistance(from: Airport, to: Airport): number {
  const R = 3959 // Earth's radius in miles

  // Convert degrees to radians
  const lat1 = from.lat * Math.PI / 180
  const lat2 = to.lat * Math.PI / 180
  const deltaLat = (to.lat - from.lat) * Math.PI / 180
  const deltaLng = (to.lng - from.lng) * Math.PI / 180

  // Haversine formula
  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const distance = R * c

  return Math.round(distance)
}

// Helper function to calculate distance with lat/lng directly
function calculateDistanceFromCoords(lat1: number, lng1: number, lat2: number, lng2: number): number {
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

// Find nearby airports within max distance (for Empty Legs - short flights only)
function findNearbyAirports(fromAirport: Airport, maxDistance: number = 800): Airport[] {
  const nearby: Airport[] = []
  const airportsList = Object.values(airportsData) as any[]

  for (const airport of airportsList) {
    // Skip airports without IATA code, coordinates, or city name
    if (!airport.iata || !airport.lat || !airport.lon || !airport.city || airport.city.trim() === '') continue

    // Skip the same airport
    if (airport.iata === fromAirport.code) continue

    const distance = calculateDistanceFromCoords(
      fromAirport.lat,
      fromAirport.lng,
      airport.lat,
      airport.lon
    )

    // Distance range: 150-800 miles for typical Empty Legs
    if (distance <= maxDistance && distance >= 150) {
      nearby.push({
        city: airport.city,
        code: airport.iata,
        country: airport.country === 'US' ? 'United States' : airport.country,
        countryCode: airport.country,
        lat: airport.lat,
        lng: airport.lon,
      })
    }
  }

  return nearby
}

// Calculate flight duration based on distance and aircraft speed
// Private jets typically cruise at 450-550 mph depending on type
function calculateFlightDuration(distance: number, aircraftSpeed?: string): string {
  // Extract speed from aircraft data or use average
  let cruiseSpeed = 480 // Default average cruise speed in mph

  if (aircraftSpeed) {
    const speedMatch = aircraftSpeed.match(/(\d+)/)
    if (speedMatch) {
      cruiseSpeed = parseInt(speedMatch[1])
    }
  }

  // Calculate base flight time
  let totalFlightTime = distance / cruiseSpeed

  // Add time for taxi, climb, descent (varies by distance)
  // Short flights (<500 miles): add 30 minutes
  // Medium flights (500-2000 miles): add 45 minutes
  // Long flights (>2000 miles): add 1 hour
  if (distance < 500) {
    totalFlightTime += 0.5 // 30 minutes
  } else if (distance < 2000) {
    totalFlightTime += 0.75 // 45 minutes
  } else {
    totalFlightTime += 1.0 // 1 hour
  }

  const hours = Math.floor(totalFlightTime)
  const minutes = Math.round((totalFlightTime - hours) * 60)

  return `${hours}h ${minutes}m`
}

// Calculate price based on distance and aircraft
function calculatePrice(distance: number, category: string, random: () => number): { original: number; discounted: number; discount: number } {
  // Base fee by category (fixed cost regardless of distance)
  const baseFee: Record<string, number> = {
    'Turboprop': 2500,
    'Very Light': 3000,
    'Light': 3500,
    'Super Light': 4000,
    'Midsize': 4500,
    'Super Midsize': 5000,
    'Heavy': 6000,
    'Ultra Long Range': 7000,
  }

  // Price per mile by category
  const pricePerMile: Record<string, number> = {
    'Turboprop': 8,
    'Very Light': 10,
    'Light': 12,
    'Super Light': 14,
    'Midsize': 16,
    'Super Midsize': 18,
    'Heavy': 22,
    'Ultra Long Range': 26,
  }

  const categoryBaseFee = baseFee[category] || 3500
  const baseRate = pricePerMile[category] || 12

  // Calculate: Base Fee + (Distance × Rate per Mile)
  const basePrice = categoryBaseFee + (baseRate * distance)

  // Add random variation: ±20% to make prices more varied
  const randomFactor = 0.8 + random() * 0.4 // Range: 0.8 to 1.2
  const calculatedPrice = Math.round(basePrice * randomFactor)

  // Ensure minimum price of $3,500 (though with base fees this should rarely apply)
  const discounted = Math.max(3500, calculatedPrice)

  // Original price is not used anymore, but keep for compatibility
  const original = Math.round(discounted * 1.5)
  const discount = Math.round(((original - discounted) / original) * 100)

  return { original, discounted, discount }
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
 * Generate Empty Legs for a specific user location
 * @param userCity - City code or name of user's location
 * @param count - Number of empty legs to generate (default 8)
 */
export async function generateEmptyLegsFromCity(userCity: string = 'JFK', count: number = 8): Promise<EmptyLeg[]> {
  const seed = getTodaySeed()
  const random = seededRandom(seed)

  // Fetch city images and aircraft in parallel (both cached)
  const [cityImages, aircraftData] = await Promise.all([
    getCityImagesMap(),
    fetchAircraftData()
  ])

  if (!aircraftData || aircraftData.length === 0) {
    throw new Error('No aircraft data available')
  }

  // Find user's airport or use default
  const fromAirport = MAJOR_AIRPORTS.find(a => a.code === userCity || a.city === userCity) || MAJOR_AIRPORTS[0]
  // Add image and timezone to from airport
  fromAirport.image = getCityImage(fromAirport.city, cityImages)
  fromAirport.timezone = CITY_TIMEZONES[fromAirport.city] || 'UTC'

  // Generate dates
  const dates = generateFutureDates(random, count)

  // Generate empty legs
  const emptyLegs: EmptyLeg[] = []

  for (let i = 0; i < count; i++) {
    // Find nearby airports (max 800 miles for Empty Legs - ~1.5-2 hours flight)
    const nearbyAirports = findNearbyAirports(fromAirport, 800)

    // If no nearby airports found, skip this iteration
    if (nearbyAirports.length === 0) continue

    // Select random nearby destination
    const toAirport = { ...nearbyAirports[Math.floor(random() * nearbyAirports.length)] }

    // Add image and timezone to destination airport
    toAirport.image = getCityImage(toAirport.city, cityImages)
    toAirport.timezone = CITY_TIMEZONES[toAirport.city] || 'UTC'

    // Select random aircraft
    const aircraft = aircraftData[Math.floor(random() * aircraftData.length)]

    // Calculate distance and pricing
    const distance = calculateDistance(fromAirport, toAirport)
    const pricing = calculatePrice(distance, aircraft.category, random)
    const flightDuration = calculateFlightDuration(distance, aircraft.speed)

    // Generate departure time and calculate arrival time
    const departureTime = generateDepartureTime(random)
    const arrivalTime = calculateArrivalTime(departureTime, flightDuration)

    // Generate empty leg
    emptyLegs.push({
      id: `el-${seed}-${i}`,
      from: fromAirport,
      to: toAirport,
      departureDate: formatDateString(dates[i]),
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
      originalPrice: pricing.original,
      discountedPrice: pricing.discounted,
      discount: pricing.discount,
      availableSeats: parseInt(aircraft.passengers.match(/\d+/)?.[0] || '4'),
      flightDuration,
      status: 'available',
    })
  }

  return emptyLegs
}

/**
 * Generate all Empty Legs (from various cities)
 * Uses predefined routes from Supabase database
 * @param count - Total number of empty legs to generate (default 100)
 */
export async function generateAllEmptyLegs(count: number = 100): Promise<EmptyLeg[]> {
  const seed = getTodaySeed()
  const random = seededRandom(seed)

  // Fetch routes and aircraft in parallel (both cached)
  const [routes, aircraftData] = await Promise.all([
    fetchEmptyLegRoutesFromSupabase(count),
    fetchAircraftData()
  ])

  if (!routes || routes.length === 0) {
    throw new Error('No empty leg routes available')
  }

  if (!aircraftData || aircraftData.length === 0) {
    throw new Error('No aircraft data available')
  }

  // Generate dates
  const dates = generateFutureDates(random, routes.length)

  // Generate empty legs from database routes
  const emptyLegs: EmptyLeg[] = []

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
      code: fromAirportData?.iata || route.from_city.name.substring(0, 3).toUpperCase(),
      country: route.from_city.country_code === 'US' ? 'United States' : route.from_city.country_code,
      countryCode: route.from_city.country_code,
      lat: fromAirportData?.lat || 0,
      lng: fromAirportData?.lon || 0,
      image: route.from_city.image || undefined,
      timezone: CITY_TIMEZONES[route.from_city.name] || 'UTC',
    }

    const toAirport: Airport = {
      city: route.to_city.name,
      code: toAirportData?.iata || route.to_city.name.substring(0, 3).toUpperCase(),
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

    // Calculate distance and pricing
    let distance = route.distance_nm || 0
    if (distance === 0 && fromAirport.lat && toAirport.lat) {
      distance = Math.round(calculateDistance(fromAirport, toAirport) * 0.868976) // Convert miles to NM
    }

    const pricing = calculatePrice(distance, aircraft.category, random)

    // Use the duration from the route data (convert from Russian format)
    const flightDuration = convertDuration(route.duration)

    // Generate departure time and calculate arrival time
    const departureTime = generateDepartureTime(random)
    const arrivalTime = calculateArrivalTime(departureTime, flightDuration)

    // Generate empty leg with stable ID using route UUID
    emptyLegs.push({
      id: `el-${seed}-${route.id}`,
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
      originalPrice: pricing.original,
      discountedPrice: pricing.discounted,
      discount: pricing.discount,
      availableSeats: parseInt(aircraft.passengers.match(/\d+/)?.[0] || '4'),
      flightDuration,
      status: 'available',
    })
  }

  // Sort by departure date and filter out past flights
  const sorted = emptyLegs.sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime())
  return filterPastFlights(sorted)
}

/**
 * Get a specific Empty Leg by ID
 * @param id - Empty Leg ID in format "el-{seed}-{route_uuid}"
 */
export async function getEmptyLegById(id: string): Promise<EmptyLeg | null> {
  try {
    // Validate ID format: el-{seed}-{uuid}
    if (!id.startsWith('el-')) {
      return null
    }

    // Generate all empty legs for today's seed
    const allLegs = await generateAllEmptyLegs(100)

    // Find the leg with matching ID
    return allLegs.find(leg => leg.id === id) || null
  } catch (error) {
    console.error('Error getting empty leg by ID:', error)
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
 * Filter Empty Legs
 */
export function filterEmptyLegs(legs: EmptyLeg[], filters: {
  from?: string
  to?: string
  dateFrom?: string
  dateTo?: string
  maxPrice?: number
  minPrice?: number
  minSeats?: number
  category?: string
  categories?: string[]
}): EmptyLeg[] {
  return legs.filter(leg => {
    // Filter by departure city
    if (filters.from) {
      const filterCity = extractCityName(filters.from).toLowerCase()
      const legCity = leg.from.city.toLowerCase()
      if (!legCity.includes(filterCity) && !filterCity.includes(legCity)) {
        return false
      }
    }

    // Filter by destination city
    if (filters.to) {
      const filterCity = extractCityName(filters.to).toLowerCase()
      const legCity = leg.to.city.toLowerCase()
      if (!legCity.includes(filterCity) && !filterCity.includes(legCity)) {
        return false
      }
    }

    // Filter by date from
    if (filters.dateFrom && leg.departureDate < filters.dateFrom) {
      return false
    }

    // Filter by date to
    if (filters.dateTo && leg.departureDate > filters.dateTo) {
      return false
    }

    // Filter by max price
    if (filters.maxPrice && leg.discountedPrice > filters.maxPrice) {
      return false
    }

    // Filter by min price
    if (filters.minPrice && leg.discountedPrice < filters.minPrice) {
      return false
    }

    // Filter by minimum seats
    if (filters.minSeats && leg.availableSeats < filters.minSeats) {
      return false
    }

    // Filter by single category (legacy)
    if (filters.category && leg.aircraft.category !== filters.category) {
      return false
    }

    // Filter by multiple categories
    if (filters.categories && filters.categories.length > 0) {
      if (!filters.categories.includes(leg.aircraft.category)) {
        return false
      }
    }

    return true
  })
}
