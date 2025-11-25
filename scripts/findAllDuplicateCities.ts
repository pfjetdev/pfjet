import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function findDuplicates() {
  console.log('🔍 Checking for duplicate cities...\n');

  // Get all cities
  const { data: cities, error } = await supabase
    .from('cities')
    .select('id, name, country_code')
    .order('name');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Total cities: ${cities?.length || 0}\n`);

  // Group by name (case-insensitive)
  const cityGroups = new Map<string, any[]>();

  cities?.forEach(city => {
    const normalizedName = city.name.toLowerCase().trim();
    if (!cityGroups.has(normalizedName)) {
      cityGroups.set(normalizedName, []);
    }
    cityGroups.get(normalizedName)!.push(city);
  });

  // Find duplicates
  const duplicates: Array<{ name: string; cities: any[] }> = [];

  cityGroups.forEach((group, name) => {
    if (group.length > 1) {
      duplicates.push({ name, cities: group });
    }
  });

  if (duplicates.length === 0) {
    console.log('✅ No duplicates found!');
    return;
  }

  console.log(`⚠️  Found ${duplicates.length} duplicate city names:\n`);
  console.log('='.repeat(80));

  duplicates.forEach(dup => {
    console.log(`\n📍 ${dup.name.toUpperCase()} (${dup.cities.length} entries)`);
    dup.cities.forEach((city, idx) => {
      console.log(`  [${idx + 1}] ${city.name} (${city.country_code}) - ID: ${city.id}`);
    });
  });

  console.log('\n' + '='.repeat(80));
  console.log(`\n💡 Total duplicate groups: ${duplicates.length}`);
}

findDuplicates().catch(console.error);
