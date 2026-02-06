-- ============================================
-- Temperature Phases (A, B, C) per Ingredient
-- ============================================

-- Create table for ingredient temperature phases
CREATE TABLE IF NOT EXISTS ingredient_temperature_phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ingredient_id uuid NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  phase_name varchar(10) NOT NULL, -- 'A', 'B', 'C', etc.
  temp_start_c integer NOT NULL CHECK (temp_start_c >= 0 AND temp_start_c <= 170 AND temp_start_c % 10 = 0),
  temp_end_c integer NOT NULL CHECK (temp_end_c >= 0 AND temp_end_c <= 170 AND temp_end_c % 10 = 0),
  description_de text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_temp_range CHECK (temp_start_c < temp_end_c),
  CONSTRAINT unique_phase_per_ingredient UNIQUE(ingredient_id, phase_name)
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_ingredient_temperature_phases_ingredient 
  ON ingredient_temperature_phases(ingredient_id);

-- Enable Row Level Security
ALTER TABLE ingredient_temperature_phases ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
CREATE POLICY "Allow public read access on ingredient_temperature_phases"
  ON ingredient_temperature_phases FOR SELECT
  USING (true);

-- Allow insert/update/delete only for authenticated users
CREATE POLICY "Allow authenticated insert on ingredient_temperature_phases"
  ON ingredient_temperature_phases FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on ingredient_temperature_phases"
  ON ingredient_temperature_phases FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on ingredient_temperature_phases"
  ON ingredient_temperature_phases FOR DELETE
  USING (auth.role() = 'authenticated');

-- Example data (optional - for testing)
-- INSERT INTO ingredient_temperature_phases (ingredient_id, phase_name, temp_start_c, temp_end_c, description_de)
-- VALUES 
--   ((SELECT id FROM ingredients WHERE name_de = 'Kerbel' LIMIT 1), 'A', 0, 60, 'Frische Phase'),
--   ((SELECT id FROM ingredients WHERE name_de = 'Kerbel' LIMIT 1), 'B', 60, 120, 'Entwicklungsphase'),
--   ((SELECT id FROM ingredients WHERE name_de = 'Kerbel' LIMIT 1), 'C', 120, 170, 'Intensive Phase');
