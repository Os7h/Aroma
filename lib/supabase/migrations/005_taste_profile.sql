-- Add taste profile columns to ingredients table
ALTER TABLE ingredients
  ADD COLUMN IF NOT EXISTS taste_sweet integer CHECK (taste_sweet >= 0 AND taste_sweet <= 3),
  ADD COLUMN IF NOT EXISTS taste_sour integer CHECK (taste_sour >= 0 AND taste_sour <= 3),
  ADD COLUMN IF NOT EXISTS taste_salty integer CHECK (taste_salty >= 0 AND taste_salty <= 3),
  ADD COLUMN IF NOT EXISTS taste_bitter integer CHECK (taste_bitter >= 0 AND taste_bitter <= 3),
  ADD COLUMN IF NOT EXISTS taste_umami integer CHECK (taste_umami >= 0 AND taste_umami <= 3);

-- Example data (optional - for testing)
-- UPDATE ingredients SET 
--   taste_sweet = 2,
--   taste_sour = 1,
--   taste_umami = 3
-- WHERE name_de = 'Kerbel';
