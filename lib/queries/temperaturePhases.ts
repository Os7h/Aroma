import { supabase } from '@/lib/supabase/client';
import type { TemperaturePhase } from '@/types/temperature';

export async function getTemperaturePhases(ingredientId: string): Promise<TemperaturePhase[]> {
    try {
        const { data, error } = await supabase
            .from('ingredient_temperature_phases')
            .select('*')
            .eq('ingredient_id', ingredientId)
            .order('temp_start_c');

        if (error) {
            console.error('Supabase error fetching phases:', error);
            throw error;
        }
        return data || [];
    } catch (error) {
        console.error('Error fetching temperature phases:', error);
        return [];
    }
}

export async function upsertTemperaturePhase(phase: Omit<TemperaturePhase, 'id'> & { id?: string }) {
    try {
        console.log('Upserting phase:', phase);

        const { data, error } = await supabase
            .from('ingredient_temperature_phases')
            .upsert({
                id: phase.id,
                ingredient_id: phase.ingredient_id,
                phase_name: phase.phase_name,
                temp_start_c: phase.temp_start_c,
                temp_end_c: phase.temp_end_c,
                description_de: phase.description_de || null,
            })
            .select();

        if (error) {
            console.error('Supabase error:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            console.error('Error details:', error.details);
            throw error;
        }

        console.log('Phase upserted successfully:', data);
        return data;
    } catch (error: any) {
        console.error('Error upserting temperature phase:', error);
        console.error('Error type:', typeof error);
        console.error('Error keys:', Object.keys(error || {}));
        if (error?.message) console.error('Error message:', error.message);
        if (error?.code) console.error('Error code:', error.code);
        throw error;
    }
}

export async function deleteTemperaturePhase(phaseId: string) {
    try {
        const { error } = await supabase
            .from('ingredient_temperature_phases')
            .delete()
            .eq('id', phaseId);

        if (error) {
            console.error('Supabase error deleting phase:', error);
            throw error;
        }
    } catch (error) {
        console.error('Error deleting temperature phase:', error);
        throw error;
    }
}
