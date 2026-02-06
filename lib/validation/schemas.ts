import { z } from 'zod';

// Temperature validation
export const temperatureRangeSchema = z.object({
    temp_start_c: z.number()
        .min(0, 'Minimum temperature is 0°C')
        .max(170, 'Maximum temperature is 170°C')
        .multipleOf(10, 'Temperature must be a multiple of 10'),
    temp_end_c: z.number()
        .min(0, 'Minimum temperature is 0°C')
        .max(170, 'Maximum temperature is 170°C')
        .multipleOf(10, 'Temperature must be a multiple of 10'),
}).refine(
    (data) => data.temp_start_c < data.temp_end_c,
    {
        message: 'Start temperature must be less than end temperature',
        path: ['temp_start_c'],
    }
);

// Ingredient match validation
export const ingredientMatchSchema = z.object({
    source_ingredient_id: z.string().uuid(),
    target_ingredient_id: z.string().uuid(),
    note: z.string().optional().nullable(),
}).refine(
    (data) => data.source_ingredient_id !== data.target_ingredient_id,
    {
        message: 'Cannot match an ingredient with itself',
        path: ['target_ingredient_id'],
    }
);

// Molecule validation
export const moleculeSchema = z.object({
    name_de: z.string().min(1, 'Molecule name is required'),
    descriptors_de: z.string(),
    solubility_de: z.string(),
    group_id: z.string().uuid(),
});

// Ingredient validation
export const ingredientSchema = z.object({
    name_de: z.string().min(1, 'Ingredient name is required'),
});

export type TemperatureRange = z.infer<typeof temperatureRangeSchema>;
export type IngredientMatch = z.infer<typeof ingredientMatchSchema>;
export type MoleculeInput = z.infer<typeof moleculeSchema>;
export type IngredientInput = z.infer<typeof ingredientSchema>;
