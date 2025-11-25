import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Cities that were just added
const newCities = [
  'Bahamas',
  'Cabo San Lucas',
  'Courchevel',
  'Fiji',
  'Florianópolis',
  'Galápagos',
  'Great Barrier Reef',
  'Maldives',
  'Mallorca',
  'Mauritius',
  'New York',
  'Sardinia',
  'Seychelles',
  'St. Moritz',
  'Tasmania',
  'Zanzibar'
];

interface WikipediaImage {
  title: string;
  url: string;
  width: number;
  height: number;
}

// Get images from Wikipedia media-list API
async function getWikipediaImages(pageName: string): Promise<WikipediaImage[]> {
  const url = `https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(pageName)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Wikipedia API error: ${response.status}`);
  }

  const data = await response.json();
  const items = data.items || [];

  const images: WikipediaImage[] = [];
  for (const item of items) {
    if (item.type === 'image' && item.srcset && item.srcset.length > 0) {
      const largest = item.srcset[item.srcset.length - 1];
      images.push({
        title: item.title || '',
        url: largest.src,
        width: largest.width || 0,
        height: largest.height || 0
      });
    }
  }

  return images;
}

// Check if image is good quality
function isGoodImage(imageUrl: string, width: number, height: number, title?: string): boolean {
  const url = imageUrl.toLowerCase();
  const imageTitle = (title || '').toLowerCase();

  // 1. Only JPG/JPEG files
  if (!url.endsWith('.jpg') && !url.endsWith('.jpeg')) {
    return false;
  }

  // 2. Minimum size
  if (width < 800 || height < 500) {
    return false;
  }

  // 3. Exclude unwanted patterns
  const badPatterns = [
    'flag', 'logo', 'coat', 'emblem', 'seal', 'map', 'locator',
    'dance', 'costume', 'traditional', 'people', 'portrait',
    'diagram', 'chart', 'graph', 'icon'
  ];

  for (const pattern of badPatterns) {
    if (url.includes(pattern) || imageTitle.includes(pattern)) {
      return false;
    }
  }

  // 4. Check aspect ratio (prefer landscape 1.4:1 to 2:1)
  const ratio = width / height;
  if (ratio < 1.4 || ratio > 2.0) {
    return false;
  }

  return true;
}

// Find best photo for a city
async function findBestCityPhoto(cityName: string): Promise<string | null> {
  console.log(`  🔍 Searching Wikipedia for: ${cityName}`);

  // Try different search variations
  const searchVariations = [
    cityName,
    `${cityName} city`,
    `Tourism in ${cityName}`,
  ];

  for (const searchTerm of searchVariations) {
    try {
      console.log(`    - Trying: "${searchTerm}"`);

      const images = await getWikipediaImages(searchTerm);
      console.log(`    - Found ${images.length} total images`);

      // Filter good images
      const goodImages = images.filter(img =>
        isGoodImage(img.url, img.width, img.height, img.title)
      );

      console.log(`    - Filtered to ${goodImages.length} good images`);

      if (goodImages.length > 0) {
        // Return the first good image
        const selectedImage = goodImages[0];
        const fixedUrl = selectedImage.url.startsWith('//')
          ? `https:${selectedImage.url}`
          : selectedImage.url;

        console.log(`    ✅ Selected: ${selectedImage.title || 'Untitled'}`);
        console.log(`    📐 Size: ${selectedImage.width}×${selectedImage.height}`);

        return fixedUrl;
      }

      // Small delay between variations
      await new Promise(resolve => setTimeout(resolve, 200));

    } catch (error) {
      console.log(`    ⚠️  Error with "${searchTerm}":`, (error as Error).message);
    }
  }

  console.log(`    ❌ No good photos found`);
  return null;
}

// Main function
async function main() {
  console.log('🚀 Updating photos for new Top Routes cities...\n');
  console.log(`📊 Total cities to update: ${newCities.length}\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < newCities.length; i++) {
    const cityName = newCities[i];
    console.log(`\n[${i + 1}/${newCities.length}] ${cityName}`);
    console.log('='.repeat(60));

    try {
      // Find best photo
      const photoUrl = await findBestCityPhoto(cityName);

      if (!photoUrl) {
        console.log(`  ⚠️  No suitable photo found, skipping...`);
        failCount++;
        continue;
      }

      // Update in database
      console.log('  💾 Updating in database...');
      const { error } = await supabase
        .from('cities')
        .update({ image: photoUrl })
        .eq('name', cityName);

      if (error) {
        console.error(`  ❌ Database error:`, error.message);
        failCount++;
      } else {
        console.log(`  ✅ Photo updated successfully!`);
        successCount++;
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`  ❌ Error:`, error);
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESULTS:');
  console.log(`  ✅ Successfully updated: ${successCount}`);
  console.log(`  ❌ Failed: ${failCount}`);
  console.log('='.repeat(60));
}

main().catch(console.error);
