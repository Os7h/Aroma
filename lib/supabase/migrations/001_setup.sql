-- ============================================
-- AromaExplorer-Circles Database Setup
-- ============================================

-- 1. Create ingredient_matches table
CREATE TABLE IF NOT EXISTS ingredient_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_ingredient_id uuid NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  target_ingredient_id uuid NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  note text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_match UNIQUE(source_ingredient_id, target_ingredient_id),
  CONSTRAINT no_self_match CHECK (source_ingredient_id != target_ingredient_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ingredient_matches_source 
  ON ingredient_matches(source_ingredient_id);
CREATE INDEX IF NOT EXISTS idx_ingredient_matches_target 
  ON ingredient_matches(target_ingredient_id);

-- 2. Update temperature constraints (0-170°C, multiples of 10)
ALTER TABLE ingredient_group_temperature 
  DROP CONSTRAINT IF EXISTS temp_range_fixed;

ALTER TABLE ingredient_group_temperature
  DROP CONSTRAINT IF EXISTS temp_range_valid;

ALTER TABLE ingredient_group_temperature
  DROP CONSTRAINT IF EXISTS temp_multiples_of_10;

ALTER TABLE ingredient_group_temperature
  ADD CONSTRAINT temp_range_valid 
    CHECK (temp_start_c >= 0 AND temp_end_c <= 170 AND temp_start_c < temp_end_c);

ALTER TABLE ingredient_group_temperature
  ADD CONSTRAINT temp_multiples_of_10
    CHECK (temp_start_c % 10 = 0 AND temp_end_c % 10 = 0);

-- 3. RPC: Get ingredient profile with all groups and molecules
CREATE OR REPLACE FUNCTION rpc_get_ingredient_profile(p_ingredient_id uuid)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'ingredient', (
      SELECT row_to_json(i) 
      FROM ingredients i 
      WHERE i.id = p_ingredient_id
    ),
    'groups', (
      SELECT json_agg(
        json_build_object(
          'slot', ag.slot,
          'id', ag.id,
          'name_de', ag.name_de,
          'descriptor_de', ag.descriptor_de,
          'color_hex', ag.color_hex,
          'molecules', COALESCE((
            SELECT json_agg(
              json_build_object(
                'id', m.id,
                'name_de', m.name_de,
                'descriptors_de', m.descriptors_de,
                'solubility_de', m.solubility_de,
                'is_key', im.is_key,
                'is_tracked', im.is_tracked
              )
            )
            FROM ingredient_molecules im
            JOIN molecules m ON m.id = im.molecule_id
            WHERE im.ingredient_id = p_ingredient_id AND m.group_id = ag.id
          ), '[]'::json),
          'temperature', (
            SELECT row_to_json(igt)
            FROM ingredient_group_temperature igt
            WHERE igt.ingredient_id = p_ingredient_id AND igt.group_id = ag.id
          )
        )
        ORDER BY ag.slot
      )
      FROM aroma_groups ag
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 4. RPC: Get ingredient matches with target ingredient details
CREATE OR REPLACE FUNCTION rpc_get_ingredient_matches(p_ingredient_id uuid)
RETURNS json AS $$
BEGIN
  RETURN COALESCE((
    SELECT json_agg(
      json_build_object(
        'id', im.id,
        'note', im.note,
        'target_ingredient', json_build_object(
          'id', i.id,
          'name_de', i.name_de
        ),
        'target_active_slots', COALESCE((
          SELECT json_agg(DISTINCT ag.slot ORDER BY ag.slot)
          FROM ingredient_molecules im2
          JOIN molecules m ON m.id = im2.molecule_id
          JOIN aroma_groups ag ON ag.id = m.group_id
          WHERE im2.ingredient_id = i.id
        ), '[]'::json)
      )
    )
    FROM ingredient_matches im
    JOIN ingredients i ON i.id = im.target_ingredient_id
    WHERE im.source_ingredient_id = p_ingredient_id
  ), '[]'::json);
END;
$$ LANGUAGE plpgsql;

-- 5. Enable Row Level Security (RLS)
ALTER TABLE ingredient_matches ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
CREATE POLICY "Allow public read access on ingredient_matches"
  ON ingredient_matches FOR SELECT
  USING (true);

-- Allow insert/update/delete only for authenticated users
-- (You can refine this later with role checks)
CREATE POLICY "Allow authenticated insert on ingredient_matches"
  ON ingredient_matches FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on ingredient_matches"
  ON ingredient_matches FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on ingredient_matches"
  ON ingredient_matches FOR DELETE
  USING (auth.role() = 'authenticated');
