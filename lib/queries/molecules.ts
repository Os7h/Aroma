import { supabase } from '../supabase/client';

/**
 * Search molecules by group ID
 * Returns molecules that belong to a specific aroma group
 */
export async function searchMoleculesByGroup(
    groupId: string,
    searchQuery: string = ''
) {
    let query = supabase
        .from('molecules')
        .select('id, name_de, descriptors_de, solubility_de, group_id, parent_id, variation_label')
        .eq('group_id', groupId)
        .order('name_de');

    if (searchQuery.trim()) {
        query = query.ilike('name_de', `%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) {
        throw new Error(`Failed to search molecules: ${error.message}`);
    }

    return data || [];
}

/**
 * Get molecule details by ID
 */
export async function getMoleculeDetails(moleculeId: string) {
    const { data, error } = await supabase
        .from('molecules')
        .select('id, name_de, descriptors_de, solubility_de, group_id, parent_id, variation_label')
        .eq('id', moleculeId)
        .single();

    if (error) {
        throw new Error(`Failed to get molecule details: ${error.message}`);
    }

    return data;
}
