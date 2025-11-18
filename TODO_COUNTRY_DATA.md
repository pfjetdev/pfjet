# TODO: Генерация данных стран и городов

## 📋 Задача
Автоматически сгенерировать описания и фотографии для всех стран и их городов, загрузить в Supabase.

## 🎯 Что нужно получить:
- **200+ стран**: каждая с фото + luxury описанием
- **600-1000 городов**: каждый с фото + описанием
- Все данные в **Supabase**

---

## 📝 План реализации

### Шаг 1: Настройка окружения

#### 1.1. Установить зависимости
```bash
npm install openai @supabase/supabase-js tsx
```

#### 1.2. Создать .env.local файл
```env
OPENAI_API_KEY=sk-proj-...  # Получить на https://platform.openai.com/api-keys
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbG...
```

#### 1.3. Создать Supabase проект
1. Зарегистрироваться на https://supabase.com
2. Создать новый проект
3. Скопировать URL и Anon Key

---

### Шаг 2: Создать таблицы в Supabase

Открыть SQL Editor в Supabase и выполнить:

```sql
-- Таблица стран
CREATE TABLE countries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(2) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  flag VARCHAR(10),
  image TEXT,
  description TEXT,
  continent VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица городов
CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_code VARCHAR(2) REFERENCES countries(code),
  name VARCHAR(100) NOT NULL,
  image TEXT,
  description TEXT,
  is_capital BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Индексы для быстрого поиска
CREATE INDEX idx_countries_continent ON countries(continent);
CREATE INDEX idx_cities_country ON cities(country_code);
CREATE INDEX idx_countries_code ON countries(code);
```

---

### Шаг 3: Создать скрипт генерации

#### 3.1. Создать файл `scripts/generateCountryData.ts`

```typescript
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { countriesByContinent, type Continent } from '../src/data/countries';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Генерация описания страны
async function generateCountryDescription(country: string): Promise<string> {
  const prompt = `Write a luxury travel description for ${country} in this exact style:

"Engulf yourself in the splendor of Iceland, a destination brimming with luxury and grand landscapes. Begin your journey in Reykjavik, the stylish capital, where boutique hotels and exquisite dining await. Don't miss the Blue Lagoon, an epitome of relaxation set against serene volcanic landscapes. Venture to the Golden Circle, home to the stunning Gullfoss waterfall and the historic Thingvellir National Park. For a slice of paradise, escape to the Westfjords, where dramatic fjords and tranquil hot springs offer a perfect retreat. Northern Iceland's Akureyri, with its vibrant arts scene and access to majestic whale watching, is a must-visit. Each of these carefully selected spots provides a unique blend of luxury and natural beauty, promising an unforgettable Icelandic adventure."

Requirements:
- Start with "Engulf yourself in the splendor of ${country}..."
- Mention 3-4 must-visit locations
- Include luxury experiences (boutique hotels, fine dining, etc.)
- Highlight natural beauty and cultural attractions
- Around 150 words
- Enthusiastic, upscale tone
- End with a memorable closing sentence`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
    max_tokens: 300,
  });

  return response.choices[0].message.content || '';
}

// Получить URL фото страны
function getCountryImage(country: string): string {
  return `https://source.unsplash.com/1600x900/?${encodeURIComponent(country)},landmark,travel`;
}

// Генерация списка топ городов
async function generateTopCities(country: string): Promise<string[]> {
  const prompt = `List exactly 4-5 top tourist cities in ${country}.
Include the capital city as first.
Format: just city names separated by commas, no numbers or explanations.
Example: Paris, Lyon, Marseille, Nice, Bordeaux`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
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
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 150,
  });

  return response.choices[0].message.content || '';
}

// Получить URL фото города
function getCityImage(city: string, country: string): string {
  return `https://source.unsplash.com/800x600/?${encodeURIComponent(city)},${encodeURIComponent(country)},city`;
}

// Обработка одной страны
async function processCountry(country: any, continent: Continent) {
  console.log(`\n📍 Processing ${country.name}...`);

  try {
    // 1. Генерируем описание страны
    console.log('  - Generating country description...');
    const description = await generateCountryDescription(country.name);

    // 2. Получаем фото
    const image = getCountryImage(country.name);

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
      const cityImage = getCityImage(cityName, country.name);

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
  const continentToProcess: Continent = 'Europe'; // Начать с Европы

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
```

---

### Шаг 4: Запуск генерации

```bash
# Убедиться что .env.local заполнен
# Запустить скрипт
npx tsx scripts/generateCountryData.ts
```

---

### Шаг 5: Обработка всех континентов

После успешной обработки Европы, изменить в скрипте:
```typescript
const continentToProcess: Continent = 'Asia'; // Затем 'North America', 'South America', 'Africa', 'Oceania'
```

И запустить снова для каждого континента.

---

### Шаг 6: Интеграция с приложением

#### 6.1. Обновить страницу Countries

```typescript
// Вместо статических данных, загружать из Supabase
const { data: countries } = await supabase
  .from('countries')
  .select('*')
  .eq('continent', selectedContinent);
```

#### 6.2. Создать страницу детального просмотра страны

```typescript
// src/app/countries/[code]/page.tsx
export default async function CountryDetailPage({ params }: { params: { code: string } }) {
  const { data: country } = await supabase
    .from('countries')
    .select('*, cities(*)')
    .eq('code', params.code)
    .single();

  // Показать фото, описание, список городов
}
```

---

## 📊 Прогресс отслеживания

- [ ] Шаг 1: Настройка окружения
- [ ] Шаг 2: Создать таблицы в Supabase
- [ ] Шаг 3: Создать скрипт генерации
- [ ] Шаг 4: Обработать Europe (45 стран)
- [ ] Шаг 5: Обработать Asia (48 стран)
- [ ] Шаг 6: Обработать North America (23 страны)
- [ ] Шаг 7: Обработать South America (12 стран)
- [ ] Шаг 8: Обработать Africa (54 страны)
- [ ] Шаг 9: Обработать Oceania (14 стран)
- [ ] Шаг 10: Интегрировать с приложением

---

## 💰 Оценка стоимости

**GPT-4o-mini цены:**
- Input: $0.150 / 1M tokens
- Output: $0.600 / 1M tokens

**Примерная стоимость:**
- 200 стран × (200 tokens input + 300 tokens output) = ~$0.15
- 800 городов × (100 tokens input + 150 tokens output) = ~$0.20
- **Итого: ~$0.35 за все данные** 🎉

*Реально очень дешево!*

---

## 🔧 Полезные команды

```bash
# Проверить подключение к Supabase
npx tsx -e "import { createClient } from '@supabase/supabase-js'; const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY); s.from('countries').select('count').then(console.log)"

# Посмотреть сколько стран уже обработано
# В Supabase SQL Editor:
SELECT continent, COUNT(*) as count FROM countries GROUP BY continent;

# Удалить все данные и начать заново (если нужно)
DELETE FROM cities;
DELETE FROM countries;
```

---

## 📝 Заметки

- Unsplash имеет лимит запросов, но для генерации URL это не важно
- OpenAI имеет rate limits: ~3 requests/sec для tier 1
- Скрипт автоматически делает паузы между запросами
- Сохраняй прогресс - если скрипт упадет, можно продолжить с другого континента

---

## 🎯 Альтернативы (если не хочется использовать OpenAI)

### Вариант 1: Wikipedia API
```typescript
const getWikipediaData = async (country: string) => {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${country}`;
  const response = await fetch(url);
  const data = await response.json();
  return {
    description: data.extract,
    image: data.thumbnail?.source,
  };
};
```

**Минус:** Описания будут скучными, не в luxury стиле

### Вариант 2: Вручную
Забудь об этом 😅

---

## ✅ Готово!

Когда все сделаешь, можно удалить этот файл или оставить для документации.
