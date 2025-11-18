import dotenv from 'dotenv';
import path from 'path';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { createClient as createPexelsClient } from 'pexels';
import { countriesByContinent, type Continent } from '../src/data/countries';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Используем OpenRouter с Google Gemini Flash 1.5
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

const pexels = createPexelsClient(process.env.PEXELS_API_KEY!);

// Генерация описания страны
async function generateCountryDescription(country: string): Promise<string> {
  const prompt = `Write a luxury travel description for ${country} in an elegant, upscale style.

Example style:
"Discover the enchanting beauty of Iceland, where luxury meets breathtaking landscapes. Your journey begins in Reykjavik, the cosmopolitan capital offering boutique hotels and world-class dining. Experience the Blue Lagoon, a geothermal spa set against dramatic volcanic scenery. Explore the Golden Circle, featuring the majestic Gullfoss waterfall and historic Thingvellir National Park. Venture to the remote Westfjords for pristine fjords and natural hot springs. In northern Iceland, Akureyri captivates with its vibrant culture and whale-watching opportunities."

Requirements:
- Start with a VARIED opening (use different phrases like "Discover", "Immerse yourself in", "Experience", "Journey to", "Explore the wonders of", etc.)
- Mention 3-4 must-visit locations in ${country}
- Include luxury experiences (boutique hotels, fine dining, exclusive activities)
- Highlight natural beauty and cultural attractions
- Around 120-150 words
- Enthusiastic, sophisticated tone
- End with a compelling closing sentence
- Make it sound unique and natural, not repetitive`;

  const response = await openai.chat.completions.create({
    model: "openai/gpt-4o-mini", // GPT-4o Mini - быстро и дешево!
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
    max_tokens: 300,
  });

  return response.choices[0].message.content || '';
}

// Получить URL фото страны - временно используем placeholder
async function getCountryImage(country: string): Promise<string> {
  // ОТКЛЮЧЕНО: Фото будут обновлены позже из Unsplash
  console.log(`  📷 Skipping photo fetch for ${country} (will update from Unsplash later)`);
  return `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600`;
}

// Генерация списка топ городов
async function generateTopCities(country: string): Promise<string[]> {
  const prompt = `List exactly 4-5 top tourist cities in ${country}.
Include the capital city as first.
Format: just city names separated by commas, no numbers or explanations.
Example: Paris, Lyon, Marseille, Nice, Bordeaux`;

  const response = await openai.chat.completions.create({
    model: "openai/gpt-4o-mini", // GPT-4o Mini - быстро и дешево!
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

// Генерация описания города
async function generateCityDescription(city: string, country: string): Promise<string> {
  const prompt = `Write a 2-3 sentence luxury travel description for ${city}, ${country}.
Mention 1-2 key attractions and describe the city's character.
Use upscale, enthusiastic tone.
Keep it concise and compelling.`;

  const response = await openai.chat.completions.create({
    model: "openai/gpt-4o-mini", // GPT-4o Mini - быстро и дешево!
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 150,
  });

  return response.choices[0].message.content || '';
}

// Получить URL фото города - временно используем placeholder
async function getCityImage(city: string, country: string): Promise<string> {
  // ОТКЛЮЧЕНО: Фото будут обновлены позже из Unsplash
  console.log(`    📷 Skipping photo fetch for ${city} (will update from Unsplash later)`);
  return `https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800`;
}

// Обработка одной страны
async function processCountry(country: any, continent: Continent) {
  console.log(`\n📍 Processing ${country.name}...`);

  try {
    // 1. Генерируем описание страны
    console.log('  - Generating country description...');
    const description = await generateCountryDescription(country.name);

    // 2. Получаем фото
    console.log('  - Fetching country image from Pexels...');
    const image = await getCountryImage(country.name);

    // 3. Сохраняем страну в БД
    console.log('  - Saving country to database...');
    const { data: countryData, error: countryError } = await supabase
      .from('countries')
      .insert({
        code: country.code,
        name: country.name,
        flag: country.flag,
        image: image,
        description: description,
        continent: continent,
      })
      .select()
      .single();

    if (countryError) {
      console.error(`  ❌ Error saving country: ${countryError.message}`);
      return;
    }

    console.log('  ✅ Country saved!');

    // 4. Генерируем список городов
    console.log('  - Generating list of top cities...');
    const cityNames = await generateTopCities(country.name);
    console.log(`  - Found ${cityNames.length} cities: ${cityNames.join(', ')}`);

    // 5. Для каждого города генерируем описание
    for (let i = 0; i < cityNames.length && i < 5; i++) {
      const cityName = cityNames[i];
      console.log(`    - Processing ${cityName}...`);

      const cityDescription = await generateCityDescription(cityName, country.name);
      const cityImage = await getCityImage(cityName, country.name);

      // Сохраняем город в БД
      const { error: cityError } = await supabase
        .from('cities')
        .insert({
          country_code: country.code,
          name: cityName,
          image: cityImage,
          description: cityDescription,
          is_capital: i === 0, // Первый город - столица
        });

      if (cityError) {
        console.error(`    ❌ Error saving city: ${cityError.message}`);
      } else {
        console.log(`    ✅ ${cityName} saved!`);
      }

      // Rate limiting - пауза между запросами к OpenAI
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Пауза между странами
    await new Promise(resolve => setTimeout(resolve, 1000));

  } catch (error) {
    console.error(`❌ Error processing ${country.name}:`, error);
  }
}

// Главная функция
async function main() {
  console.log('🚀 Starting country data generation...\n');

  // Выбрать континент для обработки
  const continentToProcess: Continent = 'Oceania'; // Обрабатываем Океанию

  console.log(`📍 Processing continent: ${continentToProcess}`);
  console.log(`📊 Total countries: ${countriesByContinent[continentToProcess].length}\n`);

  const countries = countriesByContinent[continentToProcess];

  for (const country of countries) {
    await processCountry(country, continentToProcess);
  }

  console.log('\n✅ All done! Check your Supabase database.');
  console.log('\n💡 To process other continents, change continentToProcess variable and run again.');
}

// Запуск
main().catch(console.error);
