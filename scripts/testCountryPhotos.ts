// Тест улучшенной стратегии для стран

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

function isGoodAspectRatio(width: number, height: number): { isGood: boolean; ratio: number } {
  const ratio = width / height;
  const minRatio = 1.3;  // 4:3 (стандартные фото)
  const maxRatio = 2.2;  // Широкоформатные панорамы
  const isGood = ratio >= minRatio && ratio <= maxRatio;
  return { isGood, ratio };
}

function isGoodImage(imageUrl: string, width: number, height: number): { isGood: boolean; reason?: string } {
  const url = imageUrl.toLowerCase();
  const badPatterns = ['flag', 'coat_of_arms', 'emblem', 'seal', 'logo', 'map_of', 'location_map'];

  for (const pattern of badPatterns) {
    if (url.includes(pattern)) {
      return { isGood: false, reason: `Contains "${pattern}"` };
    }
  }

  const aspectRatio = isGoodAspectRatio(width, height);
  if (!aspectRatio.isGood) {
    return { isGood: false, reason: `Bad aspect ratio ${aspectRatio.ratio.toFixed(2)}:1 (need 1.3-2.2)` };
  }

  return { isGood: true };
}

async function testCountry(countryName: string) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing: ${countryName}`);
  console.log('='.repeat(60));

  const variants = [
    `Tourism in ${countryName}`,
    countryName,
    `Geography of ${countryName}`,
  ];

  for (const variant of variants) {
    const title = formatWikipediaTitle(variant);
    const url = `${WIKIPEDIA_API}${encodeURIComponent(title)}`;

    console.log(`\n🔍 Trying: ${variant}`);

    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'PrivateJetApp/1.0' },
      });

      if (!response.ok) {
        console.log(`   ❌ Not found (${response.status})`);
        continue;
      }

      const data: WikipediaSummary = await response.json();
      console.log(`   ✅ Article found: "${data.title}"`);

      if (data.originalimage) {
        const aspectRatio = isGoodAspectRatio(data.originalimage.width, data.originalimage.height);
        const imageCheck = isGoodImage(data.originalimage.source, data.originalimage.width, data.originalimage.height);

        console.log(`   📷 Image: ${data.originalimage.width}×${data.originalimage.height}`);
        console.log(`   📐 Aspect ratio: ${aspectRatio.ratio.toFixed(2)}:1 ${aspectRatio.isGood ? '✅' : '❌ (need 1.3-2.2 for landscape)'}`);

        console.log(`   Quality: ${imageCheck.isGood ? '✅ GOOD' : `❌ BAD (${imageCheck.reason})`}`);

        if (imageCheck.isGood) {
          console.log(`   🎯 URL: ${data.originalimage.source}`);
          console.log(`\n   ✨ SUCCESS! This will be used.`);
          return;
        }
      } else {
        console.log(`   ⚠️  No image available`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error}`);
    }
  }

  console.log(`\n   ❌ FAILED: No good image found for ${countryName}`);
}

async function main() {
  console.log('🚀 Testing improved country photo strategy\n');

  await testCountry('France');
  await testCountry('United States');
  await testCountry('Maldives');
  await testCountry('Turks and Caicos Islands');
  await testCountry('Sint Maarten');
  await testCountry('Japan');
  await testCountry('Switzerland');

  console.log('\n' + '='.repeat(60));
  console.log('✅ Test complete!');
  console.log('='.repeat(60));
}

main().catch(console.error);
