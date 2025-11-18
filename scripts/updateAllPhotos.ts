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
    const result = await unsplash.search.getPhotos({
      query: `${countryName} famous landmark iconic`,
      page: 1,
      perPage: 5,
      orientation: 'landscape',
      orderBy: 'relevant',
    });

    if (result.errors) {
      console.error(`    ❌ Unsplash API error:`, result.errors);
      return null;
    }

    if (!result.response?.results || result.response.results.length === 0) {
      console.log(`    ⚠️  No photo found for ${countryName}`);
      return null;
    }

    // Выбираем фото с максимальным количеством лайков
    let bestPhoto = result.response.results[0];
    let maxLikes = bestPhoto.likes;

    for (const photo of result.response.results) {
      if (photo.likes > maxLikes) {
        maxLikes = photo.likes;
        bestPhoto = photo;
      }
    }

    console.log(`    📊 Selected photo with ${bestPhoto.likes} likes`);
    return bestPhoto.urls.regular;
  } catch (error) {
    console.error(`    ❌ Error fetching photo for ${countryName}:`, error);
    return null;
  }
}

// Получить фото города из Unsplash
async function getCityPhoto(cityName: string, countryName: string): Promise<string | null> {
  try {
    const result = await unsplash.search.getPhotos({
      query: `${cityName} ${countryName} landmark architecture`,
      page: 1,
      perPage: 5,
      orientation: 'landscape',
      orderBy: 'relevant',
    });

    if (result.errors) {
      console.error(`      ❌ Unsplash API error:`, result.errors);
      return null;
    }

    if (!result.response?.results || result.response.results.length === 0) {
      console.log(`      ⚠️  No photo found for ${cityName}`);
      return null;
    }

    // Выбираем самое популярное фото
    let bestPhoto = result.response.results[0];
    let maxLikes = bestPhoto.likes;

    for (const photo of result.response.results) {
      if (photo.likes > maxLikes) {
        maxLikes = photo.likes;
        bestPhoto = photo;
      }
    }

    console.log(`      📊 Selected photo with ${bestPhoto.likes} likes`);
    return bestPhoto.urls.regular;
  } catch (error) {
    console.error(`      ❌ Error fetching photo for ${cityName}:`, error);
    return null;
  }
}

// Обновить фото для страны
async function updateCountryPhoto(countryCode: string, countryName: string): Promise<boolean> {
  console.log(`    📷 Fetching country photo from Unsplash...`);
  const countryPhoto = await getCountryPhoto(countryName);

  if (countryPhoto) {
    const { error } = await supabase
      .from('countries')
      .update({ image: countryPhoto })
      .eq('code', countryCode);

    if (error) {
      console.error(`    ❌ Error updating country photo: ${error.message}`);
      return false;
    } else {
      console.log(`    ✅ Country photo updated!`);
      return true;
    }
  }
  return false;
}

// Обновить фото для городов страны
async function updateCityPhotos(countryCode: string, countryName: string): Promise<number> {
  const { data: cities, error } = await supabase
    .from('cities')
    .select('name')
    .eq('country_code', countryCode);

  if (error || !cities || cities.length === 0) {
    return 0;
  }

  console.log(`    📍 Found ${cities.length} cities`);
  let updated = 0;

  for (const city of cities) {
    console.log(`      📷 Fetching photo for ${city.name}...`);
    const cityPhoto = await getCityPhoto(city.name, countryName);

    if (cityPhoto) {
      const { error: updateError } = await supabase
        .from('cities')
        .update({ image: cityPhoto })
        .eq('country_code', countryCode)
        .eq('name', city.name);

      if (!updateError) {
        console.log(`      ✅ ${city.name} photo updated!`);
        updated++;
      }
    }

    // Пауза между запросами (rate limiting)
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  return updated;
}

// Главная функция
async function main() {
  console.log('🚀 Starting photo updates for ALL countries...\n');

  // Получаем все страны которые еще используют placeholder изображения
  const { data: countries, error } = await supabase
    .from('countries')
    .select('code, name, continent, image')
    .order('continent')
    .order('name');

  if (error) {
    console.error('❌ Error fetching countries:', error);
    return;
  }

  if (!countries || countries.length === 0) {
    console.log('⚠️  No countries found');
    return;
  }

  // Фильтруем только страны с placeholder изображениями
  const countriesToUpdate = countries.filter(c =>
    c.image.includes('unsplash.com/photo-1506905925346-21bda4d32df4')
  );

  console.log(`📊 Total countries: ${countries.length}`);
  console.log(`📊 Countries needing photo update: ${countriesToUpdate.length}\n`);

  let requestCount = 0;
  const maxRequests = 45; // Оставляем запас до лимита в 50

  for (const country of countriesToUpdate) {
    if (requestCount >= maxRequests) {
      console.log('\n⚠️  Reached request limit (45/50)');
      console.log('💡 Wait 1 hour and run the script again to continue');
      console.log(`📊 Progress: ${countriesToUpdate.indexOf(country)}/${countriesToUpdate.length} countries`);
      break;
    }

    console.log(`\n  📍 Updating photos for ${country.name} (${country.continent})...`);

    // Обновляем фото страны
    const countryUpdated = await updateCountryPhoto(country.code, country.name);
    if (countryUpdated) requestCount++;

    // Пауза после страны
    await new Promise(resolve => setTimeout(resolve, 3000));

    if (requestCount >= maxRequests) {
      console.log('\n⚠️  Reached request limit after country photo');
      break;
    }

    // Обновляем фото городов (с учетом лимита)
    const citiesUpdated = await updateCityPhotos(country.code, country.name);
    requestCount += citiesUpdated;

    console.log(`  📊 Requests used: ${requestCount}/${maxRequests}`);

    if (requestCount >= maxRequests) {
      break;
    }
  }

  console.log('\n✅ Batch completed!');
  console.log(`📊 Total requests made: ${requestCount}`);
  console.log('💡 Check your Supabase database to see the new photos.');

  const remaining = countriesToUpdate.length - countriesToUpdate.findIndex(c => requestCount >= maxRequests);
  if (remaining > 0) {
    console.log(`\n⏳ ${remaining} countries still need photos - run again in 1 hour`);
  }
}

// Запуск
main().catch(console.error);
