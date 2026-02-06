-- ============================================
-- Add taste description field
-- ============================================

-- Add taste_description_de column to ingredients table
ALTER TABLE ingredients
  ADD COLUMN IF NOT EXISTS taste_description_de text;

-- Example: Update existing ingredient with description
-- UPDATE ingredients
-- SET taste_description_de = 'Kerbel hat einen milden, leicht süßlichen Geschmack mit Anklängen von Anis und Petersilie.'
-- WHERE name_de = 'Kerbel';
