// Тестовый скрипт для проверки Wikipedia API
// Проверяет несколько стран и городов

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

function formatWikipediaTitle(name: string): string {
  return name.replace(/ /g, '_');
}

function isGoodImage(imageUrl: string): boolean {
  const url = imageUrl.toLowerCase();
  const badPatterns = ['flag', 'coat_of_arms', 'emblem', 'seal', 'logo', 'map_of', 'location_map'];

  for (const pattern of badPatterns) {
    if (url.includes(pattern)) {
      return false;
    }
  }

  return true;
}

async function testWikipedia(name: string, type: 'country' | 'city') {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing ${type.toUpperCase()}: ${name}`);
  console.log('='.repeat(60));

  const title = formatWikipediaTitle(name);
  const url = `${WIKIPEDIA_API}${encodeURIComponent(title)}`;

  console.log(`URL: ${url}\n`);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PrivateJetApp/1.0',
      },
    });

    if (!response.ok) {
      console.log(`❌ Not found: ${response.status} ${response.statusText}`);
      return;
    }

    const data: WikipediaSummary = await response.json();

    console.log(`✅ Article found: ${data.title}`);
    console.log(`📝 Description: ${data.description || 'N/A'}\n`);

    if (data.originalimage) {
      console.log('📷 Original Image:');
      console.log(`   URL: ${data.originalimage.source}`);
      console.log(`   Size: ${data.originalimage.width}x${data.originalimage.height}`);
      console.log(`   Quality: ${isGoodImage(data.originalimage.source) ? '✅ Good' : '❌ Bad (flag/map/emblem)'}`);
    } else {
      console.log('📷 Original Image: ❌ Not available');
    }

    if (data.thumbnail) {
      console.log('\n📷 Thumbnail:');
      console.log(`   URL: ${data.thumbnail.source}`);
      console.log(`   Size: ${data.thumbnail.width}x${data.thumbnail.height}`);
      console.log(`   Quality: ${isGoodImage(data.thumbnail.source) ? '✅ Good' : '❌ Bad (flag/map/emblem)'}`);
    } else {
      console.log('\n📷 Thumbnail: ❌ Not available');
    }

  } catch (error) {
    console.error(`❌ Error: ${error instanceof Error ? error.message : error}`);
  }
}

async function main() {
  console.log('🚀 Testing Wikipedia API for countries and cities\n');

  // Тестируем страны
  console.log('\n🌍 TESTING COUNTRIES:\n');
  await testWikipedia('France', 'country');
  await testWikipedia('United States', 'country');
  await testWikipedia('Maldives', 'country');
  await testWikipedia('Turks and Caicos Islands', 'country');
  await testWikipedia('Saint Barthélemy', 'country');
  await testWikipedia('Sint Maarten', 'country');

  // Тестируем города
  console.log('\n\n🏙️ TESTING CITIES:\n');
  await testWikipedia('Paris', 'city');
  await testWikipedia('New York City', 'city');
  await testWikipedia('Los Angeles', 'city');
  await testWikipedia('Miami', 'city');
  await testWikipedia('Malé', 'city');
  await testWikipedia('Providenciales', 'city');
  await testWikipedia('Gustavia', 'city');
  await testWikipedia('Philipsburg, Sint Maarten', 'city');

  console.log('\n' + '='.repeat(60));
  console.log('✅ Test complete!');
  console.log('='.repeat(60));
}

main().catch(console.error);
