-- Add missing countries to the countries table
-- These are required for the remaining Empty Legs cities

-- Cyprus (CY)
INSERT INTO countries (code, name, flag, continent, is_capital)
VALUES (
  'CY',
  'Cyprus',
  '🇨🇾',
  'Europe',
  false
)
ON CONFLICT (code) DO NOTHING;

-- Guernsey (GG) - British Crown Dependency
INSERT INTO countries (code, name, flag, continent, is_capital)
VALUES (
  'GG',
  'Guernsey',
  '🇬🇬',
  'Europe',
  false
)
ON CONFLICT (code) DO NOTHING;

-- Hong Kong (HK) - Special Administrative Region of China
INSERT INTO countries (code, name, flag, continent, is_capital)
VALUES (
  'HK',
  'Hong Kong',
  '🇭🇰',
  'Asia',
  false
)
ON CONFLICT (code) DO NOTHING;

-- Macau (MO) - Special Administrative Region of China
INSERT INTO countries (code, name, flag, continent, is_capital)
VALUES (
  'MO',
  'Macau',
  '🇲🇴',
  'Asia',
  false
)
ON CONFLICT (code) DO NOTHING;

-- Now add the cities that failed previously

-- Larnaca, Cyprus (LCA airport)
INSERT INTO cities (name, country_code, is_capital)
VALUES (
  'Larnarca',
  'CY',
  false
)
ON CONFLICT (name, country_code) DO NOTHING;

-- Saint Peter Port, Guernsey (GCI airport)
INSERT INTO cities (name, country_code, is_capital)
VALUES (
  'Saint Peter Port',
  'GG',
  false
)
ON CONFLICT (name, country_code) DO NOTHING;

-- Hong Kong (HKG airport)
INSERT INTO cities (name, country_code, is_capital)
VALUES (
  'Hong Kong',
  'HK',
  false
)
ON CONFLICT (name, country_code) DO NOTHING;

-- Taipa, Macau (MFM airport)
INSERT INTO cities (name, country_code, is_capital)
VALUES (
  'Taipa',
  'MO',
  false
)
ON CONFLICT (name, country_code) DO NOTHING;

-- Display results
SELECT 'Countries added/verified' as message;
SELECT code, name, flag FROM countries WHERE code IN ('CY', 'GG', 'HK', 'MO');

SELECT 'Cities added/verified' as message;
SELECT name, country_code FROM cities WHERE name IN ('Larnarca', 'Saint Peter Port', 'Hong Kong', 'Taipa');
