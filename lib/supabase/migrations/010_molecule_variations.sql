-- ================================================
-- Migration: Add Molecule Variations Support
-- ================================================
-- This allows linking a molecule to another (parent)
-- and adding a label to describe the variation.
-- ================================================

-- Add columns to molecules table
ALTER TABLE molecules
ADD COLUMN parent_id UUID REFERENCES molecules(id) ON DELETE SET NULL,
ADD COLUMN variation_label TEXT;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_molecules_parent_id ON molecules(parent_id);

-- Add helpful comments
COMMENT ON COLUMN molecules.parent_id IS 'References the base molecule if this is a variation.';
COMMENT ON COLUMN molecules.variation_label IS 'Descriptive label for this specific variation (e.g. "Floral", "Isomer B").';

-- Update search/profile views if necessary (Note: RPC will be updated in next step)
