-- Master script to fix database and add Caribbean countries/cities
-- This script fixes all issues found in diagnosis

-- ============================================================
-- PART 1: FIX CITIES TABLE
-- ============================================================

-- Step 1: Show duplicates in cities
SELECT '=== DUPLICATES IN CITIES ===' as info;
SELECT name, country_code, COUNT(*) as count
FROM cities
GROUP BY name, country_code
HAVING COUNT(*) > 1
ORDER BY count DESC, name;

-- Step 2: Remove duplicates from cities (keep only the oldest record)
WITH duplicates AS (
  SELECT id, name, country_code,
    ROW_NUMBER() OVER (PARTITION BY name, country_code ORDER BY created_at ASC) as rn
  FROM cities
)
DELETE FROM cities
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

SELECT '✅ Duplicates removed from cities' as status;

-- Step 3: Add unique constraint on cities(name, country_code)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'cities_name_country_code_key'
    ) THEN
        ALTER TABLE cities ADD CONSTRAINT cities_name_country_code_key UNIQUE (name, country_code);
        RAISE NOTICE '✅ UNIQUE constraint added to cities(name, country_code)';
    ELSE
        RAISE NOTICE '✅ UNIQUE constraint already exists on cities';
    END IF;
END $$;

-- ============================================================
-- PART 2: ADD CARIBBEAN COUNTRIES
-- ============================================================

SELECT '=== ADDING CARIBBEAN COUNTRIES ===' as info;

-- Turks and Caicos (TC)
INSERT INTO countries (code, name, flag, image, description, continent)
VALUES (
  'TC',
  'Turks and Caicos Islands',
  '🇹🇨',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600',
  'Discover the pristine beauty of Turks and Caicos, where crystal-clear turquoise waters meet powdery white sand beaches. Experience luxury at its finest with world-class resorts, exceptional diving spots, and the famous Grace Bay Beach, consistently ranked among the world''s best beaches.',
  'North America'
)
ON CONFLICT (code) DO NOTHING;

-- Saint Barthélemy / St. Barts (BL)
INSERT INTO countries (code, name, flag, image, description, continent)
VALUES (
  'BL',
  'Saint Barthélemy',
  '🇧🇱',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600',
  'Experience the ultimate Caribbean luxury in Saint Barthélemy, a haven of sophistication and natural beauty. This French Caribbean island offers pristine beaches, world-class dining, designer boutiques, and exclusive resorts favored by celebrities and discerning travelers.',
  'North America'
)
ON CONFLICT (code) DO NOTHING;

-- Sint Maarten / St. Maarten (SX)
INSERT INTO countries (code, name, flag, image, description, continent)
VALUES (
  'SX',
  'Sint Maarten',
  '🇸🇽',
  'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=1600',
  'Explore Sint Maarten, where Dutch charm meets Caribbean paradise with stunning beaches and vibrant culture. Famous for its dual-nation character, this island offers thrilling beach experiences, duty-free shopping, gourmet restaurants, and the famous Maho Beach plane-watching experience.',
  'North America'
)
ON CONFLICT (code) DO NOTHING;

SELECT '✅ Caribbean countries added' as status;

-- Verify countries were added
SELECT code, name, flag FROM countries
WHERE code IN ('TC', 'BL', 'SX')
ORDER BY name;

-- ============================================================
-- PART 3: ADD CARIBBEAN CITIES
-- ============================================================

SELECT '=== ADDING CARIBBEAN CITIES ===' as info;

-- Providenciales, Turks and Caicos
INSERT INTO cities (name, country_code, is_capital, image, description)
VALUES (
  'Providenciales',
  'TC',
  false,
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600',
  'Providenciales, the crown jewel of Turks and Caicos, boasts the spectacular Grace Bay Beach and world-class luxury resorts. Perfect for water sports, diving, and ultimate Caribbean relaxation.'
)
ON CONFLICT (name, country_code) DO NOTHING;

-- Gustavia, St. Barts
INSERT INTO cities (name, country_code, is_capital, image, description)
VALUES (
  'Gustavia',
  'BL',
  true,
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600',
  'Gustavia, the chic capital of Saint Barthélemy, offers a perfect blend of French sophistication and Caribbean beauty. Explore designer boutiques, gourmet restaurants, and pristine beaches in this exclusive paradise.'
)
ON CONFLICT (name, country_code) DO NOTHING;

-- Philipsburg, Sint Maarten
INSERT INTO cities (name, country_code, is_capital, image, description)
VALUES (
  'Philipsburg',
  'SX',
  true,
  'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=1600',
  'Philipsburg, the vibrant capital of Sint Maarten, offers duty-free shopping, beautiful beaches, and a lively atmosphere. Experience the unique Dutch-Caribbean culture and enjoy world-class dining and entertainment.'
)
ON CONFLICT (name, country_code) DO NOTHING;

SELECT '✅ Caribbean cities added' as status;

-- Verify cities were added
SELECT id, name, country_code, is_capital FROM cities
WHERE name IN ('Providenciales', 'Gustavia', 'Philipsburg')
ORDER BY name;

-- ============================================================
-- FINAL VERIFICATION
-- ============================================================

SELECT '=== FINAL VERIFICATION ===' as info;

SELECT '✅ ALL DONE! Summary:' as status;
SELECT
  (SELECT COUNT(*) FROM countries) as total_countries,
  (SELECT COUNT(*) FROM cities) as total_cities,
  (SELECT COUNT(*) FROM countries WHERE code IN ('TC', 'BL', 'SX')) as caribbean_countries,
  (SELECT COUNT(*) FROM cities WHERE name IN ('Providenciales', 'Gustavia', 'Philipsburg')) as caribbean_cities;
