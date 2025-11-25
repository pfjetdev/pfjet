import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

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

// Проверить, является ли изображение подходящим
function isGoodImage(imageUrl: string, width: number, height: number, title?: string): { isGood: boolean; reason?: string } {
  const url = imageUrl.toLowerCase();
  const imageTitle = (title || '').toLowerCase();

  console.log(`      Checking: ${imageUrl}`);
  console.log(`      Title: ${imageTitle}`);
  console.log(`      Size: ${width}×${height}`);

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
    'flag', 'coat_of_arms', 'emblem', 'seal', 'logo', 'brand', 'icon', 'symbol',
    'map_of', 'location_map', 'locator', 'blank_map',
  ];

  for (const pattern of badUrlPatterns) {
    if (url.includes(pattern)) {
      return { isGood: false, reason: `Contains "${pattern}" in URL` };
    }
  }

  // 4. ФИЛЬТР: Плохие индикаторы в названии
  const badTitlePatterns = [
    'dance', 'dancing', 'costume', 'clothing', 'dress', 'people', 'person',
    'man', 'woman', 'portrait', 'ceremony', 'ritual', 'wedding', 'festival',
    'performance', 'traditional', 'folk', 'logo', 'brand', 'icon',
  ];

  for (const pattern of badTitlePatterns) {
    if (imageTitle.includes(pattern)) {
      return { isGood: false, reason: `Contains "${pattern}" in title` };
    }
  }

  // 5. ФИЛЬТР: Проверяем соотношение сторон
  const aspectRatio = isGoodAspectRatio(width, height);
  if (!aspectRatio.isGood) {
    return { isGood: false, reason: `Bad aspect ratio ${aspectRatio.ratioStr}` };
  }

  return { isGood: true };
}

async function getImageDimensions(imageUrl: string): Promise<{ width: number; height: number } | null> {
  try {
    const match = imageUrl.match(/\/(\d+)px-/);
    if (match) {
      const width = parseInt(match[1]);
      const height = Math.round(width * 2 / 3);
      return { width, height };
    }

    if (imageUrl.includes('commons/thumb/')) {
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
          // Ignore
        }
      }
    }

    return { width: 1200, height: 800 };
  } catch (error) {
    return null;
  }
}

async function getAllPageImages(articleTitle: string): Promise<Array<{ url: string; title: string; width: number; height: number }>> {
  try {
    const title = formatWikipediaTitle(articleTitle);
    const url = `${WIKIPEDIA_MEDIA_API}${encodeURIComponent(title)}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PrivateJetApp/1.0',
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
    console.error(`Error: ${error}`);
    return [];
  }
}

async function testMoldova() {
  console.log('🧪 Testing Moldova image search with improved filters\n');

  const variants = [
    'Tourism in Moldova',
    'Culture of Moldova',
    'History of Moldova',
    'Geography of Moldova',
    'Moldova',
  ];

  for (const variant of variants) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`🔍 Trying: ${variant}`);
    console.log('='.repeat(80));

    // Try media list first
    const allImages = await getAllPageImages(variant);
    console.log(`\n📷 Found ${allImages.length} images total`);

    if (allImages.length > 0) {
      console.log('\n🔍 Filtering images...\n');

      let foundGood = false;
      for (let i = 0; i < Math.min(10, allImages.length); i++) {
        const image = allImages[i];
        console.log(`\n   Image ${i + 1}:`);
        const check = isGoodImage(image.url, image.width, image.height, image.title);

        if (check.isGood) {
          console.log(`      ✅ GOOD! This would be selected`);
          console.log(`      URL: ${image.url}\n`);
          foundGood = true;
          break;
        } else {
          console.log(`      ❌ Rejected: ${check.reason}\n`);
        }
      }

      if (foundGood) {
        break;
      }
    }

    // Try summary API as fallback
    const title = formatWikipediaTitle(variant);
    const summaryUrl = `${WIKIPEDIA_SUMMARY_API}${encodeURIComponent(title)}`;

    const response = await fetch(summaryUrl, {
      headers: {
        'User-Agent': 'PrivateJetApp/1.0',
      },
    });

    if (response.ok) {
      const data: WikipediaSummary = await response.json();

      if (data.originalimage) {
        console.log('\n   Summary API image:');
        const check = isGoodImage(
          data.originalimage.source,
          data.originalimage.width,
          data.originalimage.height,
          data.title
        );

        if (check.isGood) {
          console.log(`      ✅ GOOD! This would be selected`);
          console.log(`      URL: ${data.originalimage.source}\n`);
          break;
        } else {
          console.log(`      ❌ Rejected: ${check.reason}\n`);
        }
      }
    }
  }
}

testMoldova().catch(console.error);
