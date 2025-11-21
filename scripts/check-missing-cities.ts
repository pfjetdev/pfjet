import { supabase } from '../src/lib/supabase';
import * as fs from 'fs';
import * as path from 'path';

async function checkMissingCities() {
  // Get cities from empty legs routes
  const emptyLegsCities = JSON.parse(
    fs.readFileSync('/tmp/empty-legs-cities.json', 'utf8')
  );

  // Get cities from Supabase
  const { data: supabaseCities, error } = await supabase
    .from('cities')
    .select('name, country_code, image');

  if (error) {
    console.error('Error fetching cities from Supabase:', error);
    process.exit(1);
  }

  // Create a map of Supabase cities (normalize for comparison)
  const supabaseCityMap = new Map();
  supabaseCities?.forEach((city: any) => {
    const normalizedName = city.name.toLowerCase().trim();
    supabaseCityMap.set(normalizedName, city);
  });

  // Find missing cities
  const missingCities: string[] = [];
  const citiesWithoutImages: Array<{ name: string; country: string }> = [];
  const citiesFound: string[] = [];

  emptyLegsCities.forEach((cityName: string) => {
    const normalized = cityName.toLowerCase().trim();

    // Check various variations
    const variations = [
      normalized,
      normalized.replace(/\s*\(.*?\)/g, ''), // Remove parentheses content
      normalized.split(/\s*\/\s*/)[0], // Take first part before slash
      normalized.split(/\s+/)[0], // Take first word
    ];

    let found = false;
    let foundCity: any = null;

    for (const variant of variations) {
      if (supabaseCityMap.has(variant)) {
        found = true;
        foundCity = supabaseCityMap.get(variant);
        break;
      }
    }

    if (found) {
      citiesFound.push(cityName);
      if (!foundCity.image) {
        citiesWithoutImages.push({
          name: cityName,
          country: foundCity.country_code
        });
      }
    } else {
      missingCities.push(cityName);
    }
  });

  console.log('\n=== CITIES STATISTICS ===');
  console.log(`Total cities in Empty Legs routes: ${emptyLegsCities.length}`);
  console.log(`Cities found in Supabase: ${citiesFound.length}`);
  console.log(`Cities WITHOUT images: ${citiesWithoutImages.length}`);
  console.log(`Cities MISSING from Supabase: ${missingCities.length}`);

  if (missingCities.length > 0) {
    console.log('\n=== MISSING CITIES (need to add to Supabase) ===');
    missingCities.forEach((city, i) => {
      console.log(`${i + 1}. ${city}`);
    });
  }

  if (citiesWithoutImages.length > 0) {
    console.log('\n=== CITIES WITHOUT IMAGES (need to add images) ===');
    citiesWithoutImages.forEach((city, i) => {
      console.log(`${i + 1}. ${city.name} (${city.country})`);
    });
  }

  // Save results to file
  const results = {
    total: emptyLegsCities.length,
    found: citiesFound.length,
    withoutImages: citiesWithoutImages,
    missing: missingCities
  };

  fs.writeFileSync('/tmp/missing-cities-report.json', JSON.stringify(results, null, 2));
  console.log('\n✓ Full report saved to /tmp/missing-cities-report.json');
}

checkMissingCities().catch(console.error);
