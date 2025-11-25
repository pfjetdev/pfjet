import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Wikipedia REST API v1 - бесплатный, без лимитов
const WIKIPEDIA_API = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

interface WikipediaImage {
  source: string;
  width: number;
  height: number;
}

interface WikipediaSummary {
  title: string;
  thumbnail?: WikipediaImage;
  originalimage?: WikipediaImage;
  description?: string;
}

// Форматировать название для Wikipedia API
function formatWikipediaTitle(name: string): string {
  // Заменяем пробелы на подчеркивания
  return name.replace(/ /g, '_');
}

// Проверить, является ли изображение подходящим (не флаг, не карта, не герб)
function isGoodImage(imageUrl: string, description?: string): boolean {
  const url = imageUrl.toLowerCase();
  const desc = (description || '').toLowerCase();

  // Плохие индикаторы в URL
  const badPatterns = [
    'flag',
    'coat_of_arms',
    'emblem',
    'seal',
    'logo',
    'map_of',
    'location_map',
    'locator',
    'blank_map',
  ];

  // Проверяем URL
  for (const pattern of badPatterns) {
    if (url.includes(pattern)) {
      return false;
    }
  }

  return true;
}

// Получить фото страны из Wikipedia (с несколькими стратегиями)
async function getCountryPhoto(countryName: string): Promise<string | null> {
  // Пробуем несколько вариантов для стран (чтобы избежать флагов)
  const variants = [
    `Tourism in ${countryName}`,        // "Tourism in France" - обычно имеет хорошие фото
    countryName,                         // Основная статья
    `Geography of ${countryName}`,       // География
  ];

  for (const variant of variants) {
    try {
      const title = formatWikipediaTitle(variant);
      const url = `${WIKIPEDIA_API}${encodeURIComponent(title)}`;

      console.log(`    🔍 Trying: ${variant}`);

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'PrivateJetApp/1.0 (https://privatejet.com; contact@privatejet.com)',
        },
      });

      if (!response.ok) {
        continue; // Пробуем следующий вариант
      }

      const data: WikipediaSummary = await response.json();

      // Пробуем получить оригинальное изображение (высокое качество)
      if (data.originalimage && isGoodImage(data.originalimage.source, data.description)) {
        console.log(`    ✅ Found! ${data.originalimage.width}x${data.originalimage.height}`);
        return data.originalimage.source;
      }

      // Если оригинала нет, берем thumbnail
      if (data.thumbnail && isGoodImage(data.thumbnail.source, data.description)) {
        console.log(`    ✅ Found! ${data.thumbnail.width}x${data.thumbnail.height}`);
        return data.thumbnail.source;
      }

      console.log(`    ⚠️  Image filtered (flag/map/emblem), trying next...`);
    } catch (error) {
      console.error(`    ❌ Error: ${error instanceof Error ? error.message : error}`);
      continue;
    }
  }

  console.log(`    ⚠️  No suitable image found after all attempts`);
  return null;
}

// Получить фото города из Wikipedia
async function getCityPhoto(cityName: string, countryName: string): Promise<string | null> {
  try {
    // Пробуем несколько вариантов названия
    const variants = [
      cityName, // "Paris"
      `${cityName}, ${countryName}`, // "Paris, France"
      `${cityName} (${countryName})`, // "Paris (France)"
    ];

    for (const variant of variants) {
      const title = formatWikipediaTitle(variant);
      const url = `${WIKIPEDIA_API}${encodeURIComponent(title)}`;

      console.log(`      🔍 Trying: ${variant}`);

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'PrivateJetApp/1.0 (https://privatejet.com; contact@privatejet.com)',
        },
      });

      if (!response.ok) {
        continue; // Пробуем следующий вариант
      }

      const data: WikipediaSummary = await response.json();

      // Пробуем оригинальное изображение
      if (data.originalimage && isGoodImage(data.originalimage.source, data.description)) {
        console.log(`      ✅ Found: ${data.originalimage.width}x${data.originalimage.height}`);
        return data.originalimage.source;
      }

      // Пробуем thumbnail
      if (data.thumbnail && isGoodImage(data.thumbnail.source, data.description)) {
        console.log(`      ✅ Found: ${data.thumbnail.width}x${data.thumbnail.height}`);
        return data.thumbnail.source;
      }
    }

    console.log(`      ⚠️  No suitable image found after trying all variants`);
    return null;
  } catch (error) {
    console.error(`      ❌ Error:`, error instanceof Error ? error.message : error);
    return null;
  }
}

// Обновить фото для страны
async function updateCountryPhoto(countryCode: string, countryName: string): Promise<boolean> {
  console.log(`  📍 ${countryName} (${countryCode})`);

  // Проверяем, есть ли уже фото
  const { data: existing } = await supabase
    .from('countries')
    .select('image')
    .eq('code', countryCode)
    .single();

  if (existing?.image && !existing.image.includes('unsplash.com/photo-1506905925346')) {
    console.log(`    ⏭️  Already has photo, skipping...`);
    return false;
  }

  // Получаем фото из Wikipedia
  console.log(`    📷 Fetching from Wikipedia...`);
  const photoUrl = await getCountryPhoto(countryName);

  if (photoUrl) {
    const { error } = await supabase
      .from('countries')
      .update({ image: photoUrl })
      .eq('code', countryCode);

    if (error) {
      console.error(`    ❌ Database error: ${error.message}`);
      return false;
    }

    console.log(`    ✅ Country photo updated!`);
    return true;
  }

  return false;
}

// Обновить фото для городов страны
async function updateCityPhotos(countryCode: string, countryName: string): Promise<number> {
  const { data: cities, error } = await supabase
    .from('cities')
    .select('name, image')
    .eq('country_code', countryCode);

  if (error || !cities || cities.length === 0) {
    return 0;
  }

  // Фильтруем города без фото или с placeholder
  const citiesToUpdate = cities.filter(city =>
    !city.image || city.image.includes('unsplash.com/photo-1506905925346')
  );

  if (citiesToUpdate.length === 0) {
    console.log(`    ⏭️  All ${cities.length} cities already have photos`);
    return 0;
  }

  console.log(`    📍 Updating ${citiesToUpdate.length}/${cities.length} cities...`);

  let updated = 0;

  for (const city of citiesToUpdate) {
    console.log(`      📷 ${city.name}...`);
    const photoUrl = await getCityPhoto(city.name, countryName);

    if (photoUrl) {
      const { error: updateError } = await supabase
        .from('cities')
        .update({ image: photoUrl })
        .eq('country_code', countryCode)
        .eq('name', city.name);

      if (!updateError) {
        console.log(`      ✅ Updated!`);
        updated++;
      } else {
        console.error(`      ❌ Error: ${updateError.message}`);
      }
    }

    // Небольшая пауза для вежливости (хотя Wikipedia не требует)
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return updated;
}

// Главная функция
async function main() {
  console.log('🚀 Starting Wikipedia photo updates...\n');
  console.log('✨ No rate limits - updating everything at once!\n');

  // Получаем все страны
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

  // Фильтруем страны, которым нужны фото
  const countriesToUpdate = countries.filter(c =>
    !c.image || c.image.includes('unsplash.com/photo-1506905925346')
  );

  console.log(`📊 Total countries: ${countries.length}`);
  console.log(`📊 Countries needing updates: ${countriesToUpdate.length}`);
  console.log(`📊 Countries with photos: ${countries.length - countriesToUpdate.length}\n`);

  let countriesUpdated = 0;
  let citiesUpdated = 0;

  // Обновляем каждую страну
  for (let i = 0; i < countriesToUpdate.length; i++) {
    const country = countriesToUpdate[i];
    console.log(`\n[${i + 1}/${countriesToUpdate.length}] 🌍 ${country.name} (${country.continent})`);

    // Обновляем страну
    const countryResult = await updateCountryPhoto(country.code, country.name);
    if (countryResult) countriesUpdated++;

    // Обновляем города
    const citiesResult = await updateCityPhotos(country.code, country.name);
    citiesUpdated += citiesResult;

    // Небольшая пауза между странами
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Update complete!');
  console.log('='.repeat(60));
  console.log(`📊 Countries updated: ${countriesUpdated}`);
  console.log(`📊 Cities updated: ${citiesUpdated}`);
  console.log(`📊 Total images: ${countriesUpdated + citiesUpdated}`);
  console.log('\n💡 Check your Supabase database to see the new Wikipedia photos!');
}

// Запуск
main().catch(console.error);
