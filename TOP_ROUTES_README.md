# Top Routes - Personalized by Geolocation

Секция Top Routes теперь автоматически показывает популярные маршруты на основе местоположения пользователя.

## 🌍 Как это работает

1. **Определение местоположения** - IPStack API определяет страну пользователя
2. **Определение континента** - По коду страны определяется континент
3. **Показ маршрутов** - Отображаются 10 самых популярных маршрутов для континента пользователя
4. **Фотографии** - Изображения городов назначения загружаются из Supabase

## 📊 Континенты и маршруты

### Europe (Европа)
- London → Paris
- Paris → Monaco
- Geneva → Courchevel
- Nice → Ibiza
- Milan → Mykonos
- Zurich → St. Moritz
- Rome → Sardinia
- Barcelona → Mallorca
- Moscow → Dubai
- Vienna → Salzburg

### Asia (Азия)
- Dubai → Maldives
- Singapore → Bali
- Hong Kong → Tokyo
- Bangkok → Phuket
- Mumbai → Dubai
- Tokyo → Seoul
- Shanghai → Hong Kong
- Dubai → Seychelles
- Singapore → Maldives
- Doha → Dubai

### North America (Северная Америка)
- New York → Miami
- Los Angeles → Las Vegas
- Miami → Bahamas
- New York → Los Angeles
- Toronto → New York
- Houston → Cancun
- San Francisco → Aspen
- Chicago → Miami
- Los Angeles → Cabo San Lucas
- Dallas → Las Vegas

### South America (Южная Америка)
- São Paulo → Rio de Janeiro
- Buenos Aires → Punta del Este
- Lima → Cusco
- Bogotá → Cartagena
- Santiago → Mendoza
- Rio de Janeiro → Florianópolis
- Buenos Aires → Bariloche
- São Paulo → Miami
- Quito → Galápagos
- Caracas → Aruba

### Africa (Африка)
- Johannesburg → Cape Town
- Dubai → Nairobi
- Cairo → Sharm El Sheikh
- Nairobi → Zanzibar
- Marrakech → Casablanca
- Lagos → Accra
- Addis Ababa → Nairobi
- Cape Town → Mauritius
- Johannesburg → Victoria Falls
- Casablanca → Marrakech

### Oceania (Океания)
- Sydney → Melbourne
- Auckland → Queenstown
- Perth → Bali
- Brisbane → Gold Coast
- Sydney → Fiji
- Melbourne → Tasmania
- Auckland → Sydney
- Cairns → Great Barrier Reef
- Sydney → Bali
- Wellington → Auckland

## 🏗️ Архитектура

### Файлы

```
src/
├── components/
│   └── TopRoutesSection.tsx       # Серверный компонент (обновлен)
├── data/
│   └── topRoutes.ts               # Данные маршрутов по континентам
├── lib/
│   ├── continents.ts              # Утилита для определения континента
│   ├── topRoutesGenerator.ts     # Генератор маршрутов с изображениями
│   └── geolocation.ts             # IPStack интеграция
```

### Логика определения континента

```typescript
// src/lib/continents.ts
export function getContinentByCountryCode(countryCode: string): Continent {
  // Маппинг кода страны на континент
  // Например: 'FR' → 'Europe', 'US' → 'North America'
}
```

### Получение маршрутов с изображениями

```typescript
// src/lib/topRoutesGenerator.ts
export async function getTopRoutesWithImages(
  continent: Continent,
  userCity?: string
): Promise<TopRouteWithImage[]> {
  // 1. Получить маршруты для континента
  // 2. Загрузить изображения городов из Supabase
  // 3. Вернуть маршруты с изображениями
}
```

## 🎯 Компонент TopRoutesSection

### Серверный компонент (Server Component)

```tsx
export default async function TopRoutesSection() {
  // 1. Получить геолокацию пользователя
  const geolocation = await getSimpleGeolocation();

  // 2. Определить континент
  const continent = geolocation
    ? getContinentByCountryCode(geolocation.countryCode)
    : 'Europe';

  // 3. Получить маршруты с изображениями
  const routes = await getTopRoutesWithImages(continent, geolocation?.city);

  // 4. Отобразить маршруты
  return (...)
}
```

### Особенности

- ✅ **Server Component** - выполняется на сервере, нет JS на клиенте
- ✅ **Автоматическая геолокация** - определяет континент пользователя
- ✅ **Персонализированный заголовок** - "Top Routes from Paris"
- ✅ **Изображения из Supabase** - реальные фотографии городов
- ✅ **Fallback** - если геолокация не работает, показывает Европу
- ✅ **Оптимизация** - batch-запрос для изображений городов

## 🔄 Поток данных

```
User Request
    ↓
TopRoutesSection (Server Component)
    ↓
IPStack API → Получить страну пользователя
    ↓
getContinentByCountryCode → Определить континент
    ↓
getTopRoutesWithImages → Получить маршруты
    ↓
Supabase → Загрузить изображения городов
    ↓
Render → Отобразить 10 карточек маршрутов
```

## 📝 Пример использования

### В page.tsx

```tsx
import TopRoutesSection from '@/components/TopRoutesSection';

export default function Home() {
  return (
    <div>
      <TopRoutesSection />
    </div>
  );
}
```

### Результат

Пользователь из **Paris, France**:
- Определяется континент: **Europe**
- Показываются европейские маршруты
- Заголовок: "Top Routes from Paris"
- Все маршруты начинаются из Paris

Пользователь из **New York, USA**:
- Определяется континент: **North America**
- Показываются североамериканские маршруты
- Заголовок: "Top Routes from New York"
- Все маршруты начинаются из New York

## 🎨 Дизайн

- **Сетка**: 2 колонки (mobile) → 3 (tablet) → 5 (desktop)
- **Карточки**: Изображение города + overlay + текст
- **Hover эффект**: Scale + затемнение overlay
- **Адаптивность**: Разные размеры для mobile/desktop

## 🚀 Оптимизация

1. **Server-side rendering** - HTML генерируется на сервере
2. **Batch fetching** - Один запрос для всех изображений городов
3. **Image optimization** - Next.js Image component
4. **Caching** - IPStack responses кэшируются на 1 час
5. **Fallback images** - `/day.jpg` если изображение города не найдено

## 📌 Важные заметки

- Маршруты статичные (определены в `topRoutes.ts`)
- Изображения динамические (из Supabase)
- Город отправления меняется на город пользователя
- Если IPStack не работает - показывается Европа по умолчанию
- Все цены в USD

## 🔧 Как добавить новый маршрут

1. Откройте `src/data/topRoutes.ts`
2. Найдите нужный континент
3. Добавьте маршрут:

```typescript
{
  id: 'eur-11',
  fromCity: 'Amsterdam',
  toCity: 'London',
  price: 8900
}
```

4. Убедитесь, что города есть в Supabase с изображениями

## 🐛 Troubleshooting

**Проблема**: Не показываются изображения
- Проверьте, что города есть в Supabase таблице `cities`
- Проверьте поле `image` у города

**Проблема**: Всегда показывается Европа
- Проверьте IPStack API ключ в `.env.local`
- Проверьте логи сервера для ошибок IPStack

**Проблема**: Неправильный континент
- Проверьте маппинг в `src/lib/continents.ts`
- Добавьте код страны если его нет
