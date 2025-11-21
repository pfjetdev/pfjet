-- Empty Leg Routes table
-- This table stores predefined routes for Empty Legs flights
-- Each route represents a common private jet route with typical aircraft categories

CREATE TABLE IF NOT EXISTS empty_leg_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  to_city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  aircraft_category VARCHAR(100) NOT NULL,  -- "Light", "Super Light", "Midsize", "Super Midsize", "Heavy", etc.
  distance_nm INTEGER,  -- Distance in nautical miles
  duration VARCHAR(50),  -- Flight duration (e.g., "48-55 min", "2h 15m")
  preferred_aircraft_ids UUID[],  -- Optional: array of specific aircraft UUIDs for this route
  is_popular BOOLEAN DEFAULT false,  -- Flag for popular/featured routes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_empty_leg_routes_from_city ON empty_leg_routes(from_city_id);
CREATE INDEX IF NOT EXISTS idx_empty_leg_routes_to_city ON empty_leg_routes(to_city_id);
CREATE INDEX IF NOT EXISTS idx_empty_leg_routes_category ON empty_leg_routes(aircraft_category);
CREATE INDEX IF NOT EXISTS idx_empty_leg_routes_popular ON empty_leg_routes(is_popular);

-- Add constraint to prevent routes from and to the same city
ALTER TABLE empty_leg_routes
ADD CONSTRAINT check_different_cities
CHECK (from_city_id != to_city_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_empty_leg_routes_updated_at
BEFORE UPDATE ON empty_leg_routes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE empty_leg_routes IS 'Predefined routes for Empty Legs flights with typical aircraft categories';
COMMENT ON COLUMN empty_leg_routes.from_city_id IS 'Departure city (references cities table)';
COMMENT ON COLUMN empty_leg_routes.to_city_id IS 'Arrival city (references cities table)';
COMMENT ON COLUMN empty_leg_routes.aircraft_category IS 'Recommended aircraft category for this route';
COMMENT ON COLUMN empty_leg_routes.distance_nm IS 'Distance in nautical miles';
COMMENT ON COLUMN empty_leg_routes.duration IS 'Typical flight duration';
COMMENT ON COLUMN empty_leg_routes.preferred_aircraft_ids IS 'Optional array of specific aircraft IDs suitable for this route';
COMMENT ON COLUMN empty_leg_routes.is_popular IS 'Flag to mark popular/featured routes';
