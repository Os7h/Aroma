import { supabase } from '@/lib/supabase/client';

export interface TasteProfileUpdate {
    ingredient_id: string;
    taste_sweet?: number | null;
    taste_sour?: number | null;
    taste_salty?: number | null;
    taste_bitter?: number | null;
    taste_umami?: number | null;
    taste_description_de?: string | null;
}

export async function updateTasteProfile(data: TasteProfileUpdate) {
    try {
        console.log('Updating taste profile with data:', data);

        const { error } = await supabase
            .from('ingredients')
            .update({
                taste_sweet: data.taste_sweet,
                taste_sour: data.taste_sour,
                taste_salty: data.taste_salty,
                taste_bitter: data.taste_bitter,
                taste_umami: data.taste_umami,
                taste_description_de: data.taste_description_de,
            } as any)
            .eq('id', data.ingredient_id);

        if (error) {
            console.error('Supabase error updating taste profile:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code,
                fullError: error,
            });
            throw error;
        }

        console.log('Taste profile updated successfully');
    } catch (error) {
        console.error('Error updating taste profile:', error);
        throw error;
    }
}
