-- Create orders/leads table for storing form submissions
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Contact info
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,

  -- Order type
  order_type VARCHAR(50) NOT NULL DEFAULT 'charter',
  -- 'charter' - regular charter request
  -- 'empty_leg' - empty leg booking
  -- 'jet_sharing' - jet sharing booking
  -- 'search' - search request from home page
  -- 'contact' - contact form submission
  -- 'multi_city' - multi-city charter request

  -- Flight details
  from_location VARCHAR(255),
  to_location VARCHAR(255),
  departure_date DATE,
  departure_time TIME,
  passengers INTEGER DEFAULT 1,

  -- For multi-city
  routes JSONB,

  -- Product reference (for empty legs, jet sharing, specific jets)
  product_id VARCHAR(255),
  product_name VARCHAR(255),
  product_type VARCHAR(50),

  -- Pricing
  price DECIMAL(12, 2),
  currency VARCHAR(3) DEFAULT 'USD',

  -- Additional info
  message TEXT,

  -- Status tracking
  status VARCHAR(50) DEFAULT 'new',
  -- 'new' - just created
  -- 'contacted' - customer contacted
  -- 'confirmed' - booking confirmed
  -- 'completed' - flight completed
  -- 'cancelled' - cancelled

  -- Metadata
  source_url TEXT,
  user_agent TEXT,
  ip_address INET,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_type ON orders(order_type);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running the script)
DROP POLICY IF EXISTS "Allow public inserts" ON orders;
DROP POLICY IF EXISTS "Allow authenticated reads" ON orders;
DROP POLICY IF EXISTS "Allow authenticated updates" ON orders;
DROP POLICY IF EXISTS "Enable insert for all users" ON orders;

-- Policy: Allow insert from ALL users (including anonymous/public form submissions)
-- Using 'public' role which includes both anon and authenticated
CREATE POLICY "Enable insert for all users" ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Allow authenticated users to read all orders
CREATE POLICY "Allow authenticated reads" ON orders
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to update orders
CREATE POLICY "Allow authenticated updates" ON orders
  FOR UPDATE
  TO authenticated
  USING (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
