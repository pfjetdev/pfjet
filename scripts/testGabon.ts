// Быстрый тест для Gabon

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
  const minRatio = 1.3;
  const maxRatio = 2.2;
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
    return { isGood: false, reason: `Bad aspect ratio ${aspectRatio.ratio.toFixed(2)}:1` };
  }

  return { isGood: true };
}

async function testGabon() {
  console.log('🧪 Testing Gabon photo search\n');

  const variants = [
    'Tourism in Gabon',
    'Culture of Gabon',
    'History of Gabon',
    'Economy of Gabon',
    'Geography of Gabon',
    'Gabon',
  ];

  for (const variant of variants) {
    console.log(`\n🔍 Trying: ${variant}`);
    console.log('─'.repeat(50));

    const title = formatWikipediaTitle(variant);
    const url = `${WIKIPEDIA_API}${encodeURIComponent(title)}`;

    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'PrivateJetApp/1.0' },
      });

      if (!response.ok) {
        console.log(`❌ Article not found (${response.status})`);
        continue;
      }

      const data: WikipediaSummary = await response.json();
      console.log(`✅ Article found: "${data.title}"`);

      if (!data.originalimage) {
        console.log(`⚠️  No image in this article`);
        continue;
      }

      const aspectRatio = isGoodAspectRatio(data.originalimage.width, data.originalimage.height);
      const imageCheck = isGoodImage(data.originalimage.source, data.originalimage.width, data.originalimage.height);

      console.log(`📷 Image: ${data.originalimage.width}×${data.originalimage.height}`);
      console.log(`📐 Aspect: ${aspectRatio.ratio.toFixed(2)}:1 ${aspectRatio.isGood ? '✅' : '❌'}`);
      console.log(`🔍 URL: ${data.originalimage.source.substring(0, 80)}...`);
      console.log(`✨ Result: ${imageCheck.isGood ? '✅ GOOD - Will use this!' : `❌ ${imageCheck.reason}`}`);

      if (imageCheck.isGood) {
        console.log(`\n🎉 SUCCESS! Found good image for Gabon!`);
        return;
      }
    } catch (error) {
      console.log(`❌ Error: ${error}`);
    }
  }

  console.log(`\n😞 No suitable image found for Gabon after all attempts`);
}

testGabon().catch(console.error);
