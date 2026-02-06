-- ============================================
-- FIX: RLS Policies for Development
-- ============================================
-- This allows anonymous users to insert/update/delete temperature phases
-- Perfect for development without authentication

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow authenticated insert on ingredient_temperature_phases" ON ingredient_temperature_phases;
DROP POLICY IF EXISTS "Allow authenticated update on ingredient_temperature_phases" ON ingredient_temperature_phases;
DROP POLICY IF EXISTS "Allow authenticated delete on ingredient_temperature_phases" ON ingredient_temperature_phases;

-- Create new permissive policies (for development)
CREATE POLICY "Allow all insert on ingredient_temperature_phases"
  ON ingredient_temperature_phases FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all update on ingredient_temperature_phases"
  ON ingredient_temperature_phases FOR UPDATE
  USING (true);

CREATE POLICY "Allow all delete on ingredient_temperature_phases"
  ON ingredient_temperature_phases FOR DELETE
  USING (true);
