-- ================================================
-- Migration: Update RPC with Molecule Variations
-- ================================================
-- Updates rpc_get_ingredient_profile to return
-- parent_id and variation_label
-- ================================================

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
                'group_id', m.group_id,
                'parent_id', m.parent_id,
                'variation_label', m.variation_label,
                'is_key', im.is_key,
                'is_tracked', im.is_tracked,
                'has_trigeminal_activation', im.has_trigeminal_activation
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
