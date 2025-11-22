import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Helper function to get city ID by name
async function getCityIdByName(cityName: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('cities')
    .select('id')
    .ilike('name', cityName)
    .single();

  if (error || !data) {
    console.error(`City not found: ${cityName}`, error);
    return null;
  }

  return data.id;
}

// Helper function to get random aircraft ID by category
async function getAircraftIdByCategory(category: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('aircraft')
    .select('id')
    .eq('category', category)
    .limit(1)
    .single();

  if (error || !data) {
    console.error(`Aircraft not found for category: ${category}`, error);
    return null;
  }

  return data.id;
}

// Test data for Jet Sharing flights
const testFlights = [
  {
    from: 'New York',
    to: 'Miami',
    category: 'Light',
    departure_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
    departure_time: '09:00',
    total_seats: 6,
    available_seats: 3,
    price_per_seat: 2200,
    distance_nm: 1092,
    duration: '2h 45m',
  },
  {
    from: 'Los Angeles',
    to: 'Las Vegas',
    category: 'Very Light',
    departure_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
    departure_time: '14:30',
    total_seats: 4,
    available_seats: 4,
    price_per_seat: 800,
    distance_nm: 236,
    duration: '1h 10m',
  },
  {
    from: 'London',
    to: 'Paris',
    category: 'Light',
    departure_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    departure_time: '11:00',
    total_seats: 7,
    available_seats: 2,
    price_per_seat: 1500,
    distance_nm: 215,
    duration: '1h 15m',
  },
  {
    from: 'Dubai',
    to: 'London',
    category: 'Heavy',
    departure_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days from now
    departure_time: '22:00',
    total_seats: 12,
    available_seats: 5,
    price_per_seat: 4500,
    distance_nm: 3400,
    duration: '7h 30m',
  },
  {
    from: 'Paris',
    to: 'Nice',
    category: 'Very Light',
    departure_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 days from now
    departure_time: '15:45',
    total_seats: 5,
    available_seats: 3,
    price_per_seat: 950,
    distance_nm: 430,
    duration: '1h 25m',
  },
  {
    from: 'San Francisco',
    to: 'Los Angeles',
    category: 'Light',
    departure_date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 days from now
    departure_time: '08:15',
    total_seats: 6,
    available_seats: 4,
    price_per_seat: 1100,
    distance_nm: 337,
    duration: '1h 20m',
  },
  {
    from: 'Miami',
    to: 'New York',
    category: 'Super Light',
    departure_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 8 days from now
    departure_time: '16:30',
    total_seats: 7,
    available_seats: 6,
    price_per_seat: 1800,
    distance_nm: 1092,
    duration: '2h 50m',
  },
  {
    from: 'Tokyo',
    to: 'Singapore',
    category: 'Heavy',
    departure_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 12 days from now
    departure_time: '10:00',
    total_seats: 14,
    available_seats: 8,
    price_per_seat: 5200,
    distance_nm: 3300,
    duration: '7h 15m',
  },
  {
    from: 'Chicago',
    to: 'New York',
    category: 'Light',
    departure_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
    departure_time: '12:00',
    total_seats: 6,
    available_seats: 1,
    price_per_seat: 1600,
    distance_nm: 740,
    duration: '2h 15m',
  },
  {
    from: 'Amsterdam',
    to: 'London',
    category: 'Very Light',
    departure_date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 9 days from now
    departure_time: '17:00',
    total_seats: 4,
    available_seats: 2,
    price_per_seat: 1200,
    distance_nm: 230,
    duration: '1h 10m',
  },
];

async function migrateJetSharing() {
  try {
    console.log('Starting Jet Sharing migration...\n');

    const flightsToInsert = [];
    const skippedFlights = [];

    for (const flight of testFlights) {
      // Get city IDs
      const fromCityId = await getCityIdByName(flight.from);
      const toCityId = await getCityIdByName(flight.to);

      if (!fromCityId || !toCityId) {
        skippedFlights.push({
          ...flight,
          reason: !fromCityId ? `From city not found: ${flight.from}` : `To city not found: ${flight.to}`
        });
        continue;
      }

      // Get aircraft ID
      const aircraftId = await getAircraftIdByCategory(flight.category);

      if (!aircraftId) {
        skippedFlights.push({
          ...flight,
          reason: `Aircraft not found for category: ${flight.category}`
        });
        continue;
      }

      flightsToInsert.push({
        from_city_id: fromCityId,
        to_city_id: toCityId,
        aircraft_id: aircraftId,
        departure_date: flight.departure_date,
        departure_time: flight.departure_time,
        total_seats: flight.total_seats,
        available_seats: flight.available_seats,
        price_per_seat: flight.price_per_seat,
        distance_nm: flight.distance_nm,
        duration: flight.duration,
        status: 'available',
        is_featured: false,
      });
    }

    console.log(`Flights to insert: ${flightsToInsert.length}`);
    console.log(`Flights skipped: ${skippedFlights.length}\n`);

    if (skippedFlights.length > 0) {
      console.log('Skipped flights:');
      skippedFlights.forEach(f => {
        console.log(`  - ${f.from} → ${f.to} (${f.reason})`);
      });
      console.log('');
    }

    // Insert flights
    if (flightsToInsert.length > 0) {
      const { data, error } = await supabase
        .from('jet_sharing_flights')
        .insert(flightsToInsert)
        .select();

      if (error) {
        console.error('Error inserting flights:', error);
        throw error;
      }

      console.log(`\n✅ Migration complete!`);
      console.log(`Total flights inserted: ${data?.length || 0}/${flightsToInsert.length}`);
    } else {
      console.log('❌ No flights to insert');
    }

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateJetSharing().then(() => process.exit(0));
