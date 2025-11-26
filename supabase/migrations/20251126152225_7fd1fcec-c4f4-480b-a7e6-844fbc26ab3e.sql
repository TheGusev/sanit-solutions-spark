-- Create leads table for storing calculator submissions
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contact information
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  
  -- Calculator data
  object_type TEXT,
  area_m2 INTEGER,
  service TEXT,
  method TEXT,
  frequency TEXT,
  client_type TEXT,
  
  -- Financial data
  base_price INTEGER,
  discount_percent INTEGER,
  discount_amount INTEGER,
  final_price INTEGER,
  
  -- Analytics
  source TEXT DEFAULT 'website_calculator',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  
  -- Processing status
  status TEXT DEFAULT 'new'
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (no authentication required)
CREATE POLICY "Allow public insert" ON leads
  FOR INSERT WITH CHECK (true);