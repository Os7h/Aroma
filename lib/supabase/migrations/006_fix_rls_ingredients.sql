-- ============================================
-- FIX: RLS Policies for ingredients table
-- ============================================
-- Allow anonymous users to update ingredients (for development)

-- Enable RLS if not already enabled
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY IF NOT EXISTS "Allow public read access on ingredients"
  ON ingredients FOR SELECT
  USING (true);

-- Allow all updates (for development)
CREATE POLICY IF NOT EXISTS "Allow all updates on ingredients"
  ON ingredients FOR UPDATE
  USING (true);

-- Allow all inserts (for development)
CREATE POLICY IF NOT EXISTS "Allow all inserts on ingredients"
  ON ingredients FOR INSERT
  WITH CHECK (true);

-- Allow all deletes (for development)
CREATE POLICY IF NOT EXISTS "Allow all deletes on ingredients"
  ON ingredients FOR DELETE
  USING (true);
