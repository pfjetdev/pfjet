import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Use SERVICE_ROLE key for scripts (bypasses RLS)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!
);

// OpenRouter API configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;
const OPENROUTER_MODEL = 'openai/gpt-4o-mini';

// Category mapping
const categoryMapping: Record<string, string> = {
  'Turboprop': 'turboprop',
  'Very Light': 'very-light',
  'Light': 'light',
  'Midsize': 'midsize',
  'Super-mid': 'super-mid',
  'Heavy': 'heavy',
  'Ultra Long': 'ultra-long',
  'Vip airliner': 'vip-airliner',
};

// Helper function to create slug from name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '')
    .replace(/\-+/g, '-');
}

// Parse Aircraft.md file
function parseAircraftFile(): Map<string, string[]> {
  const filePath = path.resolve(process.cwd(), 'Aircarft.md');
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const aircraftByCategory = new Map<string, string[]>();
  let currentCategory = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check if it's a category line (ends with colon)
    if (trimmed.endsWith(':')) {
      currentCategory = trimmed.slice(0, -1);
      aircraftByCategory.set(currentCategory, []);
    } else if (currentCategory) {
      // It's an aircraft name
      aircraftByCategory.get(currentCategory)!.push(trimmed);
    }
  }

  return aircraftByCategory;
}

// Call OpenRouter API with retry logic
async function callOpenRouter(prompt: string, retries: number = 3): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`    🔄 API attempt ${attempt}/${retries}...`);

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.YOUR_SITE_URL || 'http://localhost:3000',
          'X-Title': process.env.YOUR_SITE_NAME || 'Private Jet Travel',
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`    ❌ HTTP ${response.status}: ${errorText}`);

        // Retry on 500 errors
        if (response.status >= 500 && attempt < retries) {
          console.log(`    ⏳ Waiting 5 seconds before retry...`);
          await new Promise(resolve => setTimeout(resolve, 5000));
          continue;
        }

        throw new Error(`OpenRouter API error (${response.status}): ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from OpenRouter');
      }

      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error(`    ❌ Attempt ${attempt} failed:`, error);

      if (attempt === retries) {
        throw error;
      }

      console.log(`    ⏳ Waiting 5 seconds before retry...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  throw new Error('All retry attempts failed');
}

// Generate aircraft data using AI
async function generateAircraftData(aircraftName: string, _category: string) {
  console.log(`  🤖 Generating data for ${aircraftName}...`);

  const prompt = `You are a luxury private aviation expert. Generate detailed, professional information for the "${aircraftName}" private jet.

Return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:

{
  "description": "A 1-2 sentence engaging description for listing pages (100-150 characters)",
  "fullDescription": "A detailed 3-4 sentence luxury description highlighting the aircraft's key benefits, technology, and luxury features (250-350 characters)",
  "specifications": {
    "passengers": "Up to X" or "X-Y" format,
    "range": "X,XXX nm" format (nautical miles),
    "speed": "XXX mph" format,
    "baggage": "XX cu ft" format (cubic feet),
    "cabin_height": "X.X ft" format,
    "cabin_width": "X.X ft" format
  },
  "features": [
    "Feature 1",
    "Feature 2",
    "Feature 3",
    "Feature 4",
    "Feature 5",
    "Feature 6"
  ]
}

Make it luxurious, professional, and emphasize comfort, technology, and performance. Features should be specific amenities and capabilities.`;

  let aiResponse = ''; // Declare outside try block
  try {
    aiResponse = await callOpenRouter(prompt);

    // Try to extract JSON from the response
    let jsonStr = aiResponse;

    // Remove markdown code blocks if present
    if (jsonStr.includes('```')) {
      const match = jsonStr.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
      if (match) {
        jsonStr = match[1];
      }
    }

    const data = JSON.parse(jsonStr);
    console.log(`  ✅ AI data generated successfully`);
    return data;
  } catch (error) {
    console.error(`  ❌ Error parsing AI response:`, error);
    console.error(`  Response was:`, aiResponse);
    throw error;
  }
}

// Get placeholder photo (NOT using Unsplash to save API limits)
async function getAircraftPhoto(aircraftName: string, categorySlug: string): Promise<string> {
  console.log(`  📷 Using placeholder image (Unsplash disabled to save limits)`);

  // Use category-specific placeholder images
  const placeholders: Record<string, string> = {
    'turboprop': '/aircraft/turboprops.png',
    'very-light': '/aircraft/verylightjet.png',
    'light': '/aircraft/lightjet.png',
    'midsize': '/aircraft/midsizejet.png',
    'super-mid': '/aircraft/supermidjet.png',
    'heavy': '/aircraft/heavyjet.png',
    'ultra-long': '/aircraft/ultralongjet.png',
    'vip-airliner': '/aircraft/vipairliner.png',
  };

  return placeholders[categorySlug] || '/aircraft/placeholder.png';
}

// Save aircraft to Supabase
async function saveAircraftToSupabase(
  aircraftName: string,
  category: string,
  aiData: any,
  photoUrl: string
) {
  const slug = createSlug(aircraftName);
  const categorySlug = categoryMapping[category] || createSlug(category);

  // Use the main photo for all gallery images (can be updated later)
  const galleryImages = [photoUrl, photoUrl, photoUrl];

  const aircraftData = {
    name: aircraftName,
    slug,
    category,
    category_slug: categorySlug,
    description: aiData.description,
    full_description: aiData.fullDescription,
    passengers: aiData.specifications.passengers,
    range: aiData.specifications.range,
    speed: aiData.specifications.speed,
    baggage: aiData.specifications.baggage,
    cabin_height: aiData.specifications.cabin_height,
    cabin_width: aiData.specifications.cabin_width,
    features: aiData.features,
    gallery: galleryImages,
    image: photoUrl,
  };

  try {
    const { data, error } = await supabase
      .from('aircraft')
      .upsert(aircraftData, {
        onConflict: 'slug',
      })
      .select();

    if (error) {
      console.error(`  ❌ Error saving to Supabase:`, error.message);
      throw error;
    }

    console.log(`  ✅ Saved to Supabase!`);
    return data;
  } catch (error) {
    console.error(`  ❌ Error in saveAircraftToSupabase:`, error);
    throw error;
  }
}

// Process a single aircraft
async function processAircraft(
  aircraftName: string,
  category: string,
  delay: number = 2000
) {
  console.log(`\n📍 Processing: ${aircraftName} (${category})`);

  try {
    // Generate AI data
    const aiData = await generateAircraftData(aircraftName, category);
    await new Promise(resolve => setTimeout(resolve, delay));

    // Get placeholder photo (NO Unsplash API calls)
    const categorySlug = categoryMapping[category] || createSlug(category);
    const photoUrl = await getAircraftPhoto(aircraftName, categorySlug);

    // Save to Supabase
    await saveAircraftToSupabase(aircraftName, category, aiData, photoUrl);

    console.log(`✅ ${aircraftName} completed!\n`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to process ${aircraftName}:`, error);
    return false;
  }
}

// Main function
async function main() {
  console.log('🚀 Starting Aircraft Data Generation...\n');

  // Parse the Aircraft.md file
  const aircraftByCategory = parseAircraftFile();

  console.log('📋 Aircraft to process:');
  let totalCount = 0;
  aircraftByCategory.forEach((aircraft, category) => {
    console.log(`  ${category}: ${aircraft.length} aircraft`);
    totalCount += aircraft.length;
  });
  console.log(`\n📊 Total: ${totalCount} aircraft\n`);

  let processed = 0;
  let succeeded = 0;
  let failed = 0;

  // Process each category
  for (const [category, aircraftList] of aircraftByCategory.entries()) {
    console.log(`\n🔷 Category: ${category}`);
    console.log(`${'='.repeat(50)}`);

    for (const aircraftName of aircraftList) {
      const success = await processAircraft(aircraftName, category);
      processed++;

      if (success) {
        succeeded++;
      } else {
        failed++;
      }

      console.log(`📊 Progress: ${processed}/${totalCount} (✅ ${succeeded} | ❌ ${failed})`);

      // Add a longer delay between aircraft to avoid rate limits
      if (processed < totalCount) {
        console.log('⏳ Waiting before next aircraft...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('🎉 Aircraft Generation Complete!');
  console.log(`📊 Final Results:`);
  console.log(`   Total: ${totalCount}`);
  console.log(`   ✅ Succeeded: ${succeeded}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log('='.repeat(50));
  console.log('\n💡 Next steps:');
  console.log('   1. Check your Supabase database');
  console.log('   2. Update the aircraft page to fetch from Supabase');
  console.log('   3. Add more gallery images if needed\n');
}

// Run the script
main().catch(console.error);
