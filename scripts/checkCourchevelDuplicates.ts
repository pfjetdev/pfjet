import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function checkDuplicates() {
  console.log('🔍 Checking for Courchevel duplicates...\n');

  const { data: cities, error } = await supabase
    .from('cities')
    .select('*')
    .ilike('name', '%courchevel%')
    .order('id');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Found ${cities?.length || 0} Courchevel entries:\n`);

  cities?.forEach((city, index) => {
    console.log(`[${index + 1}] ID: ${city.id}`);
    console.log(`    Name: ${city.name}`);
    console.log(`    Country: ${city.country_code}`);
    console.log(`    Image: ${city.image?.substring(0, 60)}...`);
    console.log(`    Description: ${city.description?.substring(0, 80)}...`);
    console.log('');
  });

  if (cities && cities.length > 1) {
    console.log('⚠️  Found duplicates! Keeping the first one and deleting others...\n');

    const keepId = cities[0].id;
    const deleteIds = cities.slice(1).map(c => c.id);

    console.log(`✅ Keeping: ${cities[0].name} (ID: ${keepId})`);
    console.log(`❌ Deleting: ${deleteIds.length} duplicate(s)\n`);

    for (const id of deleteIds) {
      const { error: deleteError } = await supabase
        .from('cities')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error(`  ❌ Error deleting ID ${id}:`, deleteError.message);
      } else {
        console.log(`  ✅ Deleted city ID: ${id}`);
      }
    }

    console.log('\n✅ Done! Duplicates removed.');
  } else {
    console.log('✅ No duplicates found!');
  }
}

checkDuplicates().catch(console.error);
