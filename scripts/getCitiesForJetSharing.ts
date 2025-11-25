import { supabase } from '../src/lib/supabase';

// Cities needed for Jet Sharing routes from jet-sharing.md
// Note: Some cities use their actual airport city names, not common names
const citiesNeeded = [
  // North America
  'New York City', // Changed from 'New York' - actual DB name
  'Miami', 'Los Angeles', 'Las Vegas', 'San Francisco',
  'Chicago', 'Dallas', 'Nassau', 'Aspen',

  // Europe
  'London', 'Paris', 'Geneva', 'Nice', 'Zurich', 'Milan', 'Frankfurt',

  // Middle East & Asia
  'Dubai',
  'Malé',  // Changed from 'Maldives' - actual city name
  'Doha', 'Singapore', 'Hong Kong', 'Tokyo',
  'Bali', 'Shanghai', 'Seoul', 'Riyadh', 'Mumbai',

  // Caribbean & South America
  'Providenciales',  // Changed from 'Turks and Caicos' - actual city name
  'Gustavia',        // Changed from 'St. Barts' - actual city name
  'Philipsburg',     // Changed from 'St. Maarten' - actual city name
  'São Paulo', 'Rio de Janeiro', 'Mexico City',

  // Oceania & Africa
  'Sydney', 'Melbourne', 'Auckland', 'Cape Town', 'Johannesburg',

  // Special cases
  'Monaco'
];

async function getCitiesIds() {
  console.log('🔍 Fetching cities from database...\n');

  // Get all cities
  const { data: cities, error } = await supabase
    .from('cities')
    .select('id, name, country_code')
    .order('name');

  if (error) {
    console.error('❌ Error fetching cities:', error);
    return;
  }

  if (!cities) {
    console.error('❌ No cities found');
    return;
  }

  console.log(`✅ Found ${cities.length} cities in database\n`);

  // Create a map of city names to IDs
  const cityMap = new Map<string, { id: string; country_code: string }>();

  cities.forEach(city => {
    cityMap.set(city.name, { id: city.id, country_code: city.country_code });
  });

  // Check which cities we need
  console.log('📋 Cities needed for Jet Sharing routes:\n');

  const foundCities: Array<{ name: string; id: string; country_code: string }> = [];
  const missingCities: string[] = [];

  citiesNeeded.forEach(cityName => {
    const city = cityMap.get(cityName);
    if (city) {
      foundCities.push({ name: cityName, id: city.id, country_code: city.country_code });
      console.log(`✅ ${cityName.padEnd(25)} | ${city.id} | ${city.country_code}`);
    } else {
      missingCities.push(cityName);
      console.log(`❌ ${cityName.padEnd(25)} | NOT FOUND`);
    }
  });

  console.log(`\n📊 Summary:`);
  console.log(`   Found: ${foundCities.length}/${citiesNeeded.length}`);
  console.log(`   Missing: ${missingCities.length}`);

  if (missingCities.length > 0) {
    console.log(`\n⚠️  Missing cities:`);
    missingCities.forEach(city => console.log(`   - ${city}`));
  }

  // Save to JSON for SQL script generation
  const output = {
    found: foundCities,
    missing: missingCities,
    cityMap: Object.fromEntries(cityMap)
  };

  const fs = require('fs');
  fs.writeFileSync('/tmp/jet-sharing-cities.json', JSON.stringify(output, null, 2));
  console.log(`\n💾 Saved city data to /tmp/jet-sharing-cities.json`);
}

getCitiesIds().catch(console.error);
