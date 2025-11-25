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

async function updateCourchevelPhoto() {
  console.log('🏔️  Updating Courchevel photo from Unsplash...\n');

  try {
    // Search for Courchevel ski resort photos
    const searchQuery = encodeURIComponent('Courchevel France ski resort alps');
    const url = `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=3&orientation=landscape`;

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
      const photoUrl = photo.urls.regular;

      console.log(`✅ Found photo by: ${photo.user.name}`);
      console.log(`📐 Size: ${photo.width}×${photo.height}`);
      console.log(`🔗 URL: ${photoUrl}\n`);

      // Update in database
      const { error } = await supabase
        .from('cities')
        .update({ image: photoUrl })
        .eq('name', 'Courchevel')
        .eq('country_code', 'FR');

      if (error) {
        console.error('❌ Database error:', error);
      } else {
        console.log('✅ Courchevel photo updated successfully!');
      }
    } else {
      console.log('❌ No photos found on Unsplash');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateCourchevelPhoto().catch(console.error);
