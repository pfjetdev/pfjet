import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { createApi } from 'unsplash-js';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY!,
});

// Получить фото страны из Unsplash с улучшенным алгоритмом
async function getCountryPhoto(countryName: string): Promise<string | null> {
  try {
    console.log(`\n🔍 Searching photos for ${countryName}...`);
    console.log(`   Query: "${countryName} famous landmark iconic"\n`);

    const result = await unsplash.search.getPhotos({
      query: `${countryName} famous landmark iconic`,
      page: 1,
      perPage: 5,
      orientation: 'landscape',
      orderBy: 'relevant',
    });

    if (result.errors) {
      console.error(`❌ Unsplash API error:`, result.errors);
      return null;
    }

    if (!result.response?.results || result.response.results.length === 0) {
      console.log(`⚠️  No photo found`);
      return null;
    }

    console.log(`📸 Found ${result.response.results.length} photos:\n`);

    // Показываем все найденные фото
    result.response.results.forEach((photo, index) => {
      console.log(`${index + 1}. Likes: ${photo.likes} | Description: ${photo.description || photo.alt_description || 'No description'}`);
      console.log(`   URL: ${photo.urls.regular}\n`);
    });

    // Выбираем фото с максимальным количеством лайков
    let bestPhoto = result.response.results[0];
    let maxLikes = bestPhoto.likes;

    for (const photo of result.response.results) {
      if (photo.likes > maxLikes) {
        maxLikes = photo.likes;
        bestPhoto = photo;
      }
    }

    console.log(`✅ Selected photo with ${bestPhoto.likes} likes`);
    console.log(`   Description: ${bestPhoto.description || bestPhoto.alt_description}`);
    console.log(`   URL: ${bestPhoto.urls.regular}\n`);

    return bestPhoto.urls.regular;
  } catch (error) {
    console.error(`❌ Error:`, error);
    return null;
  }
}

async function main() {
  console.log('🧪 Testing photo selection for Brazil\n');

  const photoUrl = await getCountryPhoto('Brazil');

  if (photoUrl) {
    console.log('\n📊 Updating Brazil photo in database...');
    const { error } = await supabase
      .from('countries')
      .update({ image: photoUrl })
      .eq('code', 'BR');

    if (error) {
      console.error(`❌ Database error: ${error.message}`);
    } else {
      console.log(`✅ Brazil photo updated successfully!`);
    }
  }
}

main().catch(console.error);
