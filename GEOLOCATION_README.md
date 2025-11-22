# IPStack Geolocation Integration

Интеграция IPStack API для определения местоположения пользователей.

## 🚀 Быстрый старт

### 1. Настройка

API ключ уже добавлен в `.env.local`:
```env
IPSTACK_API_KEY=1dc3b66493c6e5618ff47dcf6d94f9d2
```

### 2. Использование в компонентах

#### Вариант 1: React Hook (для клиентских компонентов)

```tsx
'use client';

import { useGeolocation } from '@/hooks/useGeolocation';

export default function MyComponent() {
  const { data, loading, error } = useGeolocation();

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!data) return null;

  return (
    <div>
      <p>Ваш город: {data.city}</p>
      <p>Страна: {data.country}</p>
      <p>Валюта: {data.currency}</p>
      <p>Часовой пояс: {data.timezone}</p>
    </div>
  );
}
```

#### Вариант 2: Server-Side (для серверных компонентов)

```tsx
import { getSimpleGeolocation } from '@/lib/geolocation';

export default async function ServerComponent() {
  const geolocation = await getSimpleGeolocation();

  if (!geolocation) {
    return <div>Не удалось определить местоположение</div>;
  }

  return (
    <div>
      <p>Город: {geolocation.city}</p>
      <p>Страна: {geolocation.country}</p>
    </div>
  );
}
```

#### Вариант 3: API Route

```tsx
// В API route или Server Action
import { getClientIP, getSimpleGeolocation } from '@/lib/geolocation';
import { headers } from 'next/headers';

export async function GET() {
  const headersList = headers();
  const clientIP = getClientIP(headersList);
  const geolocation = await getSimpleGeolocation(clientIP || undefined);

  return Response.json(geolocation);
}
```

### 3. Demo компонент

Готовый компонент для демонстрации:

```tsx
import GeolocationDemo from '@/components/GeolocationDemo';

export default function Page() {
  return (
    <div>
      <h1>Определение местоположения</h1>
      <GeolocationDemo />
    </div>
  );
}
```

## 📦 Типы данных

### SimpleGeolocation

```typescript
interface SimpleGeolocation {
  ip: string;           // IP адрес пользователя
  city: string;         // Город
  region: string;       // Регион/область
  country: string;      // Страна (полное название)
  countryCode: string;  // Код страны (ISO)
  latitude: number;     // Широта
  longitude: number;    // Долгота
  timezone: string;     // Часовой пояс
  currency: string;     // Код валюты
}
```

### GeolocationData

Полный ответ от IPStack API с дополнительными данными (языки, флаги, провайдер и т.д.)

## 🎯 Примеры использования

### 1. Автоматический выбор валюты

```tsx
'use client';

import { useGeolocation } from '@/hooks/useGeolocation';

export default function PriceDisplay({ priceUSD }: { priceUSD: number }) {
  const { data } = useGeolocation();

  const currency = data?.currency || 'USD';
  const displayPrice = convertCurrency(priceUSD, currency);

  return <div>Price: {displayPrice} {currency}</div>;
}
```

### 2. Персонализированные предложения по городу

```tsx
'use client';

import { useGeolocation } from '@/hooks/useGeolocation';

export default function LocalOffers() {
  const { data, loading } = useGeolocation();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Рейсы из {data?.city}</h2>
      {/* Показываем рейсы из города пользователя */}
    </div>
  );
}
```

### 3. Определение часового пояса

```tsx
'use client';

import { useGeolocation } from '@/hooks/useGeolocation';

export default function LocalTime() {
  const { data } = useGeolocation();

  const localTime = data?.timezone
    ? new Date().toLocaleString('en-US', { timeZone: data.timezone })
    : new Date().toLocaleString();

  return <div>Your local time: {localTime}</div>;
}
```

## 🔧 API Endpoints

### GET /api/geolocation

Возвращает геолокацию текущего пользователя:

```bash
curl http://localhost:3000/api/geolocation
```

Ответ:
```json
{
  "ip": "123.456.789.0",
  "city": "New York",
  "region": "New York",
  "country": "United States",
  "countryCode": "US",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "timezone": "America/New_York",
  "currency": "USD"
}
```

## ⚡ Оптимизация

1. **Кэширование**: API запросы кэшируются на 1 час (3600 секунд)
2. **Lazy Loading**: Hook загружает данные только при монтировании компонента
3. **Error Handling**: Автоматическая обработка ошибок

## 📝 Файлы

- `src/types/geolocation.ts` - TypeScript типы
- `src/lib/geolocation.ts` - Утилиты для работы с IPStack
- `src/hooks/useGeolocation.ts` - React hook
- `src/app/api/geolocation/route.ts` - API endpoint
- `src/components/GeolocationDemo.tsx` - Demo компонент

## 🌍 Лимиты IPStack

На бесплатном плане:
- 100 запросов/месяц
- Только HTTP (не HTTPS)
- Базовая геолокация

Для production рекомендуется upgrade до платного плана для получения HTTPS и большего количества запросов.

## 💡 Tips

1. Используйте `useGeolocation` hook для клиентских компонентов
2. Используйте `getSimpleGeolocation()` для серверных компонентов
3. Всегда обрабатывайте случаи, когда геолокация недоступна
4. Кэшируйте результаты локально для уменьшения запросов к API
