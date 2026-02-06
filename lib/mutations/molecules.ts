import { supabase } from '../supabase/client';

/**
 * Add existing molecule to ingredient
 */
export async function addMoleculeToIngredient(
    ingredientId: string,
    moleculeId: string,
    isKey: boolean = false,
    isTracked: boolean = false,
    hasTrigeminalActivation: boolean = false
) {
    const { error } = await supabase
        .from('ingredient_molecules')
        .insert({
            ingredient_id: ingredientId,
            molecule_id: moleculeId,
            is_key: isKey,
            is_tracked: isTracked,
            has_trigeminal_activation: hasTrigeminalActivation,
        } as any);

    if (error) {
        throw new Error(`Failed to add molecule to ingredient: ${error.message}`);
    }
}

/**
 * Remove molecule from ingredient
 * Only removes the relationship, not the molecule itself
 */
export async function removeMoleculeFromIngredient(
    ingredientId: string,
    moleculeId: string
) {
    const { error } = await supabase
        .from('ingredient_molecules')
        .delete()
        .eq('ingredient_id', ingredientId)
        .eq('molecule_id', moleculeId);

    if (error) {
        throw new Error(`Failed to remove molecule from ingredient: ${error.message}`);
    }
}

/**
 * Update ingredient-molecule relationship (is_key, is_tracked, has_trigeminal_activation)
 */
export async function updateIngredientMolecule(
    ingredientId: string,
    moleculeId: string,
    isKey: boolean,
    isTracked: boolean,
    hasTrigeminalActivation: boolean
) {
    const { error } = await supabase
        .from('ingredient_molecules')
        .update({
            is_key: isKey,
            is_tracked: isTracked,
            has_trigeminal_activation: hasTrigeminalActivation,
        } as any)
        .eq('ingredient_id', ingredientId)
        .eq('molecule_id', moleculeId);

    if (error) {
        throw new Error(`Failed to update ingredient molecule: ${error.message}`);
    }
}

/**
 * Create new molecule and associate it with ingredient
 */
export async function createMoleculeAndAssociate(
    ingredientId: string,
    groupId: string,
    nameDe: string,
    descriptorsDe: string,
    solubilityDe: string,
    isKey: boolean = false,
    isTracked: boolean = false,
    hasTrigeminalActivation: boolean = false,
    parentId?: string,
    variationLabel?: string
): Promise<{ id: string }> {
    // First, create the molecule
    const { data: molecule, error: createError } = await supabase
        .from('molecules')
        .insert({
            group_id: groupId,
            name_de: nameDe,
            descriptors_de: descriptorsDe,
            solubility_de: solubilityDe,
            parent_id: parentId,
            variation_label: variationLabel,
        } as any)
        .select('id')
        .single();

    if (createError) {
        throw new Error(`Failed to create molecule: ${createError.message}`);
    }

    if (!molecule) {
        throw new Error('No data returned from create molecule');
    }

    const moleculeId = (molecule as any).id;

    // Then, associate it with the ingredient
    await addMoleculeToIngredient(ingredientId, moleculeId, isKey, isTracked, hasTrigeminalActivation);

    return { id: moleculeId };
}

/**
 * Update molecule properties (GLOBAL - affects all ingredients)
 */
export async function updateMolecule(
    moleculeId: string,
    descriptorsDe: string,
    solubilityDe: string,
    parentId?: string | null,
    variationLabel?: string | null
) {
    const { error } = await supabase
        .from('molecules')
        .update({
            descriptors_de: descriptorsDe,
            solubility_de: solubilityDe,
            parent_id: parentId,
            variation_label: variationLabel,
        } as any)
        .eq('id', moleculeId);

    if (error) {
        throw new Error(`Failed to update molecule: ${error.message}`);
    }
}
