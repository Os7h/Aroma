// @ts-nocheck
import { supabase } from '@/lib/supabase/client';

export interface TemperatureRangeUpdate {
    ingredientId: string;
    groupId: string;
    tempStartC: number;
    tempEndC: number;
    behaviorDescriptionDe?: string;
}

export async function updateTemperatureRange({
    ingredientId,
    groupId,
    tempStartC,
    tempEndC,
    behaviorDescriptionDe,
}: TemperatureRangeUpdate) {
    try {
        const { data, error } = await supabase
            .from('ingredient_group_temperature')
            .upsert({
                ingredient_id: ingredientId,
                group_id: groupId,
                temp_start_c: tempStartC,
                temp_end_c: tempEndC,
                behavior_description_de: behaviorDescriptionDe || null,
            } as any)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating temperature range:', error);
        throw error;
    }
}

export async function deleteTemperatureRange(ingredientId: string, groupId: string) {
    try {
        const { error } = await supabase
            .from('ingredient_group_temperature')
            .delete()
            .eq('ingredient_id', ingredientId)
            .eq('group_id', groupId);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting temperature range:', error);
        throw error;
    }
}
