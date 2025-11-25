import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function searchCourchevel() {
  console.log('🔍 Searching for any cities containing "courch"...\n');

  const { data: cities, error } = await supabase
    .from('cities')
    .select('*')
    .or('name.ilike.%courch%,name.ilike.%courche%')
    .order('name');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Found ${cities?.length || 0} cities:\n`);
  console.log('='.repeat(80));

  cities?.forEach((city, index) => {
    console.log(`\n[${index + 1}] ${city.name} (${city.country_code})`);
    console.log(`    ID: ${city.id}`);
    console.log(`    Image: ${city.image?.substring(0, 70)}...`);
    console.log(`    Created: ${new Date(city.created_at).toLocaleString()}`);
    console.log(`    Description: ${city.description?.substring(0, 100)}...`);
  });

  console.log('\n' + '='.repeat(80));

  // Also search in French cities
  console.log('\n🇫🇷 All French cities starting with "C":\n');

  const { data: frenchCities } = await supabase
    .from('cities')
    .select('name, id')
    .eq('country_code', 'FR')
    .ilike('name', 'C%')
    .order('name')
    .limit(20);

  frenchCities?.forEach(city => {
    console.log(`  - ${city.name} (${city.id})`);
  });
}

searchCourchevel().catch(console.error);
