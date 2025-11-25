-- Add missing cities for Jet Sharing routes
-- This script adds cities that are referenced in jet-sharing.md but not in the database

-- Step 1: Find and show duplicates
SELECT 'Checking for duplicates...' as status;
SELECT name, country_code, COUNT(*) as count
FROM cities
GROUP BY name, country_code
HAVING COUNT(*) > 1
ORDER BY count DESC, name;

-- Step 2: Remove duplicates (keep only the oldest record for each city)
-- This uses a CTE to identify duplicates and delete all but the first one
WITH duplicates AS (
  SELECT id, name, country_code,
    ROW_NUMBER() OVER (PARTITION BY name, country_code ORDER BY created_at ASC) as rn
  FROM cities
)
DELETE FROM cities
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

SELECT 'Duplicates removed' as status;

-- Step 3: Add unique constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'cities_name_country_code_key'
    ) THEN
        ALTER TABLE cities ADD CONSTRAINT cities_name_country_code_key UNIQUE (name, country_code);
    END IF;
END $$;

SELECT 'Unique constraint added' as status;

-- New York (JFK/LGA/EWR airports)
-- Note: May already exist as "New York City" - check first
INSERT INTO cities (name, country_code, is_capital)
VALUES ('New York', 'US', false)
ON CONFLICT (name, country_code) DO NOTHING;

-- Malé, Maldives (MLE airport)
INSERT INTO cities (name, country_code, is_capital)
VALUES ('Malé', 'MV', true)
ON CONFLICT (name, country_code) DO NOTHING;

-- Turks and Caicos (PLS airport - Providenciales)
INSERT INTO cities (name, country_code, is_capital)
VALUES ('Providenciales', 'TC', false)
ON CONFLICT (name, country_code) DO NOTHING;

-- St. Barts (SBH airport - Gustavia)
INSERT INTO cities (name, country_code, is_capital)
VALUES ('Gustavia', 'BL', true)
ON CONFLICT (name, country_code) DO NOTHING;

-- St. Maarten (SXM airport - Philipsburg)
INSERT INTO cities (name, country_code, is_capital)
VALUES ('Philipsburg', 'SX', true)
ON CONFLICT (name, country_code) DO NOTHING;

-- Verify cities were added
SELECT 'Cities added successfully' as status;
SELECT id, name, country_code FROM cities
WHERE name IN ('New York', 'Malé', 'Providenciales', 'Gustavia', 'Philipsburg')
ORDER BY name;
