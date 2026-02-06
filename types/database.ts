export interface Database {
    public: {
        Tables: {
            ingredients: {
                Row: {
                    id: string;
                    name_de: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    name_de: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    name_de?: string;
                    created_at?: string;
                };
            };
            aroma_groups: {
                Row: {
                    id: string;
                    slot: number;
                    name_de: string;
                    descriptor_de: string;
                    color_hex: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    slot: number;
                    name_de: string;
                    descriptor_de: string;
                    color_hex: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    slot?: number;
                    name_de?: string;
                    descriptor_de?: string;
                    color_hex?: string;
                    created_at?: string;
                };
            };
            molecules: {
                Row: {
                    id: string;
                    name_de: string;
                    group_id: string;
                    descriptors_de: string;
                    solubility_de: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    name_de: string;
                    group_id: string;
                    descriptors_de: string;
                    solubility_de: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    name_de?: string;
                    group_id?: string;
                    descriptors_de?: string;
                    solubility_de?: string;
                    created_at?: string;
                };
            };
            ingredient_molecules: {
                Row: {
                    ingredient_id: string;
                    molecule_id: string;
                    is_key: boolean;
                    is_tracked: boolean;
                };
                Insert: {
                    ingredient_id: string;
                    molecule_id: string;
                    is_key?: boolean;
                    is_tracked?: boolean;
                };
                Update: {
                    ingredient_id?: string;
                    molecule_id?: string;
                    is_key?: boolean;
                    is_tracked?: boolean;
                };
            };
            ingredient_group_temperature: {
                Row: {
                    ingredient_id: string;
                    group_id: string;
                    temp_start_c: number;
                    temp_end_c: number;
                };
                Insert: {
                    ingredient_id: string;
                    group_id: string;
                    temp_start_c: number;
                    temp_end_c: number;
                };
                Update: {
                    ingredient_id?: string;
                    group_id?: string;
                    temp_start_c?: number;
                    temp_end_c?: number;
                };
            };
            ingredient_matches: {
                Row: {
                    id: string;
                    source_ingredient_id: string;
                    target_ingredient_id: string;
                    note: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    source_ingredient_id: string;
                    target_ingredient_id: string;
                    note?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    source_ingredient_id?: string;
                    target_ingredient_id?: string;
                    note?: string | null;
                    created_at?: string;
                };
            };
        };
        Functions: {
            rpc_get_ingredient_profile: {
                Args: { p_ingredient_id: string };
                Returns: any;
            };
            rpc_get_ingredient_matches: {
                Args: { p_ingredient_id: string };
                Returns: any;
            };
        };
    };
}
