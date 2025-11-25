import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import airportsData from '../src/data/airports-full.json';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function compareCityNames() {
  console.log('🔍 Comparing city names in DB vs airports-full.json...\n');

  // Get all cities used in routes
  const { data: routes } = await supabase
    .from('jet_sharing_routes')
    .select(`
      from_city:cities!jet_sharing_routes_from_city_id_fkey (name),
      to_city:cities!jet_sharing_routes_to_city_id_fkey (name)
    `);

  const citiesInRoutes = new Set<string>();
  for (const route of routes || []) {
    if (route.from_city) citiesInRoutes.add((route.from_city as any).name);
    if (route.to_city) citiesInRoutes.add((route.to_city as any).name);
  }

  const airportsList = Object.values(airportsData) as any[];
  const citiesInAirports = new Set(airportsList.map(a => a.city).filter(Boolean));

  console.log('📊 Cities in routes:', citiesInRoutes.size);
  console.log('📊 Cities in airports:', citiesInAirports.size);
  console.log('');

  console.log('='.repeat(80));
  console.log('⚠️  Cities in routes NOT found in airports-full.json:');
  console.log('='.repeat(80));

  const missingCities: string[] = [];
  for (const city of Array.from(citiesInRoutes).sort()) {
    if (!citiesInAirports.has(city)) {
      missingCities.push(city);
      console.log(`  ❌ ${city}`);
    }
  }

  if (missingCities.length === 0) {
    console.log('  ✅ All cities found!');
  }

  console.log('\n' + '='.repeat(80));
}

compareCityNames().catch(console.error);
