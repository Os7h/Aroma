-- ================================================
-- Migration: Add Trigeminal Activation Support
-- ================================================
-- This adds the ability to mark molecules as having
-- trigeminal activation (T) for specific ingredients.
-- When molecules from groups 1-8 have this flag,
-- Group 9 (Trigeminale Reize) auto-activates.
-- ================================================

-- Add trigeminal activation column to ingredient_molecules table
ALTER TABLE ingredient_molecules
ADD COLUMN has_trigeminal_activation BOOLEAN NOT NULL DEFAULT false;

-- Add helpful comment
COMMENT ON COLUMN ingredient_molecules.has_trigeminal_activation IS 
'Indicates if this molecule causes trigeminal activation in THIS ingredient. When true for molecules in groups 1-8, auto-activates group 9 for this ingredient.';
