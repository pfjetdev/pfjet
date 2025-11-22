# Jet Sharing Implementation Guide

Jet Sharing позволяет пользователям бронировать отдельные места на общих рейсах частных джетов.

## Архитектура

### Основные отличия от Empty Legs:

1. **Цена за место** - вместо цены за весь самолет, пользователи платят за каждое место
2. **Управление местами** - отслеживание общего количества мест и доступных мест
3. **Фиксированные рейсы** - рейсы создаются вручную/через админку, а не генерируются динамически

## Структура базы данных

### Таблица `jet_sharing_flights`

```sql
- id (UUID, primary key)
- from_city_id (UUID, foreign key to cities)
- to_city_id (UUID, foreign key to cities)
- aircraft_id (UUID, foreign key to aircraft)
- departure_date (DATE)
- departure_time (TIME)
- total_seats (INTEGER) - общее количество мест
- available_seats (INTEGER) - доступные места
- price_per_seat (DECIMAL) - цена за место
- distance_nm (INTEGER) - расстояние в морских милях
- duration (VARCHAR) - длительность полета
- status (VARCHAR) - статус: available/full/cancelled/completed
- is_featured (BOOLEAN) - избранный рейс
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Автоматические триггеры:

1. **auto_update_flight_status** - автоматически обновляет статус на 'full', когда available_seats = 0
2. **update_jet_sharing_flights_updated_at** - обновляет поле updated_at при изменении

## Установка и миграция

### Шаг 1: Создание таблицы в Supabase

Запустите SQL схему в Supabase:

```bash
# Откройте файл scripts/supabase-jet-sharing-schema.sql
# Скопируйте содержимое и выполните в SQL Editor Supabase
```

### Шаг 2: Миграция тестовых данных

Запустите скрипт миграции:

```bash
npx tsx scripts/migrateJetSharingToSupabase.ts
```

Скрипт создаст 10 тестовых рейсов на ближайшие 2 недели.

## Компоненты

### Серверные компоненты:

- `src/app/jet-sharing/page.tsx` - главная страница с загрузкой данных из Supabase
- `src/app/jet-sharing/[id]/page.tsx` - детальная страница рейса

### Клиентские компоненты:

- `src/app/jet-sharing/JetSharingClient.tsx` - управление фильтрами и пагинацией
- `src/app/jet-sharing/[id]/JetSharingDetailClient.tsx` - детальная информация о рейсе
- `src/components/JetSharingFilters.tsx` - фильтры для поиска
- `src/components/JetSharingCard.tsx` - карточка рейса

### Библиотеки:

- `src/lib/jetSharingGenerator.ts` - функции для работы с данными из Supabase
- `src/types/jetSharing.ts` - TypeScript типы

## Основные функции

### getAllJetSharingFlights(limit: number)

Получает все доступные рейсы из Supabase с фильтрацией:
- Только статус 'available'
- Только будущие рейсы (departure_date >= today)
- Сортировка по дате вылета

### getJetSharingFlightById(id: string)

Получает информацию о конкретном рейсе по UUID.

### filterJetSharingFlights(flights, filters)

Фильтрует рейсы по критериям:
- from/to - города вылета/прилета
- dateFrom/dateTo - диапазон дат
- minPrice/maxPrice - диапазон цен за место
- minSeats - минимум доступных мест
- categories - категории самолетов

## Фильтры

### Доступные фильтры:

1. **Route** - Маршрут
   - From (departure city)
   - To (arrival city)
   - Departure Date

2. **Seats Needed** - Необходимое количество мест
   - Выбор от 1 до 20 мест

3. **Price per Seat** - Цена за место
   - Слайдер для выбора диапазона цен

4. **Aircraft Type** - Тип самолета
   - Множественный выбор категорий

## API Routes (будущее развитие)

Для полноценной системы бронирования можно добавить:

```
POST /api/jet-sharing/book - Бронирование мест
GET /api/jet-sharing/my-bookings - Мои бронирования
POST /api/jet-sharing/cancel - Отмена бронирования
```

## Отличия компонентов от Empty Legs

### EmptyLegHeroBlock

Добавлены пропсы для Jet Sharing:
- `isJetSharing?: boolean` - флаг для отображения информации о местах
- `totalSeats?: number` - общее количество мест
- `availableSeats?: number` - доступные места

### CreateOrderForm

Добавлены пропсы:
- `isJetSharing?: boolean` - режим Jet Sharing
- `availableSeats?: number` - для выбора количества мест

### MobileOrderFormDrawer

Те же дополнительные пропсы что и CreateOrderForm.

## Revalidation

- Главная страница: каждые 60 минут (3600 секунд)
- Детальная страница: каждые 60 минут (3600 секунд)

Это обеспечивает актуальность данных о доступных местах.

## Безопасность

### Row Level Security (RLS)

Рекомендуется настроить RLS политики в Supabase:

```sql
-- Чтение доступно всем
CREATE POLICY "Enable read access for all users" ON jet_sharing_flights
FOR SELECT USING (true);

-- Создание/изменение только для authenticated users
CREATE POLICY "Enable insert for authenticated users only" ON jet_sharing_flights
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON jet_sharing_flights
FOR UPDATE USING (auth.role() = 'authenticated');
```

## Мониторинг

### Важные метрики для отслеживания:

1. **Occupancy Rate** - процент занятости мест
2. **Booking Conversion** - конверсия в бронирования
3. **Average Seats per Booking** - среднее количество мест в бронировании
4. **Revenue per Flight** - доход с каждого рейса

## Troubleshooting

### Проблема: Рейсы не отображаются

Проверьте:
1. Таблица `jet_sharing_flights` создана в Supabase
2. Запущена миграция с тестовыми данными
3. Даты рейсов в будущем
4. Статус рейсов 'available'

### Проблема: Ошибки при фильтрации

Убедитесь что:
1. Все города из рейсов есть в таблице `cities`
2. Все самолеты из рейсов есть в таблице `aircraft`
3. Foreign keys настроены корректно

## Roadmap

### Фаза 1 (Готово):
- ✅ Создание таблицы в Supabase
- ✅ Генератор данных
- ✅ Главная страница с фильтрами
- ✅ Детальная страница рейса

### Фаза 2 (Планируется):
- [ ] Система бронирования
- [ ] Интеграция с платежными системами
- [ ] Email уведомления
- [ ] Личный кабинет с историей бронирований

### Фаза 3 (Планируется):
- [ ] Админ панель для управления рейсами
- [ ] Автоматическое обновление статуса рейсов
- [ ] Waitlist для полностью забронированных рейсов
- [ ] Review система

## Поддержка

Для вопросов и предложений создавайте Issue в репозитории проекта.
