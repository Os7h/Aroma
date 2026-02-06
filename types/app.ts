// UI-specific types

export interface AromaGroup {
    id: string;
    slot: number; // 1-9
    name_de: string;
    descriptor_de: string;
    color_hex: string;
}

export interface Molecule {
    id: string;
    name_de: string;
    descriptors_de: string;
    solubility_de: string;
    group_id: string;
    parent_id?: string;
    variation_label?: string;
}

export interface MoleculeWithFlags extends Molecule {
    is_key: boolean;
    is_tracked: boolean;
    has_trigeminal_activation: boolean;
}

export interface GroupWithMolecules extends AromaGroup {
    molecules: MoleculeWithFlags[];
    temperature?: {
        temp_start_c: number;
        temp_end_c: number;
        behavior_description_de?: string | null;
    } | null;
}

export interface IngredientProfile {
    ingredient: {
        id: string;
        name_de: string;
        taste_sweet?: number;
        taste_sour?: number;
        taste_salty?: number;
        taste_bitter?: number;
        taste_umami?: number;
        taste_description_de?: string;
    };
    groups: GroupWithMolecules[];
}

export interface FlavorMatch {
    id: string;
    note: string | null;
    target_ingredient: {
        id: string;
        name_de: string;
    };
    target_active_slots: number[]; // [1, 2, 7]
}

export interface IngredientListItem {
    id: string;
    name_de: string;
}

export interface TasteProfile {
    sweet?: number; // süß (1-3)
    sour?: number; // sauer (1-3)
    salty?: number; // salzig (1-3)
    bitter?: number; // bitter (1-3)
    umami?: number; // umami (1-3)
}
