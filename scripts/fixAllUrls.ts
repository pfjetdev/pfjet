import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function fixAllUrls() {
  console.log('🔧 Fixing URLs in database...\n');

  // Получаем все страны с URL без протокола
  const { data: countries, error } = await supabase
    .from('countries')
    .select('code, name, image')
    .like('image', '//%');

  if (error) {
    console.error('❌ Error fetching countries:', error);
    return;
  }

  if (!countries || countries.length === 0) {
    console.log('✅ All URLs are already correct!');
    return;
  }

  console.log(`📊 Found ${countries.length} countries with incorrect URLs\n`);

  let fixed = 0;
  let failed = 0;

  for (const country of countries) {
    const oldUrl = country.image as string;
    const newUrl = `https:${oldUrl}`;

    console.log(`${country.name} (${country.code})`);
    console.log(`  Old: ${oldUrl.substring(0, 60)}...`);
    console.log(`  New: ${newUrl.substring(0, 60)}...`);

    const { error: updateError } = await supabase
      .from('countries')
      .update({ image: newUrl })
      .eq('code', country.code);

    if (updateError) {
      console.log(`  ❌ Error: ${updateError.message}\n`);
      failed++;
    } else {
      console.log(`  ✅ Fixed!\n`);
      fixed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ URL fix complete!');
  console.log('='.repeat(60));
  console.log(`📊 Fixed: ${fixed}`);
  console.log(`📊 Failed: ${failed}`);
  console.log(`📊 Total: ${countries.length}`);
}

fixAllUrls().catch(console.error);
