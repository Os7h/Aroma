import { supabase } from '@/lib/supabase/client';
import type { IngredientProfile, FlavorMatch, IngredientListItem } from '@/types/app';

export async function getIngredientProfile(ingredientId: string): Promise<IngredientProfile | null> {
    try {
        const { data, error } = await (supabase.rpc as any)('rpc_get_ingredient_profile', {
            p_ingredient_id: ingredientId,
        });

        if (error) throw error;
        return data as IngredientProfile;
    } catch (error) {
        console.error('Error fetching ingredient profile:', error);
        return null;
    }
}

export async function getIngredientMatches(ingredientId: string): Promise<FlavorMatch[]> {
    try {
        const { data, error } = await (supabase.rpc as any)('rpc_get_ingredient_matches', {
            p_ingredient_id: ingredientId,
        });

        if (error) throw error;
        return (data as FlavorMatch[]) || [];
    } catch (error) {
        console.error('Error fetching ingredient matches:', error);
        return [];
    }
}

export async function getAllIngredients(): Promise<IngredientListItem[]> {
    try {
        const { data, error } = await supabase
            .from('ingredients')
            .select('id, name_de')
            .order('name_de');

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
        return data || [];
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        return [];
    }
}

export async function getAllGroups() {
    try {
        const { data, error } = await supabase
            .from('aroma_groups')
            .select('*')
            .order('slot');

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching groups:', error);
        return [];
    }
}
