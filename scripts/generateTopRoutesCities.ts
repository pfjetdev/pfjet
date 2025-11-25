import dotenv from 'dotenv';
import path from 'path';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { topRoutesByContinent, defaultCityByContinent } from '../src/data/topRoutes';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Используем OpenRouter с GPT-4o Mini
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

// Генерация описания города
async function generateCityDescription(city: string): Promise<string> {
  const prompt = `Write a 2-3 sentence luxury travel description for ${city}.
Mention 1-2 key attractions and describe the city's character.
Use upscale, enthusiastic tone.
Keep it concise and compelling.
Focus on luxury experiences, fine dining, exclusive activities, natural beauty, and cultural attractions.`;

  const response = await openai.chat.completions.create({
    model: "openai/gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 150,
  });

  return response.choices[0].message.content || '';
}

// Определить код страны для города
async function getCountryCodeForCity(cityName: string): Promise<string | null> {
  const prompt = `What is the ISO 3166-1 alpha-2 country code (2 letters) for the city "${cityName}"?
Answer ONLY with the 2-letter country code, nothing else.
Examples:
- Paris -> FR
- Dubai -> AE
- New York -> US
- Tokyo -> JP
- Monaco -> MC`;

  const response = await openai.chat.completions.create({
    model: "openai/gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 10,
  });

  const countryCode = response.choices[0].message.content?.trim().toUpperCase();
  return countryCode || null;
}

// Главная функция
async function main() {
  console.log('🚀 Starting Top Routes cities generation...\n');

  // 1. Собираем все уникальные города из Top Routes
  const allCities = new Set<string>();

  // Добавляем default города для каждого континента
  Object.values(defaultCityByContinent).forEach(city => allCities.add(city));

  // Добавляем города из маршрутов
  Object.values(topRoutesByContinent).forEach(routes => {
    routes.forEach(route => allCities.add(route.toCity));
  });

  console.log(`📍 Found ${allCities.size} unique cities in Top Routes\n`);

  // 2. Проверяем, какие города уже есть в базе данных
  const { data: existingCities, error } = await supabase
    .from('cities')
    .select('name');

  if (error) {
    console.error('❌ Error fetching existing cities:', error);
    return;
  }

  const existingCityNames = new Set(
    existingCities?.map(c => c.name.toLowerCase()) || []
  );

  // 3. Находим города, которых нет в базе
  const missingCities: string[] = [];
  for (const city of allCities) {
    if (!existingCityNames.has(city.toLowerCase())) {
      missingCities.push(city);
    }
  }

  console.log(`✅ Cities already in database: ${allCities.size - missingCities.length}`);
  console.log(`⚠️  Missing cities: ${missingCities.length}\n`);

  if (missingCities.length === 0) {
    console.log('🎉 All Top Routes cities are already in the database!');
    return;
  }

  console.log('📋 Missing cities:');
  missingCities.sort().forEach(city => console.log(`  - ${city}`));
  console.log('');

  // 4. Генерируем описания и добавляем города
  console.log('🔧 Generating descriptions and adding cities...\n');

  for (let i = 0; i < missingCities.length; i++) {
    const cityName = missingCities[i];
    console.log(`[${i + 1}/${missingCities.length}] Processing ${cityName}...`);

    try {
      // Получаем код страны
      console.log('  - Getting country code...');
      const countryCode = await getCountryCodeForCity(cityName);

      if (!countryCode) {
        console.log(`  ⚠️  Could not determine country code for ${cityName}, skipping...`);
        continue;
      }

      console.log(`  - Country code: ${countryCode}`);

      // Проверяем, существует ли страна в базе
      const { data: country } = await supabase
        .from('countries')
        .select('code')
        .eq('code', countryCode)
        .single();

      if (!country) {
        console.log(`  ⚠️  Country ${countryCode} not found in database, skipping...`);
        continue;
      }

      // Генерируем описание
      console.log('  - Generating description...');
      const description = await generateCityDescription(cityName);

      // Сохраняем город в БД (без фото - оно будет добавлено позже через Wikipedia)
      console.log('  - Saving to database...');
      const { error: cityError } = await supabase
        .from('cities')
        .insert({
          country_code: countryCode,
          name: cityName,
          image: `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800`, // placeholder
          description: description,
          is_capital: false,
        });

      if (cityError) {
        console.error(`  ❌ Error saving city: ${cityError.message}`);
      } else {
        console.log(`  ✅ ${cityName} saved!`);
      }

      // Rate limiting - пауза между запросами
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`  ❌ Error processing ${cityName}:`, error);
    }

    console.log('');
  }

  console.log('\n✅ Done!');
  console.log('\n💡 Next step: Run updateCitiesPhotosImproved.ts to update photos from Wikipedia');
}

// Запуск
main().catch(console.error);
