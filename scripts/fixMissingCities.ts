import dotenv from 'dotenv';
import path from 'path';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.YOUR_SITE_URL || "http://localhost:3000",
    "X-Title": process.env.YOUR_SITE_NAME || "Private Jet Travel",
  }
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function generateTopCities(country: string): Promise<string[]> {
  const prompt = `List exactly 4-5 top tourist cities in ${country}.
Include the capital city as first.
Format: just city names separated by commas, no numbers or explanations.
Example: Paris, Lyon, Marseille, Nice, Bordeaux`;

  const response = await openai.chat.completions.create({
    model: "openai/gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
    max_tokens: 100,
  });

  const cities = response.choices[0].message.content
    ?.split(',')
    .map(c => c.trim())
    .filter(c => c.length > 0);

  return cities || [];
}

async function generateCityDescription(city: string, country: string): Promise<string> {
  const prompt = `Write a 2-3 sentence luxury travel description for ${city}, ${country}.
Mention 1-2 key attractions and describe the city's character.
Use upscale, enthusiastic tone.
Keep it concise and compelling.`;

  const response = await openai.chat.completions.create({
    model: "openai/gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 150,
  });

  return response.choices[0].message.content || '';
}

async function getCityImage(city: string, country: string): Promise<string> {
  console.log(`    📷 Skipping photo fetch for ${city} (will update from Unsplash later)`);
  return `https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800`;
}

async function processCitiesForCountry(countryCode: string, countryName: string) {
  console.log(`\n📍 Processing cities for ${countryName}...`);

  // Генерируем список городов
  console.log('  - Generating list of top cities...');
  const cityNames = await generateTopCities(countryName);
  console.log(`  - Found ${cityNames.length} cities: ${cityNames.join(', ')}`);

  // Для каждого города генерируем описание
  for (let i = 0; i < cityNames.length && i < 5; i++) {
    const cityName = cityNames[i];
    console.log(`    - Processing ${cityName}...`);

    const cityDescription = await generateCityDescription(cityName, countryName);
    const cityImage = await getCityImage(cityName, countryName);

    // Сохраняем город в БД
    const { error: cityError } = await supabase
      .from('cities')
      .insert({
        country_code: countryCode,
        name: cityName,
        image: cityImage,
        description: cityDescription,
        is_capital: i === 0,
      });

    if (cityError) {
      console.error(`    ❌ Error saving city: ${cityError.message}`);
    } else {
      console.log(`    ✅ ${cityName} saved!`);
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

async function main() {
  console.log('🔧 Fixing missing cities for Italy and Malta...\n');

  const missingCountries = [
    { code: 'IT', name: 'Italy' },
    { code: 'MT', name: 'Malta' }
  ];

  for (const country of missingCountries) {
    await processCitiesForCountry(country.code, country.name);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n✅ All missing cities have been added!');
}

main().catch(console.error);
