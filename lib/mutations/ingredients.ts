// @ts-nocheck
import { supabase } from '../supabase/client';

/**
 * Update ingredient name
 */
export async function updateIngredientName(
    ingredientId: string,
    nameDe: string
): Promise<void> {
    const { error } = await supabase
        .from('ingredients')
        .update({ name_de: nameDe } as any)
        .eq('id', ingredientId);

    if (error) {
        throw new Error(`Failed to update ingredient: ${error.message}`);
    }
}

/**
 * Create new ingredient
 */
export async function createIngredient(
    nameDe: string
): Promise<{ id: string }> {
    const { data, error } = await supabase
        .from('ingredients')
        .insert({ name_de: nameDe } as any)
        .select('id')
        .single();

    if (error) {
        throw new Error(`Failed to create ingredient: ${error.message}`);
    }

    if (!data) {
        throw new Error('No data returned from create ingredient');
    }

    return { id: (data as any).id };
}
