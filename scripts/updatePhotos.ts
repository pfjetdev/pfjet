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

// Получить фото страны из Unsplash
async function getCountryPhoto(countryName: string): Promise<string | null> {
  try {
    // Пробуем несколько поисковых запросов для лучшего результата
    const queries = [
      `${countryName} famous landmark iconic`,
      `${countryName} tourism destination`,
      `${countryName} travel landscape`,
    ];

    let bestPhoto = null;
    let maxLikes = 0;

    // Пробуем первый запрос и берем топ-3 фото
    const result = await unsplash.search.getPhotos({
      query: queries[0],
      page: 1,
      perPage: 5,
      orientation: 'landscape',
      orderBy: 'relevant', // Сортировка по релевантности
    });

    if (result.errors) {
      console.error(`    ❌ Unsplash API error:`, result.errors);
      return null;
    }

    if (!result.response?.results || result.response.results.length === 0) {
      console.log(`    ⚠️  No photo found for ${countryName}`);
      return null;
    }

    // Выбираем фото с максимальным количеством лайков (самое популярное)
    for (const photo of result.response.results) {
      if (photo.likes > maxLikes) {
        maxLikes = photo.likes;
        bestPhoto = photo;
      }
    }

    if (!bestPhoto) {
      bestPhoto = result.response.results[0];
    }

    console.log(`    📊 Selected photo with ${bestPhoto.likes} likes`);
    // Возвращаем URL с высоким качеством
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

    // Выбираем самое популярное фото (по лайкам)
    let bestPhoto = result.response.results[0];
    let maxLikes = bestPhoto.likes;

    for (const photo of result.response.results) {
      if (photo.likes > maxLikes) {
        maxLikes = photo.likes;
        bestPhoto = photo;
      }
    }

    console.log(`      📊 Selected photo with ${bestPhoto.likes} likes`);
    // Возвращаем URL с средним качеством (для городов)
    return bestPhoto.urls.regular;
  } catch (error) {
    console.error(`      ❌ Error fetching photo for ${cityName}:`, error);
    return null;
  }
}

// Обновить фото для страны
async function updateCountryPhoto(countryCode: string, countryName: string) {
  console.log(`\n  📍 Updating photos for ${countryName}...`);

  // Получаем фото страны
  console.log(`    📷 Fetching country photo from Unsplash...`);
  const countryPhoto = await getCountryPhoto(countryName);

  if (countryPhoto) {
    // Обновляем в БД
    const { error } = await supabase
      .from('countries')
      .update({ image: countryPhoto })
      .eq('code', countryCode);

    if (error) {
      console.error(`    ❌ Error updating country photo: ${error.message}`);
    } else {
      console.log(`    ✅ Country photo updated!`);
    }
  }

  // Пауза между запросами (rate limiting для Unsplash - 50 запросов в час)
  await new Promise(resolve => setTimeout(resolve, 3000));
}

// Обновить фото для городов страны
async function updateCityPhotos(countryCode: string, countryName: string) {
  // Получаем города этой страны
  const { data: cities, error } = await supabase
    .from('cities')
    .select('name')
    .eq('country_code', countryCode);

  if (error) {
    console.error(`    ❌ Error fetching cities: ${error.message}`);
    return;
  }

  if (!cities || cities.length === 0) {
    console.log(`    ⚠️  No cities found for ${countryName}`);
    return;
  }

  console.log(`    📍 Found ${cities.length} cities`);

  // Обновляем фото для каждого города
  for (const city of cities) {
    console.log(`      📷 Fetching photo for ${city.name}...`);
    const cityPhoto = await getCityPhoto(city.name, countryName);

    if (cityPhoto) {
      const { error: updateError } = await supabase
        .from('cities')
        .update({ image: cityPhoto })
        .eq('country_code', countryCode)
        .eq('name', city.name);

      if (updateError) {
        console.error(`      ❌ Error updating city photo: ${updateError.message}`);
      } else {
        console.log(`      ✅ ${city.name} photo updated!`);
      }
    }

    // Пауза между запросами (rate limiting)
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}

// Главная функция
async function main() {
  console.log('🚀 Starting photo updates for South America...\n');

  // Получаем все страны South America
  const { data: countries, error } = await supabase
    .from('countries')
    .select('code, name')
    .eq('continent', 'South America')
    .order('name');

  if (error) {
    console.error('❌ Error fetching countries:', error);
    return;
  }

  if (!countries || countries.length === 0) {
    console.log('⚠️  No countries found for South America');
    return;
  }

  console.log(`📊 Found ${countries.length} countries in South America\n`);

  // Обновляем фото для каждой страны и её городов
  for (const country of countries) {
    await updateCountryPhoto(country.code, country.name);
    await updateCityPhotos(country.code, country.name);
  }

  console.log('\n✅ All photos updated for South America!');
  console.log('💡 Check your Supabase database to see the new photos.');
}

// Запуск
main().catch(console.error);
