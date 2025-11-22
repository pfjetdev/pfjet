-- Jet Sharing Flights table
-- This table stores shared private jet flights where passengers can book individual seats
-- Unlike Empty Legs, these are scheduled flights with fixed departure times and per-seat pricing

CREATE TABLE IF NOT EXISTS jet_sharing_flights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  to_city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  aircraft_id UUID NOT NULL REFERENCES aircraft(id) ON DELETE CASCADE,

  -- Flight schedule
  departure_date DATE NOT NULL,  -- Date of departure
  departure_time TIME NOT NULL,  -- Time of departure (24-hour format)

  -- Seat management
  total_seats INTEGER NOT NULL CHECK (total_seats > 0),  -- Total seats on this flight
  available_seats INTEGER NOT NULL CHECK (available_seats >= 0 AND available_seats <= total_seats),  -- Remaining available seats

  -- Pricing
  price_per_seat DECIMAL(10, 2) NOT NULL CHECK (price_per_seat > 0),  -- Price per seat in USD

  -- Flight info (can be calculated from cities/aircraft)
  distance_nm INTEGER,  -- Distance in nautical miles
  duration VARCHAR(50),  -- Flight duration (e.g., "1h 40m", "2h 15m")

  -- Status
  status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'full', 'cancelled', 'completed')),
  is_featured BOOLEAN DEFAULT false,  -- Flag for featured/promoted flights

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure flight is in the future (or at least not too far in the past)
  CONSTRAINT check_future_flight CHECK (departure_date >= CURRENT_DATE - INTERVAL '1 day')
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_jet_sharing_from_city ON jet_sharing_flights(from_city_id);
CREATE INDEX IF NOT EXISTS idx_jet_sharing_to_city ON jet_sharing_flights(to_city_id);
CREATE INDEX IF NOT EXISTS idx_jet_sharing_aircraft ON jet_sharing_flights(aircraft_id);
CREATE INDEX IF NOT EXISTS idx_jet_sharing_departure_date ON jet_sharing_flights(departure_date);
CREATE INDEX IF NOT EXISTS idx_jet_sharing_status ON jet_sharing_flights(status);
CREATE INDEX IF NOT EXISTS idx_jet_sharing_available_seats ON jet_sharing_flights(available_seats) WHERE available_seats > 0;
CREATE INDEX IF NOT EXISTS idx_jet_sharing_featured ON jet_sharing_flights(is_featured);

-- Compound index for common queries (filter by date range and availability)
CREATE INDEX IF NOT EXISTS idx_jet_sharing_date_availability ON jet_sharing_flights(departure_date, available_seats) WHERE status = 'available';

-- Add constraint to prevent flights from and to the same city
ALTER TABLE jet_sharing_flights
ADD CONSTRAINT check_different_cities_js
CHECK (from_city_id != to_city_id);

-- Add updated_at trigger (reuse existing function)
CREATE TRIGGER update_jet_sharing_flights_updated_at
BEFORE UPDATE ON jet_sharing_flights
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add trigger to automatically update status based on available seats
CREATE OR REPLACE FUNCTION update_flight_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.available_seats = 0 THEN
    NEW.status = 'full';
  ELSIF NEW.available_seats > 0 AND NEW.status = 'full' THEN
    NEW.status = 'available';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_update_flight_status
BEFORE INSERT OR UPDATE OF available_seats ON jet_sharing_flights
FOR EACH ROW
EXECUTE FUNCTION update_flight_status();

-- Add comments for documentation
COMMENT ON TABLE jet_sharing_flights IS 'Scheduled shared private jet flights with per-seat booking';
COMMENT ON COLUMN jet_sharing_flights.from_city_id IS 'Departure city (references cities table)';
COMMENT ON COLUMN jet_sharing_flights.to_city_id IS 'Arrival city (references cities table)';
COMMENT ON COLUMN jet_sharing_flights.aircraft_id IS 'Aircraft used for this flight (references aircraft table)';
COMMENT ON COLUMN jet_sharing_flights.departure_date IS 'Flight departure date';
COMMENT ON COLUMN jet_sharing_flights.departure_time IS 'Flight departure time (24-hour format)';
COMMENT ON COLUMN jet_sharing_flights.total_seats IS 'Total number of seats available on this flight';
COMMENT ON COLUMN jet_sharing_flights.available_seats IS 'Number of seats still available for booking';
COMMENT ON COLUMN jet_sharing_flights.price_per_seat IS 'Price per seat in USD';
COMMENT ON COLUMN jet_sharing_flights.distance_nm IS 'Distance in nautical miles';
COMMENT ON COLUMN jet_sharing_flights.duration IS 'Flight duration';
COMMENT ON COLUMN jet_sharing_flights.status IS 'Flight status: available, full, cancelled, or completed';
COMMENT ON COLUMN jet_sharing_flights.is_featured IS 'Flag to mark featured/promoted flights';
