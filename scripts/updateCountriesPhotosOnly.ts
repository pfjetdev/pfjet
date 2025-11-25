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
  return name.replace(/ /g, '_');
}

// Проверить соотношение сторон изображения (для landscape формата)
function isGoodAspectRatio(width: number, height: number): { isGood: boolean; ratio: number; ratioStr: string } {
  const ratio = width / height;

  // Смягченный диапазон: 1.3 - 2.2
  // Покрывает: 4:3 (1.33), 3:2 (1.5), 16:10 (1.6), 16:9 (1.778), 2:1 (2.0), 2.2:1
  const minRatio = 1.3;  // Покрывает 4:3 (стандартные фото)
  const maxRatio = 2.2;  // Покрывает широкоформатные панорамы

  const isGood = ratio >= minRatio && ratio <= maxRatio;
  const ratioStr = `${width}×${height} (${ratio.toFixed(2)}:1)`;

  return { isGood, ratio, ratioStr };
}

// Проверить, является ли изображение подходящим (не флаг, не карта, не герб)
function isGoodImage(imageUrl: string, width: number, height: number, description?: string): { isGood: boolean; reason?: string } {
  const url = imageUrl.toLowerCase();

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

  for (const pattern of badPatterns) {
    if (url.includes(pattern)) {
      return { isGood: false, reason: `Contains "${pattern}" in URL` };
    }
  }

  // Проверяем соотношение сторон
  const aspectRatio = isGoodAspectRatio(width, height);
  if (!aspectRatio.isGood) {
    return { isGood: false, reason: `Bad aspect ratio ${aspectRatio.ratioStr}` };
  }

  return { isGood: true };
}

// Получить фото страны из Wikipedia (с несколькими стратегиями)
async function getCountryPhoto(countryName: string): Promise<string | null> {
  // Пробуем множество вариантов для стран (чтобы избежать флагов)
  const variants = [
    `Tourism in ${countryName}`,           // "Tourism in France" - обычно имеет хорошие фото
    `Culture of ${countryName}`,           // Культура
    `History of ${countryName}`,           // История
    `Economy of ${countryName}`,           // Экономика
    `Geography of ${countryName}`,         // География
    countryName,                           // Основная статья (последний вариант)
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
        console.log(`       ⚠️  Article not found`);
        continue; // Пробуем следующий вариант
      }

      const data: WikipediaSummary = await response.json();

      // Проверяем только originalimage (thumbnail - это то же изображение меньшего размера!)
      if (!data.originalimage) {
        console.log(`       ⚠️  No image in article`);
        continue;
      }

      const imageCheck = isGoodImage(
        data.originalimage.source,
        data.originalimage.width,
        data.originalimage.height,
        data.description
      );

      if (imageCheck.isGood) {
        const aspectRatio = isGoodAspectRatio(data.originalimage.width, data.originalimage.height);
        console.log(`    ✅ Found! ${aspectRatio.ratioStr}`);
        return data.originalimage.source;
      } else {
        console.log(`       ❌ Filtered: ${imageCheck.reason}`);
      }
    } catch (error) {
      console.error(`    ❌ Error: ${error instanceof Error ? error.message : error}`);
      continue;
    }
  }

  console.log(`    ⚠️  No suitable image found after all attempts`);
  return null;
}

// Обновить фото для страны
async function updateCountryPhoto(countryCode: string, countryName: string): Promise<'updated' | 'skipped' | 'failed'> {
  console.log(`  📍 ${countryName} (${countryCode})`);

  // Проверяем текущее фото
  const { data: existing } = await supabase
    .from('countries')
    .select('image')
    .eq('code', countryCode)
    .single();

  // Определяем источник текущего фото
  let currentSource = 'none';
  if (existing?.image) {
    if (existing.image.includes('unsplash.com')) {
      currentSource = 'Unsplash';
    } else if (existing.image.includes('pexels.com')) {
      currentSource = 'Pexels';
    } else if (existing.image.includes('wikimedia.org') || existing.image.includes('wikipedia.org')) {
      currentSource = 'Wikipedia';
      console.log(`    ✅ Already has Wikipedia photo, skipping...`);
      return 'skipped';
    } else {
      currentSource = 'Other';
    }
  }

  if (currentSource !== 'none' && currentSource !== 'Wikipedia') {
    console.log(`    🔄 Replacing ${currentSource} photo with Wikipedia...`);
  } else if (currentSource === 'none') {
    console.log(`    📷 No photo, fetching from Wikipedia...`);
  }

  // Получаем фото из Wikipedia
  const photoUrl = await getCountryPhoto(countryName);

  if (!photoUrl) {
    console.log(`    ❌ No photo found on Wikipedia`);
    return 'failed';
  }

  // Обновляем в базе данных
  const { error } = await supabase
    .from('countries')
    .update({ image: photoUrl })
    .eq('code', countryCode);

  if (error) {
    console.error(`    ❌ Database error: ${error.message}`);
    return 'failed';
  }

  if (currentSource !== 'none' && currentSource !== 'Wikipedia') {
    console.log(`    ✅ Replaced ${currentSource} → Wikipedia!`);
  } else {
    console.log(`    ✅ Wikipedia photo added!`);
  }
  return 'updated';
}

// Главная функция
async function main() {
  console.log('🚀 Starting Wikipedia photo updates for COUNTRIES ONLY...\n');
  console.log('✨ No rate limits - updating all countries at once!\n');

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

  // Фильтруем страны: обновляем те, у которых нет фото ИЛИ есть Unsplash/Pexels
  const countriesToUpdate = countries.filter(c => {
    if (!c.image) return true; // Нет фото
    if (c.image.includes('unsplash.com')) return true; // Unsplash
    if (c.image.includes('pexels.com')) return true; // Pexels
    return false; // Уже Wikipedia или другое
  });

  // Статистика по источникам
  const withUnsplash = countries.filter(c => c.image?.includes('unsplash.com')).length;
  const withPexels = countries.filter(c => c.image?.includes('pexels.com')).length;
  const withWikipedia = countries.filter(c => c.image?.includes('wikimedia.org') || c.image?.includes('wikipedia.org')).length;
  const withoutPhoto = countries.filter(c => !c.image).length;

  console.log(`📊 Total countries in database: ${countries.length}`);
  console.log(`📊 Current sources:`);
  console.log(`   - Wikipedia: ${withWikipedia}`);
  console.log(`   - Unsplash: ${withUnsplash}`);
  console.log(`   - Pexels: ${withPexels}`);
  console.log(`   - No photo: ${withoutPhoto}`);
  console.log(`📊 Countries to update: ${countriesToUpdate.length}\n`);

  if (countriesToUpdate.length === 0) {
    console.log('✅ All countries already have photos!');
    return;
  }

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  // Обновляем каждую страну
  for (let i = 0; i < countriesToUpdate.length; i++) {
    const country = countriesToUpdate[i];
    console.log(`\n[${i + 1}/${countriesToUpdate.length}] 🌍 ${country.name} (${country.continent})`);

    const result = await updateCountryPhoto(country.code, country.name);

    if (result === 'updated') updated++;
    else if (result === 'skipped') skipped++;
    else if (result === 'failed') failed++;

    // Небольшая пауза между странами (для вежливости)
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Countries update complete!');
  console.log('='.repeat(60));
  console.log(`📊 Successfully updated: ${updated}`);
  console.log(`📊 Skipped (already had photos): ${skipped}`);
  console.log(`📊 Failed (no photo found): ${failed}`);
  console.log(`📊 Total processed: ${countriesToUpdate.length}`);
  console.log(`📊 Success rate: ${Math.round((updated / countriesToUpdate.length) * 100)}%`);
  console.log('\n💡 Check your Supabase database to see the new Wikipedia photos!');
  console.log('💡 If satisfied, run updateCitiesPhotosOnly.ts to update cities next.');
}

// Запуск
main().catch(console.error);
