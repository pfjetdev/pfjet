-- Таблица стран
CREATE TABLE IF NOT EXISTS countries (
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
CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_code VARCHAR(2) REFERENCES countries(code),
  name VARCHAR(100) NOT NULL,
  image TEXT,
  description TEXT,
  is_capital BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_countries_continent ON countries(continent);
CREATE INDEX IF NOT EXISTS idx_cities_country ON cities(country_code);
CREATE INDEX IF NOT EXISTS idx_countries_code ON countries(code);
