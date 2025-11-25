import { supabase } from '../src/lib/supabase';

async function diagnoseDatabase() {
  console.log('🔍 Diagnosing Supabase database...\n');

  // Check countries table structure and constraints
  console.log('📊 COUNTRIES TABLE:');
  console.log('='.repeat(60));

  // Get sample country
  const { data: sampleCountry, error: countryError } = await supabase
    .from('countries')
    .select('*')
    .limit(1);

  if (countryError) {
    console.error('❌ Error fetching countries:', countryError);
  } else if (sampleCountry && sampleCountry.length > 0) {
    console.log('✅ Sample country structure:');
    console.log(JSON.stringify(sampleCountry[0], null, 2));
    console.log('\nColumns:', Object.keys(sampleCountry[0]).join(', '));
  }

  // Check for duplicates in countries
  const { data: countriesAll, error: countriesAllError } = await supabase
    .from('countries')
    .select('code');

  if (countriesAll) {
    const codeCounts = countriesAll.reduce((acc, c) => {
      acc[c.code] = (acc[c.code] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const duplicateCodes = Object.entries(codeCounts).filter(([_, count]) => count > 1);

    console.log(`\n📈 Total countries: ${countriesAll.length}`);
    console.log(`🔄 Duplicate codes: ${duplicateCodes.length}`);
    if (duplicateCodes.length > 0) {
      console.log('⚠️  Duplicates found:');
      duplicateCodes.forEach(([code, count]) => {
        console.log(`   ${code}: ${count} times`);
      });
    } else {
      console.log('✅ No duplicates in countries');
    }
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Check cities table structure and constraints
  console.log('📊 CITIES TABLE:');
  console.log('='.repeat(60));

  // Get sample city
  const { data: sampleCity, error: cityError } = await supabase
    .from('cities')
    .select('*')
    .limit(1);

  if (cityError) {
    console.error('❌ Error fetching cities:', cityError);
  } else if (sampleCity && sampleCity.length > 0) {
    console.log('✅ Sample city structure:');
    console.log(JSON.stringify(sampleCity[0], null, 2));
    console.log('\nColumns:', Object.keys(sampleCity[0]).join(', '));
  }

  // Check for duplicates in cities
  const { data: citiesAll, error: citiesAllError } = await supabase
    .from('cities')
    .select('name, country_code');

  if (citiesAll) {
    const cityKeys = citiesAll.map(c => `${c.name}|${c.country_code}`);
    const cityCounts = cityKeys.reduce((acc, key) => {
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const duplicateCities = Object.entries(cityCounts).filter(([_, count]) => count > 1);

    console.log(`\n📈 Total cities: ${citiesAll.length}`);
    console.log(`🔄 Duplicate (name, country_code): ${duplicateCities.length}`);
    if (duplicateCities.length > 0) {
      console.log('⚠️  Duplicates found (showing first 10):');
      duplicateCities.slice(0, 10).forEach(([key, count]) => {
        const [name, country] = key.split('|');
        console.log(`   ${name} (${country}): ${count} times`);
      });
      if (duplicateCities.length > 10) {
        console.log(`   ... and ${duplicateCities.length - 10} more`);
      }
    } else {
      console.log('✅ No duplicates in cities');
    }
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Check for Caribbean countries
  console.log('🏝️  CARIBBEAN COUNTRIES CHECK:');
  console.log('='.repeat(60));

  const caribbeanCodes = ['TC', 'BL', 'SX'];
  const { data: caribbeanCountries } = await supabase
    .from('countries')
    .select('code, name')
    .in('code', caribbeanCodes);

  caribbeanCodes.forEach(code => {
    const found = caribbeanCountries?.find(c => c.code === code);
    if (found) {
      console.log(`✅ ${code}: ${found.name}`);
    } else {
      console.log(`❌ ${code}: NOT FOUND`);
    }
  });

  console.log('\n' + '='.repeat(60) + '\n');

  // Check for Caribbean cities
  console.log('🏝️  CARIBBEAN CITIES CHECK:');
  console.log('='.repeat(60));

  const caribbeanCities = ['Providenciales', 'Gustavia', 'Philipsburg'];
  const { data: cities } = await supabase
    .from('cities')
    .select('id, name, country_code')
    .in('name', caribbeanCities);

  caribbeanCities.forEach(cityName => {
    const found = cities?.find(c => c.name === cityName);
    if (found) {
      console.log(`✅ ${cityName}: ${found.country_code} (${found.id})`);
    } else {
      console.log(`❌ ${cityName}: NOT FOUND`);
    }
  });

  console.log('\n' + '='.repeat(60) + '\n');

  // Check Malé (Maldives)
  console.log('🏝️  MALDIVES CHECK:');
  console.log('='.repeat(60));

  const { data: male } = await supabase
    .from('cities')
    .select('id, name, country_code')
    .eq('name', 'Malé');

  if (male && male.length > 0) {
    console.log(`✅ Malé found: ${male[0].country_code} (${male[0].id})`);
  } else {
    console.log('❌ Malé NOT FOUND');
  }

  console.log('\n✅ Diagnosis complete!\n');
}

diagnoseDatabase().catch(console.error);
