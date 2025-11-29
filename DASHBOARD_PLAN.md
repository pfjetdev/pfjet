# Dashboard Development Plan

## Данные в Supabase

1. **orders** - заявки/лиды
   - name, email, phone
   - order_type (charter, empty_leg, jet_sharing, search, contact, multi_city)
   - from_location, to_location
   - departure_date, departure_time
   - passengers
   - product_id, product_name, product_type
   - price, currency
   - message
   - status (new, contacted, confirmed, completed, cancelled)
   - routes (для multi-city)
   - source_url
   - created_at

2. **aircraft** - самолёты
   - name, slug
   - category, category_slug
   - description, full_description
   - passengers, range, speed, baggage
   - cabin_height, cabin_width
   - features (JSON array)
   - gallery (JSON array)
   - image

3. **countries** - страны
   - code, name, flag
   - continent и другие поля

4. **cities** - города
   - name, country_code
   - image, description

5. **empty_legs** - пустые рейсы
   - from, to (города/аэропорты)
   - date, time
   - price, aircraft
   - и другие поля

6. **jet_sharing** - совместные рейсы
   - аналогично empty_legs

7. **airports** - аэропорты
   - для автокомплита в формах

---

## Этапы разработки

### Этап 1: Авторизация

- [ ] Настроить Supabase Auth (email/password)
- [ ] Создать страницу `/admin/login`
- [ ] Создать middleware для защиты `/admin/*` роутов
- [ ] Добавить logout функционал
- [ ] Хранение сессии

### Этап 2: Layout админки

- [ ] Создать `/admin/layout.tsx`
- [ ] Sidebar с навигацией по разделам
- [ ] Header с информацией о пользователе и logout
- [ ] Responsive дизайн (mobile drawer для меню)
- [ ] Breadcrumbs

### Этап 3: Dashboard главная (`/admin`)

- [ ] Карточки со статистикой:
  - Всего заявок / Новых заявок
  - Количество самолётов
  - Количество стран/городов
  - Количество empty legs / jet sharing
- [ ] Таблица последних 10 заявок
- [ ] Quick actions (ссылки на частые действия)

### Этап 4: Управление Orders (`/admin/orders`)

- [ ] Таблица всех заявок с пагинацией
- [ ] Сортировка по дате, статусу
- [ ] Фильтры:
  - По статусу (new, contacted, confirmed, completed, cancelled)
  - По типу (charter, empty_leg, jet_sharing, contact, multi_city)
  - По дате (сегодня, неделя, месяц, произвольный период)
- [ ] Поиск по имени/email/телефону
- [ ] Просмотр деталей заявки (modal или отдельная страница)
- [ ] Изменение статуса заявки
- [ ] Удаление заявок (с подтверждением)
- [ ] Экспорт в CSV (опционально)

### Этап 5: Управление Aircraft (`/admin/aircraft`)

- [ ] Таблица самолётов
- [ ] Фильтр по категории
- [ ] Создание нового самолёта (форма)
- [ ] Редактирование самолёта
- [ ] Загрузка изображений в gallery (Supabase Storage)
- [ ] Удаление самолёта (с подтверждением)

### Этап 6: Управление Countries & Cities (`/admin/countries`)

- [ ] Список стран с возможностью раскрыть города
- [ ] Добавление/редактирование страны
- [ ] Добавление/редактирование города
- [ ] Загрузка изображений для городов
- [ ] Удаление (с проверкой связей)

### Этап 7: Управление Empty Legs (`/admin/empty-legs`)

- [ ] Таблица пустых рейсов
- [ ] Фильтры по дате, маршруту
- [ ] Создание нового empty leg
- [ ] Редактирование
- [ ] Удаление
- [ ] Статус (активен/неактивен/истёк)

### Этап 8: Управление Jet Sharing (`/admin/jet-sharing`)

- [ ] Таблица совместных рейсов
- [ ] Аналогичный функционал как у empty legs
- [ ] Управление доступными местами

---

## Технологии и библиотеки

### Уже есть в проекте:
- Next.js 14 (App Router)
- Supabase (client)
- shadcn/ui
- Tailwind CSS
- Lucide icons

### Нужно добавить/использовать:
- **Supabase Auth** - авторизация
- **@tanstack/react-table** - продвинутые таблицы (сортировка, фильтры, пагинация)
- **react-hook-form** - формы
- **zod** - валидация
- **date-fns** - работа с датами
- **sonner** - уведомления (уже есть)

---

## Структура файлов

```
src/
├── app/
│   └── admin/
│       ├── layout.tsx          # Layout с sidebar
│       ├── page.tsx            # Dashboard главная
│       ├── login/
│       │   └── page.tsx        # Страница входа
│       ├── orders/
│       │   ├── page.tsx        # Список заявок
│       │   └── [id]/
│       │       └── page.tsx    # Детали заявки
│       ├── aircraft/
│       │   ├── page.tsx        # Список самолётов
│       │   ├── new/
│       │   │   └── page.tsx    # Создание
│       │   └── [slug]/
│       │       └── edit/
│       │           └── page.tsx # Редактирование
│       ├── countries/
│       │   └── page.tsx        # Страны и города
│       ├── empty-legs/
│       │   └── page.tsx        # Empty legs
│       └── jet-sharing/
│           └── page.tsx        # Jet sharing
├── components/
│   └── admin/
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       ├── StatsCard.tsx
│       ├── DataTable.tsx       # Переиспользуемая таблица
│       ├── OrderStatusBadge.tsx
│       └── forms/
│           ├── AircraftForm.tsx
│           ├── CountryForm.tsx
│           ├── CityForm.tsx
│           ├── EmptyLegForm.tsx
│           └── JetSharingForm.tsx
├── lib/
│   ├── supabase-admin.ts       # Admin-specific queries
│   └── auth.ts                 # Auth utilities
└── middleware.ts               # Route protection
```

---

## Безопасность

- [ ] RLS политики в Supabase для admin-only доступа
- [ ] Middleware проверка авторизации
- [ ] Валидация всех входных данных
- [ ] CSRF защита (встроена в Next.js)
- [ ] Rate limiting для API (опционально)

---

## Порядок реализации

1. **Авторизация** - без неё нельзя двигаться дальше
2. **Layout** - база для всех страниц
3. **Orders** - самое важное для бизнеса
4. **Dashboard** - обзорная страница
5. **Aircraft** - управление каталогом
6. **Empty Legs & Jet Sharing** - управление предложениями
7. **Countries & Cities** - контент-менеджмент

---

## Примерные сроки

| Этап | Описание | Оценка |
|------|----------|--------|
| 1 | Авторизация | 2-3 часа |
| 2 | Layout админки | 2-3 часа |
| 3 | Dashboard главная | 1-2 часа |
| 4 | Orders (CRUD + фильтры) | 4-5 часов |
| 5 | Aircraft (CRUD + upload) | 4-5 часов |
| 6 | Countries & Cities | 3-4 часа |
| 7 | Empty Legs | 2-3 часа |
| 8 | Jet Sharing | 2-3 часа |

**Итого: ~20-28 часов**
