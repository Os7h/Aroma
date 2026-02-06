-- ============================================
-- Admin Mode: Temperature Editing
-- ============================================

-- Add behavior description column to ingredient_group_temperature
ALTER TABLE ingredient_group_temperature
  ADD COLUMN IF NOT EXISTS behavior_description_de text;

-- Example data update (optional - for testing)
-- UPDATE ingredient_group_temperature
-- SET behavior_description_de = 'Frische, grüne Noten entwickeln sich bei niedrigen Temperaturen'
-- WHERE ingredient_id = (SELECT id FROM ingredients WHERE name_de = 'Kerbel' LIMIT 1)
--   AND group_id = (SELECT id FROM aroma_groups WHERE slot = 1 LIMIT 1);
