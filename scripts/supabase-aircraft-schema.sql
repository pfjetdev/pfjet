-- ============================================
-- Aircraft Table Schema for Supabase
-- ============================================

-- Create aircraft table
CREATE TABLE IF NOT EXISTS aircraft (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  description TEXT NOT NULL,
  full_description TEXT NOT NULL,

  -- Specifications
  passengers TEXT NOT NULL,
  range TEXT NOT NULL,
  speed TEXT NOT NULL,
  baggage TEXT NOT NULL,
  cabin_height TEXT NOT NULL,
  cabin_width TEXT NOT NULL,

  -- Arrays
  features TEXT[] DEFAULT '{}',
  gallery TEXT[] DEFAULT '{}',

  -- Main image
  image TEXT,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_aircraft_category ON aircraft(category);
CREATE INDEX IF NOT EXISTS idx_aircraft_category_slug ON aircraft(category_slug);
CREATE INDEX IF NOT EXISTS idx_aircraft_slug ON aircraft(slug);
CREATE INDEX IF NOT EXISTS idx_aircraft_name ON aircraft(name);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_aircraft_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS aircraft_updated_at_trigger ON aircraft;
CREATE TRIGGER aircraft_updated_at_trigger
  BEFORE UPDATE ON aircraft
  FOR EACH ROW
  EXECUTE FUNCTION update_aircraft_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE aircraft ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to everyone
CREATE POLICY "Allow public read access to aircraft"
  ON aircraft FOR SELECT
  USING (true);

-- Create policy to allow insert/update for authenticated users (for your scripts)
CREATE POLICY "Allow authenticated insert/update to aircraft"
  ON aircraft FOR ALL
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Comments for documentation
COMMENT ON TABLE aircraft IS 'Private jet aircraft information including specifications, features, and images';
COMMENT ON COLUMN aircraft.name IS 'Full aircraft name (e.g., King Air 260)';
COMMENT ON COLUMN aircraft.slug IS 'URL-friendly identifier (e.g., king-air-260)';
COMMENT ON COLUMN aircraft.category IS 'Aircraft category (e.g., Turboprop, Very Light, Light, etc.)';
COMMENT ON COLUMN aircraft.category_slug IS 'URL-friendly category (e.g., turboprop, very-light)';
COMMENT ON COLUMN aircraft.description IS 'Short description for listings and previews';
COMMENT ON COLUMN aircraft.full_description IS 'Full detailed description for the aircraft detail page';
COMMENT ON COLUMN aircraft.passengers IS 'Passenger capacity (e.g., Up to 9, 4-5)';
COMMENT ON COLUMN aircraft.range IS 'Maximum range (e.g., 1,720 nm)';
COMMENT ON COLUMN aircraft.speed IS 'Cruising speed (e.g., 310 mph)';
COMMENT ON COLUMN aircraft.baggage IS 'Baggage capacity (e.g., 55 cu ft)';
COMMENT ON COLUMN aircraft.cabin_height IS 'Cabin interior height (e.g., 4.8 ft)';
COMMENT ON COLUMN aircraft.cabin_width IS 'Cabin interior width (e.g., 4.5 ft)';
COMMENT ON COLUMN aircraft.features IS 'Array of key features and amenities';
COMMENT ON COLUMN aircraft.gallery IS 'Array of image URLs for the gallery';
COMMENT ON COLUMN aircraft.image IS 'Main/hero image URL';

-- Sample query to verify table creation
-- SELECT * FROM aircraft LIMIT 5;
