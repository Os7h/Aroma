// Temperature phase types

export interface TemperaturePhase {
    id: string;
    ingredient_id: string;
    phase_name: string; // 'A', 'B', 'C'
    temp_start_c: number;
    temp_end_c: number;
    description_de?: string | null;
}

export interface IngredientWithPhases extends IngredientProfile {
    temperature_phases: TemperaturePhase[];
}
