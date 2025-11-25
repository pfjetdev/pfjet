-- Add missing Caribbean countries for Jet Sharing cities

-- Step 1: Check for duplicates in countries table
SELECT 'Checking for duplicates in countries...' as status;
SELECT code, COUNT(*) as count
FROM countries
GROUP BY code
HAVING COUNT(*) > 1
ORDER BY count DESC, code;

-- Step 2: Remove duplicates from countries (keep only the oldest record)
WITH duplicates AS (
  SELECT id, code,
    ROW_NUMBER() OVER (PARTITION BY code ORDER BY created_at ASC) as rn
  FROM countries
)
DELETE FROM countries
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

SELECT 'Duplicates removed from countries' as status;

-- Step 3: Add unique constraint on countries.code if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'countries_code_key'
    ) THEN
        ALTER TABLE countries ADD CONSTRAINT countries_code_key UNIQUE (code);
    END IF;
END $$;

SELECT 'Unique constraint on countries.code added' as status;

-- Turks and Caicos (TC)
INSERT INTO countries (code, name, flag, image, description, continent)
VALUES (
  'TC',
  'Turks and Caicos Islands',
  '🇹🇨',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600',
  'Discover the pristine beauty of Turks and Caicos, where crystal-clear turquoise waters meet powdery white sand beaches.',
  'North America'
)
ON CONFLICT (code) DO NOTHING;

-- Saint Barthélemy / St. Barts (BL)
INSERT INTO countries (code, name, flag, image, description, continent)
VALUES (
  'BL',
  'Saint Barthélemy',
  '🇧🇱',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600',
  'Experience the ultimate Caribbean luxury in Saint Barthélemy, a haven of sophistication and natural beauty.',
  'North America'
)
ON CONFLICT (code) DO NOTHING;

-- Sint Maarten / St. Maarten (SX)
INSERT INTO countries (code, name, flag, image, description, continent)
VALUES (
  'SX',
  'Sint Maarten',
  '🇸🇽',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600',
  'Explore Sint Maarten, where Dutch charm meets Caribbean paradise with stunning beaches and vibrant culture.',
  'North America'
)
ON CONFLICT (code) DO NOTHING;

-- Verify countries were added
SELECT 'Countries added successfully' as status;
SELECT code, name, flag, continent FROM countries
WHERE code IN ('TC', 'BL', 'SX')
ORDER BY name;

-- Now add the cities
INSERT INTO cities (name, country_code, is_capital)
VALUES ('Providenciales', 'TC', false)
ON CONFLICT (name, country_code) DO NOTHING;

INSERT INTO cities (name, country_code, is_capital)
VALUES ('Gustavia', 'BL', true)
ON CONFLICT (name, country_code) DO NOTHING;

INSERT INTO cities (name, country_code, is_capital)
VALUES ('Philipsburg', 'SX', true)
ON CONFLICT (name, country_code) DO NOTHING;

-- Verify cities were added
SELECT 'Cities added successfully' as status;
SELECT id, name, country_code FROM cities
WHERE name IN ('Providenciales', 'Gustavia', 'Philipsburg')
ORDER BY name;
