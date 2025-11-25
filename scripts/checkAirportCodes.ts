import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import airportsData from '../src/data/airports-full.json';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Find airport data by city name from airports JSON
function findAirportDataByCityName(cityName: string): any | null {
  const airportsList = Object.values(airportsData) as any[];

  for (const airport of airportsList) {
    if (airport.city && airport.city.toLowerCase() === cityName.toLowerCase() && airport.iata) {
      return airport;
    }
  }

  return null;
}

async function checkAirportCodes() {
  console.log('🔍 Checking airport codes for all routes...\n');

  // Получаем все маршруты с городами
  const { data: routes, error } = await supabase
    .from('jet_sharing_routes')
    .select(`
      id,
      from_city:cities!jet_sharing_routes_from_city_id_fkey (
        id,
        name,
        country_code
      ),
      to_city:cities!jet_sharing_routes_to_city_id_fkey (
        id,
        name,
        country_code
      )
    `);

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`✅ Found ${routes?.length || 0} routes\n`);
  console.log('='.repeat(80));
  console.log('📋 Airport Code Analysis');
  console.log('='.repeat(80));

  const citiesWithoutIata: Set<string> = new Set();
  const generatedCodes: Map<string, string[]> = new Map();

  for (const route of routes || []) {
    if (!route.from_city || !route.to_city) continue;

    const fromCity = (route.from_city as any).name;
    const toCity = (route.to_city as any).name;

    // Check FROM city
    const fromAirport = findAirportDataByCityName(fromCity);
    if (!fromAirport) {
      citiesWithoutIata.add(fromCity);
      const generatedCode = fromCity.substring(0, 3).toUpperCase();
      if (!generatedCodes.has(generatedCode)) {
        generatedCodes.set(generatedCode, []);
      }
      generatedCodes.get(generatedCode)!.push(fromCity);
    }

    // Check TO city
    const toAirport = findAirportDataByCityName(toCity);
    if (!toAirport) {
      citiesWithoutIata.add(toCity);
      const generatedCode = toCity.substring(0, 3).toUpperCase();
      if (!generatedCodes.has(generatedCode)) {
        generatedCodes.set(generatedCode, []);
      }
      generatedCodes.get(generatedCode)!.push(toCity);
    }
  }

  if (citiesWithoutIata.size === 0) {
    console.log('\n✅ All cities have IATA codes in airports-full.json!');
  } else {
    console.log(`\n⚠️  Found ${citiesWithoutIata.size} cities WITHOUT IATA codes:\n`);

    Array.from(citiesWithoutIata).sort().forEach(city => {
      const generatedCode = city.substring(0, 3).toUpperCase();
      console.log(`  ${city} → Will use generated code: ${generatedCode}`);
    });

    console.log('\n📊 Generated codes that might conflict:');
    for (const [code, cities] of generatedCodes.entries()) {
      if (cities.length > 1) {
        console.log(`  ⚠️  ${code}: ${cities.join(', ')}`);
      }
    }

    // Check for "NEW" specifically
    if (generatedCodes.has('NEW')) {
      console.log('\n🚨 FOUND "NEW" CODE:');
      generatedCodes.get('NEW')!.forEach(city => {
        console.log(`  - Generated from city: ${city}`);
      });
    }
  }

  console.log('\n' + '='.repeat(80));
}

checkAirportCodes().catch(console.error);
