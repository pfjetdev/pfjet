import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function checkMissingCities() {
  console.log('🔍 Checking for countries without cities...\n');

  // Получаем все страны
  const { data: countries, error: countriesError } = await supabase
    .from('countries')
    .select('code, name, continent')
    .order('continent')
    .order('name');

  if (countriesError) {
    console.error('Error fetching countries:', countriesError);
    return;
  }

  if (!countries) {
    console.log('No countries found');
    return;
  }

  console.log(`📊 Total countries: ${countries.length}\n`);

  const countriesWithoutCities: any[] = [];

  for (const country of countries) {
    const { data: cities, error: citiesError } = await supabase
      .from('cities')
      .select('id')
      .eq('country_code', country.code);

    if (citiesError) {
      console.error(`Error checking cities for ${country.name}:`, citiesError);
      continue;
    }

    if (!cities || cities.length === 0) {
      countriesWithoutCities.push(country);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`✅ Countries with cities: ${countries.length - countriesWithoutCities.length}`);
  console.log(`❌ Countries without cities: ${countriesWithoutCities.length}\n`);

  if (countriesWithoutCities.length > 0) {
    console.log(`Countries missing cities:\n`);

    // Group by continent
    const byContinent: Record<string, any[]> = {};
    countriesWithoutCities.forEach(country => {
      if (!byContinent[country.continent]) {
        byContinent[country.continent] = [];
      }
      byContinent[country.continent].push(country);
    });

    Object.keys(byContinent).sort().forEach(continent => {
      console.log(`\n${continent}:`);
      byContinent[continent].forEach(country => {
        console.log(`  - ${country.name} (${country.code})`);
      });
    });
  }
}

checkMissingCities().catch(console.error);
