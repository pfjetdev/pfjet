import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Airport name to IATA code mapping (from emptyLegsGenerator.ts)
const AIRPORT_NAME_MAPPING: Record<string, string> = {
  'Teterboro': 'TEB',
  'Nantucket': 'ACK',
  'Palm Beach': 'PBI',
  'Washington DCA/IAD': 'DCA',
  'Boston': 'BOS',
  "Martha's Vineyard": 'MVY',
  'Van Nuys': 'VNY',
  'Las Vegas': 'LAS',
  'Aspen': 'ASE',
  'San Francisco (SQL)': 'SQL',
  'Santa Barbara': 'SBA',
  'Los Angeles (SMO)': 'SMO',
  'San Francisco': 'SFO',
  'Miami': 'MIA',
  'Nassau': 'NAS',
  'Key West': 'EYW',
  'Orlando': 'MCO',
  'London Farnborough': 'FAB',
  'Paris Le Bourget': 'LBG',
  'Geneva': 'GVA',
  'Nice': 'NCE',
  'Milan Linate': 'LIN',
  'Courchevel': 'CVF',
  'Cannes': 'CEQ',
  'Ibiza': 'IBZ',
  'Olbia (Sardinia)': 'OLB',
  'Palma de Mallorca': 'PMI',
  'Mykonos': 'JMK',
  'Santorini': 'JTR',
  'Athens': 'ATH',
  'Dubai': 'DXB',
  'Doha': 'DOH',
  'Sharjah / Dubai': 'SHJ',
  'Riyadh': 'RUH',
  'Abu Dhabi': 'AUH',
  'Muscat': 'MCT',
  'Singapore Seletar': 'XSP',
  'Kuala Lumpur': 'KUL',
  'Singapore': 'SIN',
  'Phuket': 'HKT',
  'Phnom Penh': 'PNH',
  'Hong Kong': 'HKG',
  'Macau': 'MFM',
  'Bangkok': 'BKK',
  'Moscow Vnukovo': 'VKO',
  'St. Petersburg': 'LED',
  'Zurich': 'ZRH',
  'Munich': 'MUC',
  'Friedrichshafen': 'FDH',
  'Neheim-Hüsten (EDLA)': 'ZCA',
  'Frankfurt': 'FRA',
  'Berlin': 'BER',
  'Sylt': 'GWT',
  'Stockholm': 'ARN',
  'Visby': 'VBY',
  'Oslo': 'OSL',
  'Stavanger': 'SVG',
  'Rome Ciampino': 'CIA',
  'Venice': 'VCE',
  'Madrid': 'MAD',
  'Barcelona': 'BCN',
  'Lisbon': 'LIS',
  'Faro': 'FAO',
  'Tel Aviv': 'TLV',
  'Cyprus (Larnaca)': 'LCA',
  'Istanbul': 'IST',
  'Bodrum': 'BJV',
  'Denver Centennial': 'APA',
  'Jackson Hole': 'JAC',
  'Salt Lake City': 'SLC',
  'Telluride': 'TEX',
  'Sun Valley': 'SUN',
  'Boise': 'BOI',
  'Phoenix Scottsdale': 'SDL',
  'Dallas Love': 'DAL',
  'Houston Hobby': 'HOU',
  'Austin': 'AUS',
  'Houston': 'IAH',
  'Chicago Midway': 'MDW',
  'Milwaukee': 'MKE',
  'Toronto': 'YYZ',
  'Montreal': 'YUL',
  'Vancouver': 'YVR',
  'Seattle Boeing Field': 'BFI',
  'Los Cabos': 'SJD',
  'Puerto Vallarta': 'PVR',
  'Cancún': 'CUN',
  'Cozumel': 'CZM',
  'São Paulo': 'GRU',
  'Rio de Janeiro': 'GIG',
  'Buenos Aires': 'EZE',
  'Punta del Este': 'PDP',
  'Sydney': 'SYD',
  'Melbourne': 'MEL',
  'Gold Coast': 'OOL',
  'Johannesburg': 'JNB',
  'Cape Town': 'CPT',
  'Nairobi': 'NBO',
  'Maasai Mara': 'WIL',
  'Plettenberg Bay': 'PBZ',
  'Mumbai': 'BOM',
  'Goa': 'GOI',
  'Delhi': 'DEL',
  'Jaipur': 'JAI',
  'Koh Samui': 'USM',
  'Bali': 'DPS',
  'Lombok': 'LOP',
  'Tokyo': 'NRT',
  'Osaka': 'KIX',
  'Seoul': 'ICN',
  'Jeju': 'CJU',
  'Shanghai': 'PVG',
  'Hangzhou': 'HGH',
  'Beijing': 'PEK',
  'Qingdao': 'TAO',
  'Corsica (Figari)': 'FSC',
  'Monaco': 'NCE',
  'Edinburgh': 'EDI',
  'Paris': 'CDG',
  'Bordeaux': 'BOD',
  'Sion': 'SIR',
  'St. Moritz (Samedan)': 'SMV',
  'Bolzano': 'BZO',
  'London': 'LHR',
  'Guernsey': 'GCI',
  'Dublin': 'DUB',
  'Amsterdam': 'AMS',
  'Antwerp': 'ANR',
  'Brussels': 'BRU',
  'Luxembourg': 'LUX',
  'Vienna': 'VIE',
  'Bratislava': 'BTS',
  'Prague': 'PRG',
  'Karlovy Vary': 'KLV',
  'Thessaloniki': 'SKG',
  'Cyprus': 'LCA',
  'Beirut': 'BEY',
  'Bahrain': 'BAH',
  'Dammam': 'DMM',
  'Kuwait': 'KWI',
  'Jeddah': 'JED',
  'Almaty': 'ALA',
  'Astana': 'NQZ',
  'Tbilisi': 'TBS',
  'Batumi': 'BUS',
  'Baku': 'GYD',
  'Ganja': 'KVD',
  'Reykjavik': 'KEF',
  'Akureyri': 'AEY',
};

// Map aircraft names to categories
function getAircraftCategory(aircraftName: string): string {
  const name = aircraftName.toLowerCase();

  // Very Light Jets
  if (name.includes('phenom 100') || name.includes('citation m2') || name.includes('eclipse')) {
    return 'Very Light';
  }

  // Light Jets
  if (name.includes('phenom 300') || name.includes('cj3') || name.includes('cj4') ||
      name.includes('learjet 45') || name.includes('citation cj')) {
    return 'Light';
  }

  // Super Light Jets
  if (name.includes('learjet 60') || name.includes('citation xls')) {
    return 'Super Light';
  }

  // Midsize Jets
  if (name.includes('hawker 800') || name.includes('citation excel') ||
      name.includes('learjet 70') || name.includes('gulfstream g150')) {
    return 'Midsize';
  }

  // Super Midsize Jets
  if (name.includes('citation x') || name.includes('challenger 300') ||
      name.includes('challenger 350') || name.includes('gulfstream g200')) {
    return 'Super Midsize';
  }

  // Heavy Jets
  if (name.includes('gulfstream g') || name.includes('falcon') ||
      name.includes('challenger 600') || name.includes('embraer legacy')) {
    return 'Heavy';
  }

  // Default to Light for unknown
  return 'Light';
}

interface EmptyLegRoute {
  id: number;
  from: string;
  to: string;
  distanceNM: string;
  duration: string;
  aircraft: string;
}

interface CityMapping {
  [key: string]: string; // airport code -> city UUID
}

async function fetchCityMappings(): Promise<CityMapping> {
  console.log('Fetching city mappings from Supabase...');

  const { data, error } = await supabase
    .from('cities')
    .select('id, name, country_code');

  if (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }

  const mapping: CityMapping = {};

  // Create mapping from airport codes to city UUIDs
  for (const [airportName, airportCode] of Object.entries(AIRPORT_NAME_MAPPING)) {
    const city = data?.find(c => {
      // Try to match by common airport codes or city names
      const cityName = c.name.toLowerCase();
      const searchName = airportName.toLowerCase();

      return cityName.includes(searchName.split(' ')[0]) ||
             searchName.includes(cityName) ||
             airportCode === cityName.toUpperCase();
    });

    if (city) {
      mapping[airportName] = city.id;
    }
  }

  console.log(`Found ${Object.keys(mapping).length} city mappings`);
  return mapping;
}

async function migrateEmptyLegs() {
  try {
    console.log('Starting Empty Legs migration...\n');

    // Read JSON file
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'empty-legs-routes.json');
    const jsonData = fs.readFileSync(jsonPath, 'utf-8');
    const routes: EmptyLegRoute[] = JSON.parse(jsonData);

    console.log(`Found ${routes.length} routes in JSON\n`);

    // Fetch city mappings
    const cityMappings = await fetchCityMappings();

    // Prepare data for insertion
    const routesToInsert = [];
    const skippedRoutes = [];

    for (const route of routes) {
      const fromCityId = cityMappings[route.from];
      const toCityId = cityMappings[route.to];

      if (!fromCityId || !toCityId) {
        skippedRoutes.push({
          id: route.id,
          from: route.from,
          to: route.to,
          reason: !fromCityId ? `From city not found: ${route.from}` : `To city not found: ${route.to}`
        });
        continue;
      }

      // Determine aircraft category from the aircraft name
      const category = getAircraftCategory(route.aircraft);

      routesToInsert.push({
        from_city_id: fromCityId,
        to_city_id: toCityId,
        aircraft_category: category,
        distance_nm: parseInt(route.distanceNM) || null,
        duration: route.duration,
        is_popular: false,
      });
    }

    console.log(`Routes to insert: ${routesToInsert.length}`);
    console.log(`Routes skipped: ${skippedRoutes.length}\n`);

    if (skippedRoutes.length > 0) {
      console.log('Skipped routes:');
      skippedRoutes.slice(0, 10).forEach(r => {
        console.log(`  - Route ${r.id}: ${r.from} → ${r.to} (${r.reason})`);
      });
      if (skippedRoutes.length > 10) {
        console.log(`  ... and ${skippedRoutes.length - 10} more\n`);
      }
    }

    // Insert routes in batches of 100
    const batchSize = 100;
    let inserted = 0;

    for (let i = 0; i < routesToInsert.length; i += batchSize) {
      const batch = routesToInsert.slice(i, i + batchSize);

      const { data, error } = await supabase
        .from('empty_leg_routes')
        .insert(batch)
        .select();

      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
        continue;
      }

      inserted += data?.length || 0;
      console.log(`Inserted batch ${i / batchSize + 1}/${Math.ceil(routesToInsert.length / batchSize)} (${data?.length || 0} routes)`);
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`Total routes inserted: ${inserted}/${routesToInsert.length}`);

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateEmptyLegs().then(() => process.exit(0));
