-- ================================================
-- Migration: Fix Molecule Uniqueness Conflict
-- ================================================
-- The molecules table likely has a UNIQUE constraint 
-- on name_de which prevents creating variations 
-- with the same base name.
-- ================================================

-- Drop the existing unique constraint if it exists.
-- Common names are 'molecules_name_de_key' or 'molecules_name_unique'
DO $$ 
BEGIN 
    -- Attempt to drop common unique constraint names
    ALTER TABLE molecules DROP CONSTRAINT IF EXISTS molecules_name_de_key;
    ALTER TABLE molecules DROP CONSTRAINT IF EXISTS molecules_name_unique;
    
    -- Also check for unique indexes that aren't constraints
    DROP INDEX IF EXISTS idx_molecules_name_de_unique;
EXCEPTION 
    WHEN OTHERS THEN 
        RAISE NOTICE 'Could not drop constraint/index automatically. It may not exist or have a different name.';
END $$;

-- Optional: Add a composite unique constraint to prevent EXACT duplicates 
-- (same name AND same variation label)
ALTER TABLE molecules 
ADD CONSTRAINT unique_molecule_variation UNIQUE (name_de, variation_label);

-- Add comment
COMMENT ON CONSTRAINT unique_molecule_variation ON molecules IS 
'Ensures that each molecule name + variation label combination is unique, allowing multiple variations of the same base name.';
