import { supabase } from '../src/lib/supabase';

async function addMissingCountriesAndCities() {
  console.log('🌍 Adding missing countries...\n');

  // Countries to add
  const countries = [
    { code: 'CY', name: 'Cyprus', flag: '🇨🇾', continent: 'Europe' },
    { code: 'GG', name: 'Guernsey', flag: '🇬🇬', continent: 'Europe' },
    { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', continent: 'Asia' },
    { code: 'MO', name: 'Macau', flag: '🇲🇴', continent: 'Asia' },
  ];

  let countriesAdded = 0;
  let countriesSkipped = 0;

  for (const country of countries) {
    const { error } = await supabase
      .from('countries')
      .insert([country])
      .select();

    if (error) {
      if (error.code === '23505') { // Duplicate key
        console.log(`⚠️  ${country.name} (${country.code}) - already exists`);
        countriesSkipped++;
      } else {
        console.error(`❌ ${country.name} (${country.code}) - ${error.message}`);
      }
    } else {
      console.log(`✅ ${country.name} (${country.code})`);
      countriesAdded++;
    }
  }

  console.log(`\n📊 Countries: ${countriesAdded} added, ${countriesSkipped} skipped\n`);

  // Wait a moment for foreign key constraints to update
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('🏙️  Adding missing cities...\n');

  // Cities to add
  const cities = [
    { name: 'Larnarca', country_code: 'CY', is_capital: false },
    { name: 'Saint Peter Port', country_code: 'GG', is_capital: false },
    { name: 'Hong Kong', country_code: 'HK', is_capital: false },
    { name: 'Taipa', country_code: 'MO', is_capital: false },
  ];

  let citiesAdded = 0;
  let citiesSkipped = 0;

  for (const city of cities) {
    const { error } = await supabase
      .from('cities')
      .insert([city])
      .select();

    if (error) {
      if (error.code === '23505') { // Duplicate key
        console.log(`⚠️  ${city.name} (${city.country_code}) - already exists`);
        citiesSkipped++;
      } else {
        console.error(`❌ ${city.name} (${city.country_code}) - ${error.message}`);
      }
    } else {
      console.log(`✅ ${city.name} (${city.country_code})`);
      citiesAdded++;
    }
  }

  console.log(`\n📊 Cities: ${citiesAdded} added, ${citiesSkipped} skipped\n`);

  // Verify results
  console.log('✅ Verification:\n');

  const { data: addedCountries } = await supabase
    .from('countries')
    .select('code, name, flag')
    .in('code', ['CY', 'GG', 'HK', 'MO']);

  console.log('Countries in database:');
  addedCountries?.forEach(c => console.log(`  ${c.flag} ${c.name} (${c.code})`));

  const { data: addedCities } = await supabase
    .from('cities')
    .select('name, country_code')
    .in('name', ['Larnarca', 'Saint Peter Port', 'Hong Kong', 'Taipa']);

  console.log('\nCities in database:');
  addedCities?.forEach(c => console.log(`  📍 ${c.name} (${c.country_code})`));

  console.log('\n🎉 All missing countries and cities have been processed!');
}

addMissingCountriesAndCities().catch(console.error);
