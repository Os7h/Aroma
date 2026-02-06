-- Apply taste_description_de migration
ALTER TABLE ingredients
  ADD COLUMN IF NOT EXISTS taste_description_de text;
