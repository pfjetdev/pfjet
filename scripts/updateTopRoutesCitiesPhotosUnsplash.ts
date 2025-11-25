import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY!;

// Cities that were just added
const newCities = [
  'Bahamas',
  'Cabo San Lucas',
  'Courchevel',
  'Fiji',
  'Florianópolis',
  'Galápagos',
  'Great Barrier Reef',
  'Maldives',
  'Mallorca',
  'Mauritius',
  'New York',
  'Sardinia',
  'Seychelles',
  'St. Moritz',
  'Tasmania',
  'Zanzibar'
];

// Get photo from Unsplash
async function getUnsplashPhoto(cityName: string): Promise<string | null> {
  try {
    console.log(`  🔍 Searching Unsplash for: ${cityName}`);

    const searchQuery = encodeURIComponent(`${cityName} landmark cityscape`);
    const url = `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=1&orientation=landscape`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data: any = await response.json();

    if (data.results && data.results.length > 0) {
      const photo = data.results[0];
      const photoUrl = photo.urls.regular; // 1080px wide
      console.log(`    ✅ Found photo by: ${photo.user.name}`);
      console.log(`    📐 Size: ${photo.width}×${photo.height}`);
      return photoUrl;
    }

    console.log(`    ❌ No photos found`);
    return null;

  } catch (error) {
    console.error(`    ❌ Error:`, (error as Error).message);
    return null;
  }
}

// Main function
async function main() {
  console.log('🚀 Updating photos for new Top Routes cities from Unsplash...\n');
  console.log(`📊 Total cities to update: ${newCities.length}\n`);

  if (!UNSPLASH_ACCESS_KEY) {
    console.error('❌ UNSPLASH_ACCESS_KEY not found in .env.local');
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < newCities.length; i++) {
    const cityName = newCities[i];
    console.log(`\n[${i + 1}/${newCities.length}] ${cityName}`);
    console.log('='.repeat(60));

    try {
      // Get photo from Unsplash
      const photoUrl = await getUnsplashPhoto(cityName);

      if (!photoUrl) {
        console.log(`  ⚠️  No suitable photo found, skipping...`);
        failCount++;
        continue;
      }

      // Update in database
      console.log('  💾 Updating in database...');
      const { error } = await supabase
        .from('cities')
        .update({ image: photoUrl })
        .eq('name', cityName);

      if (error) {
        console.error(`  ❌ Database error:`, error.message);
        failCount++;
      } else {
        console.log(`  ✅ Photo updated successfully!`);
        successCount++;
      }

      // Rate limiting for Unsplash (50 requests per hour for free tier)
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error(`  ❌ Error:`, error);
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESULTS:');
  console.log(`  ✅ Successfully updated: ${successCount}`);
  console.log(`  ❌ Failed: ${failCount}`);
  console.log('='.repeat(60));
  console.log('\n💡 Later you can update these photos from Wikipedia when rate limit resets');
}

main().catch(console.error);
