import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Wikipedia REST API endpoints
const WIKIPEDIA_SUMMARY_API = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const WIKIPEDIA_MEDIA_API = 'https://en.wikipedia.org/api/rest_v1/page/media-list/';

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

interface WikipediaMediaItem {
  type: string;
  section?: string;
  titles?: {
    canonical?: string;
    normalized?: string;
    display?: string;
  };
  srcset?: Array<{
    src: string;
    scale: string;
  }>;
}

interface WikipediaMediaList {
  items: WikipediaMediaItem[];
}

// Форматировать название для Wikipedia API
function formatWikipediaTitle(name: string): string {
  return name.replace(/ /g, '_');
}

// Проверить соотношение сторон изображения (для landscape формата, близко к 16:9)
function isGoodAspectRatio(width: number, height: number): { isGood: boolean; ratio: number; ratioStr: string } {
  const ratio = width / height;

  // Более строгий диапазон, ближе к 16:9 (1.778)
  // Идеальные форматы: 3:2 (1.5), 16:10 (1.6), 16:9 (1.778), 2:1 (2.0)
  const minRatio = 1.4;  // Чуть шире чем 4:3
  const maxRatio = 2.0;  // До 2:1

  const isGood = ratio >= minRatio && ratio <= maxRatio;
  const ratioStr = `${width}×${height} (${ratio.toFixed(2)}:1)`;

  return { isGood, ratio, ratioStr };
}

// Проверить, является ли изображение подходящим (не флаг, не карта, не герб)
function isGoodImage(imageUrl: string, width: number, height: number, title?: string): { isGood: boolean; reason?: string } {
  const url = imageUrl.toLowerCase();
  const imageTitle = (title || '').toLowerCase();

  // 1. ФИЛЬТР: Только JPG/JPEG файлы (PNG обычно логотипы, SVG - графика)
  if (!url.endsWith('.jpg') && !url.endsWith('.jpeg')) {
    return { isGood: false, reason: 'Not a JPG/JPEG file (likely logo/graphic)' };
  }

  // 2. ФИЛЬТР: Минимальный размер (логотипы обычно маленькие)
  if (width < 800 || height < 500) {
    return { isGood: false, reason: `Too small: ${width}×${height} (min 800×500)` };
  }

  // 3. ФИЛЬТР: Плохие индикаторы в URL
  const badUrlPatterns = [
    'flag',
    'coat_of_arms',
    'emblem',
    'seal',
    'logo',
    'brand',
    'icon',
    'symbol',
    'map_of',
    'location_map',
    'locator',
    'blank_map',
  ];

  for (const pattern of badUrlPatterns) {
    if (url.includes(pattern)) {
      return { isGood: false, reason: `Contains "${pattern}" in URL` };
    }
  }

  // 4. ФИЛЬТР: Плохие индикаторы в названии изображения (исключаем танцы, одежду, культуру и т.д.)
  const badTitlePatterns = [
    'dance', 'dancing', 'танец',
    'costume', 'clothing', 'dress', 'одежда',
    'people', 'person', 'man', 'woman', 'человек',
    'portrait', 'портрет',
    'ceremony', 'ritual', 'церемония',
    'wedding', 'свадьба',
    'festival', 'фестиваль',
    'performance', 'выступление',
    'traditional', 'традиционный',
    'folk', 'народный',
    'logo', 'brand', 'icon',
  ];

  for (const pattern of badTitlePatterns) {
    if (imageTitle.includes(pattern)) {
      return { isGood: false, reason: `Contains "${pattern}" in title` };
    }
  }

  // 5. ФИЛЬТР: Проверяем соотношение сторон (близко к 16:9)
  const aspectRatio = isGoodAspectRatio(width, height);
  if (!aspectRatio.isGood) {
    return { isGood: false, reason: `Bad aspect ratio ${aspectRatio.ratioStr}` };
  }

  return { isGood: true };
}

// Получить размеры изображения по URL
async function getImageDimensions(imageUrl: string): Promise<{ width: number; height: number } | null> {
  try {
    // 1. Пытаемся извлечь размеры из URL (Wikipedia часто включает размеры в URL)
    const match = imageUrl.match(/\/(\d+)px-/);
    if (match) {
      const width = parseInt(match[1]);
      // Предполагаем соотношение 3:2 для оценки
      const height = Math.round(width * 2 / 3);
      return { width, height };
    }

    // 2. Если URL содержит "commons/thumb/", получаем оригинальный размер из метаданных
    if (imageUrl.includes('commons/thumb/')) {
      // Пробуем получить информацию из Wikimedia Commons API
      const filename = imageUrl.split('/').pop()?.replace(/^\d+px-/, '');
      if (filename) {
        try {
          const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=size&format=json&origin=*`;
          const response = await fetch(apiUrl);
          const data = await response.json();
          const pages = data.query?.pages;
          if (pages) {
            const pageId = Object.keys(pages)[0];
            const imageinfo = pages[pageId]?.imageinfo?.[0];
            if (imageinfo?.width && imageinfo?.height) {
              return { width: imageinfo.width, height: imageinfo.height };
            }
          }
        } catch (error) {
          // Игнорируем ошибки API
        }
      }
    }

    // 3. Если не получилось, возвращаем консервативные размеры
    // (чтобы логотипы с маленькими размерами были отфильтрованы)
    return { width: 1200, height: 800 };
  } catch (error) {
    return null;
  }
}

// Получить все изображения со страницы Wikipedia
async function getAllPageImages(articleTitle: string): Promise<Array<{ url: string; title: string; width: number; height: number }>> {
  try {
    const title = formatWikipediaTitle(articleTitle);
    const url = `${WIKIPEDIA_MEDIA_API}${encodeURIComponent(title)}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PrivateJetApp/1.0 (https://privatejet.com; contact@privatejet.com)',
      },
    });

    if (!response.ok) {
      return [];
    }

    const data: WikipediaMediaList = await response.json();

    const images: Array<{ url: string; title: string; width: number; height: number }> = [];

    for (const item of data.items) {
      if (item.type !== 'image') continue;

      const imageTitle = item.titles?.canonical || item.titles?.normalized || '';

      // Берем изображение максимального размера
      if (item.srcset && item.srcset.length > 0) {
        const largestImage = item.srcset[item.srcset.length - 1];
        const dimensions = await getImageDimensions(largestImage.src);

        if (dimensions) {
          images.push({
            url: largestImage.src,
            title: imageTitle,
            width: dimensions.width,
            height: dimensions.height,
          });
        }
      }
    }

    return images;
  } catch (error) {
    console.error(`    ❌ Error fetching media list: ${error instanceof Error ? error.message : error}`);
    return [];
  }
}

// Получить фото страны из Wikipedia (улучшенная версия)
async function getCountryPhoto(countryName: string): Promise<string | null> {
  // Сначала пробуем найти главный город страны и использовать его фото
  const capitalVariants: Record<string, string> = {
    'Yemen': 'Sana\'a',
    'United Arab Emirates': 'Dubai',
    'Saudi Arabia': 'Riyadh',
    'France': 'Paris',
    'United States': 'New York City',
    'Italy': 'Rome',
    'Spain': 'Barcelona',
    'Greece': 'Santorini',
    'Maldives': 'Malé',
    'Japan': 'Tokyo',
    'China': 'Beijing',
    'Thailand': 'Bangkok',
    'Egypt': 'Cairo',
    'Morocco': 'Marrakesh',
    'Brazil': 'Rio de Janeiro',
  };

  // Пробуем множество вариантов
  const variants = [
    capitalVariants[countryName],           // Столица или главный город
    `Tourism in ${countryName}`,            // Туризм
    `Culture of ${countryName}`,            // Культура
    `History of ${countryName}`,            // История
    `Geography of ${countryName}`,          // География
    countryName,                            // Основная статья
  ].filter(Boolean) as string[];

  for (const variant of variants) {
    try {
      console.log(`    🔍 Trying: ${variant}`);

      // Сначала пробуем получить изображения через media-list API
      const allImages = await getAllPageImages(variant);

      if (allImages.length > 0) {
        console.log(`       📷 Found ${allImages.length} images, filtering...`);

        // Фильтруем и сортируем изображения
        for (const image of allImages) {
          const imageCheck = isGoodImage(image.url, image.width, image.height, image.title);

          if (imageCheck.isGood) {
            const aspectRatio = isGoodAspectRatio(image.width, image.height);
            console.log(`    ✅ Found! ${aspectRatio.ratioStr}`);
            console.log(`       Title: ${image.title}`);
            return image.url;
          }
        }

        console.log(`       ⚠️  All images filtered out`);
      }

      // Если не получилось, пробуем старый метод через summary API
      const title = formatWikipediaTitle(variant);
      const url = `${WIKIPEDIA_SUMMARY_API}${encodeURIComponent(title)}`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'PrivateJetApp/1.0 (https://privatejet.com; contact@privatejet.com)',
        },
      });

      if (!response.ok) {
        console.log(`       ⚠️  Article not found`);
        continue;
      }

      const data: WikipediaSummary = await response.json();

      if (!data.originalimage) {
        console.log(`       ⚠️  No image in article`);
        continue;
      }

      const imageCheck = isGoodImage(
        data.originalimage.source,
        data.originalimage.width,
        data.originalimage.height,
        data.title
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
    } else {
      currentSource = 'Other';
    }
  }

  console.log(`    🔄 Updating photo (current: ${currentSource})...`);

  // Получаем фото из Wikipedia
  const photoUrl = await getCountryPhoto(countryName);

  if (!photoUrl) {
    console.log(`    ❌ No photo found on Wikipedia`);
    return 'failed';
  }

  // Исправляем URL: добавляем https: если URL начинается с //
  const fixedPhotoUrl = photoUrl.startsWith('//') ? `https:${photoUrl}` : photoUrl;

  // Обновляем в базе данных
  const { error } = await supabase
    .from('countries')
    .update({ image: fixedPhotoUrl })
    .eq('code', countryCode);

  if (error) {
    console.error(`    ❌ Database error: ${error.message}`);
    return 'failed';
  }

  console.log(`    ✅ Photo updated! (${currentSource} → Wikipedia)`);
  return 'updated';
}

// Главная функция
async function main() {
  console.log('🚀 Starting IMPROVED Wikipedia photo updates for ALL COUNTRIES...\n');
  console.log('✨ Using media-list API to get better images!\n');
  console.log('⚠️  WARNING: This will UPDATE ALL COUNTRIES, replacing existing photos!\n');

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

  // Обновляем ВСЕ страны без исключений
  const countriesToUpdate = countries;

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
    await new Promise(resolve => setTimeout(resolve, 1000));
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
}

// Запуск
main().catch(console.error);
