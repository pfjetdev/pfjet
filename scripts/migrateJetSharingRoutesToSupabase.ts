import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Popular Jet Sharing routes
const POPULAR_ROUTES = [
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
  { from: 'Dallas', to: 'Houston', category: 'Very Light' },
  { from: 'Houston', to: 'Dallas', category: 'Very Light' },

  // European Routes
  { from: 'London', to: 'Paris', category: 'Very Light' },
  { from: 'Paris', to: 'London', category: 'Very Light' },
  { from: 'Paris', to: 'Nice', category: 'Very Light' },
  { from: 'Nice', to: 'Paris', category: 'Very Light' },
  { from: 'Geneva', to: 'Paris', category: 'Very Light' },
  { from: 'Paris', to: 'Geneva', category: 'Very Light' },
  { from: 'Zurich', to: 'London', category: 'Light' },
  { from: 'London', to: 'Zurich', category: 'Light' },
  { from: 'London', to: 'Amsterdam', category: 'Very Light' },
  { from: 'Amsterdam', to: 'London', category: 'Very Light' },
  { from: 'Milan', to: 'Paris', category: 'Light' },
  { from: 'Paris', to: 'Milan', category: 'Light' },
  { from: 'Barcelona', to: 'Paris', category: 'Light' },
  { from: 'Paris', to: 'Barcelona', category: 'Light' },

  // Transatlantic
  { from: 'New York', to: 'London', category: 'Heavy' },
  { from: 'London', to: 'New York', category: 'Heavy' },
  { from: 'Los Angeles', to: 'London', category: 'Ultra Long Range' },
  { from: 'London', to: 'Los Angeles', category: 'Ultra Long Range' },

  // Middle East
  { from: 'Dubai', to: 'London', category: 'Heavy' },
  { from: 'London', to: 'Dubai', category: 'Heavy' },
  { from: 'Dubai', to: 'Paris', category: 'Heavy' },
  { from: 'Paris', to: 'Dubai', category: 'Heavy' },

  // Asia-Pacific
  { from: 'Tokyo', to: 'Singapore', category: 'Heavy' },
  { from: 'Singapore', to: 'Tokyo', category: 'Heavy' },
  { from: 'Hong Kong', to: 'Singapore', category: 'Super Midsize' },
  { from: 'Singapore', to: 'Hong Kong', category: 'Super Midsize' },
]

interface CityMapping {
  [key: string]: string // city name -> city UUID
}

async function fetchCityMappings(): Promise<CityMapping> {
  console.log('Fetching city mappings from Supabase...')

  const { data, error } = await supabase
    .from('cities')
    .select('id, name, country_code')

  if (error) {
    console.error('Error fetching cities:', error)
    throw error
  }

  const mapping: CityMapping = {}

  // Create mapping from city names to city UUIDs
  for (const city of data || []) {
    mapping[city.name] = city.id
  }

  console.log(`Found ${Object.keys(mapping).length} city mappings\n`)
  return mapping
}

// Calculate distance using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3440 // Earth's radius in nautical miles
  const lat1Rad = lat1 * Math.PI / 180
  const lat2Rad = lat2 * Math.PI / 180
  const deltaLat = (lat2 - lat1) * Math.PI / 180
  const deltaLng = (lng2 - lng1) * Math.PI / 180

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
}

// Calculate flight duration based on distance
function calculateFlightDuration(distanceNM: number): string {
  const cruiseSpeed = 420 // knots
  let totalFlightTime = distanceNM / cruiseSpeed

  // Add taxi, climb, descent time
  if (distanceNM < 500) {
    totalFlightTime += 0.5
  } else if (distanceNM < 2000) {
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

async function migrateJetSharingRoutes() {
  try {
    console.log('Starting Jet Sharing Routes migration...\n')

    // Fetch city mappings
    const cityMappings = await fetchCityMappings()

    // Load airports data for coordinates
    const airportsPath = path.join(process.cwd(), 'src', 'data', 'airports-full.json')
    const airportsData = JSON.parse(fs.readFileSync(airportsPath, 'utf-8'))

    // Create airport lookup by city name
    const airportLookup = new Map<string, any>()
    const airportsList = Object.values(airportsData) as any[]

    for (const airport of airportsList) {
      if (airport.city && airport.iata && airport.lat && airport.lon) {
        airportLookup.set(airport.city.toLowerCase(), airport)
      }
    }

    console.log(`Loaded ${airportLookup.size} airports for coordinate lookup\n`)

    // Prepare data for insertion
    const routesToInsert = []
    const skippedRoutes = []

    for (const route of POPULAR_ROUTES) {
      const fromCityId = cityMappings[route.from]
      const toCityId = cityMappings[route.to]

      if (!fromCityId || !toCityId) {
        skippedRoutes.push({
          from: route.from,
          to: route.to,
          reason: !fromCityId ? `From city not found: ${route.from}` : `To city not found: ${route.to}`
        })
        continue
      }

      // Get airport data for coordinates
      const fromAirport = airportLookup.get(route.from.toLowerCase())
      const toAirport = airportLookup.get(route.to.toLowerCase())

      if (!fromAirport || !toAirport) {
        skippedRoutes.push({
          from: route.from,
          to: route.to,
          reason: 'Airport data not found'
        })
        continue
      }

      // Calculate distance and duration
      const distanceNM = calculateDistance(
        fromAirport.lat, fromAirport.lon,
        toAirport.lat, toAirport.lon
      )
      const duration = calculateFlightDuration(distanceNM)

      routesToInsert.push({
        from_city_id: fromCityId,
        to_city_id: toCityId,
        aircraft_category: route.category,
        distance_nm: distanceNM,
        duration: duration,
        is_popular: true,
      })
    }

    console.log(`Routes to insert: ${routesToInsert.length}`)
    console.log(`Routes skipped: ${skippedRoutes.length}\n`)

    if (skippedRoutes.length > 0) {
      console.log('Skipped routes:')
      skippedRoutes.forEach(r => {
        console.log(`  - ${r.from} → ${r.to} (${r.reason})`)
      })
      console.log('')
    }

    // Clear existing routes (optional - comment out if you want to keep existing data)
    console.log('Clearing existing routes...')
    const { error: deleteError } = await supabase
      .from('jet_sharing_routes')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

    if (deleteError) {
      console.error('Error clearing existing routes:', deleteError)
    } else {
      console.log('Existing routes cleared\n')
    }

    // Insert routes in batches of 100
    const batchSize = 100
    let inserted = 0

    for (let i = 0; i < routesToInsert.length; i += batchSize) {
      const batch = routesToInsert.slice(i, i + batchSize)

      const { data, error } = await supabase
        .from('jet_sharing_routes')
        .insert(batch)
        .select()

      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error)
        continue
      }

      inserted += data?.length || 0
      console.log(`Inserted batch ${i / batchSize + 1}/${Math.ceil(routesToInsert.length / batchSize)} (${data?.length || 0} routes)`)
    }

    console.log(`\n✅ Migration complete!`)
    console.log(`Total routes inserted: ${inserted}/${routesToInsert.length}`)

  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
migrateJetSharingRoutes().then(() => process.exit(0))
