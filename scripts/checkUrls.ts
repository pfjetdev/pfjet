import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function checkUrls() {
  const { data, error } = await supabase
    .from('countries')
    .select('code, name, image')
    .in('code', ['DZ', 'AO', 'BJ', 'YE', 'MD'])
    .order('name');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('\n📊 Checking URLs for sample countries:\n');

  for (const country of data || []) {
    console.log(`${country.name} (${country.code}):`);

    if (country.image) {
      const url = country.image as string;

      if (url.startsWith('https://')) {
        console.log(`  ✅ ${url.substring(0, 100)}...`);
      } else if (url.startsWith('//')) {
        console.log(`  ❌ MISSING PROTOCOL: ${url.substring(0, 100)}...`);
      } else {
        console.log(`  ⚠️  UNKNOWN FORMAT: ${url.substring(0, 100)}...`);
      }
    } else {
      console.log(`  ⚠️  No image`);
    }

    console.log('');
  }
}

checkUrls().catch(console.error);
