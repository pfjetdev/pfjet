import { supabase } from '../src/lib/supabase';
import airportsData from '../src/data/airports-full.json';
import * as fs from 'fs';

// Airport name to IATA code mapping (same as in emptyLegsGenerator)
const AIRPORT_NAME_MAPPING: Record<string, string> = {
  'Teterboro': 'TEB',
  'Nantucket': 'ACK',
  'Palm Beach': 'PBI',
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
  'Key West': 'EYW',
  'Orlando': 'MCO',
  'Farnborough': 'FAB',
  'Cannes': 'CEQ',
  'Ibiza': 'IBZ',
  'Olbia (Sardinia)': 'OLB',
  'Palma de Mallorca': 'PMI',
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
  'Milwaukee': 'MKE',
  'Seattle Boeing Field': 'BFI',
  'Los Cabos': 'SJD',
  'Puerto Vallarta': 'PVR',
  'Cancún': 'CUN',
  'Cozumel': 'CZM',
  'Gold Coast': 'OOL',
  'Maasai Mara': 'WIL',
  'Plettenberg Bay': 'PBZ',
  'Goa': 'GOI',
  'Delhi': 'DEL',
  'Koh Samui': 'USM',
  'Lombok': 'LOP',
  'Hong Kong': 'HKG',
  'Macau': 'MFM',
  'Jeju': 'CJU',
  'Hangzhou': 'HGH',
  'Qingdao': 'TAO',
  'Corsica (Figari)': 'FSC',
  'Bordeaux': 'BOD',
  'Sion': 'SIR',
  'St. Moritz (Samedan)': 'SMV',
  'Bolzano': 'BZO',
  'Guernsey': 'GCI',
  'Luxembourg': 'LUX',
  'Karlovy Vary': 'KLV',
  'Cyprus': 'LCA',
  'Cyprus (Larnaca)': 'LCA',
  'Bahrain': 'BAH',
  'Kuwait': 'KWI',
  'Friedrichshafen': 'FDH',
  'Neheim-Hüsten (EDLA)': 'ZCA',
  'Sylt': 'GWT',
  'Visby': 'VBY',
  'Courchevel': 'CVF',
  'Denver': 'DEN',
};

interface CityData {
  name: string;
  country_code: string;
  is_capital?: boolean;
}

async function addMissingCities() {
  // Read missing cities report
  const report = JSON.parse(fs.readFileSync('/tmp/missing-cities-report.json', 'utf8'));
  const missingCities = report.missing;

  console.log(`\n📋 Preparing to add ${missingCities.length} cities...\n`);

  const citiesToAdd: CityData[] = [];
  const skippedCities: string[] = [];

  // Prepare city data with coordinates
  missingCities.forEach((cityName: string) => {
    const iataCode = AIRPORT_NAME_MAPPING[cityName];

    if (!iataCode) {
      console.warn(`⚠️  No IATA mapping for: ${cityName}`);
      skippedCities.push(cityName);
      return;
    }

    // Find airport in airports-full.json
    const airportsList = Object.values(airportsData) as any[];
    const airport = airportsList.find((a: any) => a.iata === iataCode);

    if (!airport) {
      console.warn(`⚠️  Airport not found for ${cityName} (${iataCode})`);
      skippedCities.push(cityName);
      return;
    }

    // Prepare city data
    const cityData: CityData = {
      name: airport.city || cityName,
      country_code: airport.country || 'US',
      is_capital: false,
    };

    citiesToAdd.push(cityData);
  });

  console.log(`✅ Prepared ${citiesToAdd.length} cities`);
  console.log(`⚠️  Skipped ${skippedCities.length} cities\n`);

  if (skippedCities.length > 0) {
    console.log('Skipped cities:', skippedCities.join(', '));
  }

  // Insert cities into Supabase in batches
  const batchSize = 10;
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < citiesToAdd.length; i += batchSize) {
    const batch = citiesToAdd.slice(i, i + batchSize);

    console.log(`\n📤 Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(citiesToAdd.length / batchSize)}...`);

    const { data, error } = await supabase
      .from('cities')
      .insert(batch)
      .select();

    if (error) {
      console.error(`❌ Error inserting batch:`, error.message);
      errorCount += batch.length;

      // Try to insert one by one to see which ones fail
      for (const city of batch) {
        const { error: individualError } = await supabase
          .from('cities')
          .insert([city])
          .select();

        if (individualError) {
          console.error(`   ❌ Failed: ${city.name} - ${individualError.message}`);
        } else {
          console.log(`   ✅ ${city.name} (${city.country_code})`);
          successCount++;
        }
      }
    } else {
      successCount += batch.length;
      batch.forEach(city => {
        console.log(`   ✅ ${city.name} (${city.country_code})`);
      });
    }
  }

  console.log(`\n\n=== SUMMARY ===`);
  console.log(`✅ Successfully added: ${successCount} cities`);
  console.log(`❌ Failed: ${errorCount} cities`);
  console.log(`⚠️  Skipped (no mapping): ${skippedCities.length} cities`);
  console.log(`\nTotal cities processed: ${successCount + errorCount + skippedCities.length}/${missingCities.length}`);
}

addMissingCities().catch(console.error);
