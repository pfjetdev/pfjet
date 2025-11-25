import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function checkProgress() {
  const { data: cities, error } = await supabase
    .from('cities')
    .select('name, country_code, image')
    .order('name');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('\n' + '='.repeat(80));
  console.log('📊 CITIES PHOTO UPDATE PROGRESS');
  console.log('='.repeat(80));

  const withWikipedia = cities?.filter(c =>
    c.image?.includes('wikimedia.org') || c.image?.includes('wikipedia.org')
  ) || [];
  const withUnsplash = cities?.filter(c => c.image?.includes('unsplash.com')) || [];
  const withPexels = cities?.filter(c => c.image?.includes('pexels.com')) || [];
  const withoutImage = cities?.filter(c => !c.image) || [];

  console.log(`\n✅ Total cities: ${cities?.length || 0}`);
  console.log(`\n📷 Image sources:`);
  console.log(`   - Wikipedia: ${withWikipedia.length} (${Math.round(withWikipedia.length / (cities?.length || 1) * 100)}%)`);
  console.log(`   - Unsplash: ${withUnsplash.length}`);
  console.log(`   - Pexels: ${withPexels.length}`);
  console.log(`   - No image: ${withoutImage.length}`);

  console.log(`\n✅ ${withWikipedia.length} cities updated with Wikipedia photos!`);
  console.log(`⏳ ${withUnsplash.length + withPexels.length} cities still need updating`);

  if (withWikipedia.length > 0) {
    console.log(`\n📸 Sample updated cities:`);
    for (const city of withWikipedia.slice(0, 10)) {
      console.log(`   - ${city.name} (${city.country_code})`);
    }
    if (withWikipedia.length > 10) {
      console.log(`   ... and ${withWikipedia.length - 10} more`);
    }
  }

  console.log('\n💡 To continue updating, run:');
  console.log('   npx tsx scripts/updateCitiesPhotosImproved.ts');

  console.log('\n' + '='.repeat(80));
}

checkProgress().catch(console.error);
