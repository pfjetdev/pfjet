-- Jet Sharing Routes table (аналог empty_leg_routes)
-- Хранит предопределенные маршруты для Jet Sharing
-- Данные рейсов (даты, цены, места) генерируются динамически

CREATE TABLE IF NOT EXISTS jet_sharing_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  to_city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  aircraft_category VARCHAR(100) NOT NULL,  -- "Light", "Super Light", "Midsize", etc.
  distance_nm INTEGER,  -- Distance in nautical miles
  duration VARCHAR(50),  -- Flight duration (e.g., "1h 40m", "2h 15m")
  is_popular BOOLEAN DEFAULT false,  -- Flag for popular/featured routes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_jet_sharing_routes_from_city ON jet_sharing_routes(from_city_id);
CREATE INDEX IF NOT EXISTS idx_jet_sharing_routes_to_city ON jet_sharing_routes(to_city_id);
CREATE INDEX IF NOT EXISTS idx_jet_sharing_routes_category ON jet_sharing_routes(aircraft_category);
CREATE INDEX IF NOT EXISTS idx_jet_sharing_routes_popular ON jet_sharing_routes(is_popular);

-- Add constraint to prevent routes from and to the same city
ALTER TABLE jet_sharing_routes
ADD CONSTRAINT check_different_cities_routes
CHECK (from_city_id != to_city_id);

-- Add updated_at trigger (reuse existing function)
CREATE TRIGGER update_jet_sharing_routes_updated_at
BEFORE UPDATE ON jet_sharing_routes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE jet_sharing_routes IS 'Predefined routes for Jet Sharing flights with typical aircraft categories';
COMMENT ON COLUMN jet_sharing_routes.from_city_id IS 'Departure city (references cities table)';
COMMENT ON COLUMN jet_sharing_routes.to_city_id IS 'Arrival city (references cities table)';
COMMENT ON COLUMN jet_sharing_routes.aircraft_category IS 'Recommended aircraft category for this route';
COMMENT ON COLUMN jet_sharing_routes.distance_nm IS 'Distance in nautical miles';
COMMENT ON COLUMN jet_sharing_routes.duration IS 'Typical flight duration';
COMMENT ON COLUMN jet_sharing_routes.is_popular IS 'Flag to mark popular/featured routes';
