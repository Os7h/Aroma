/**
 * Script para importar datos desde CSV maestro a Supabase
 * 
 * Uso:
 * 1. Llena MASTER_DATA_TEMPLATE.csv con tus datos
 * 2. Ejecuta: npx tsx scripts/import-master-data.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Necesitas la service role key
const supabase = createClient(supabaseUrl, supabaseKey);

interface MasterDataRow {
    ingredient_name_de: string;
    ingredient_name_en: string;
    ingredient_category: string;
    // Grupos (hasta 9)
    group_1_slot?: string;
    group_1_descriptor?: string;
    group_1_temp_start?: string;
    group_1_temp_end?: string;
    group_2_slot?: string;
    group_2_descriptor?: string;
    group_2_temp_start?: string;
    group_2_temp_end?: string;
    group_3_slot?: string;
    group_3_descriptor?: string;
    group_3_temp_start?: string;
    group_3_temp_end?: string;
    // Moléculas (hasta 20)
    molecule_1_name?: string;
    molecule_1_group?: string;
    molecule_1_cas?: string;
    molecule_1_note?: string;
    molecule_2_name?: string;
    molecule_2_group?: string;
    molecule_2_cas?: string;
    molecule_2_note?: string;
    // Sabores
    taste_sweet?: string;
    taste_sour?: string;
    taste_salty?: string;
    taste_bitter?: string;
    taste_umami?: string;
    // Fases de temperatura
    phase_a_name?: string;
    phase_a_start?: string;
    phase_a_end?: string;
    phase_a_desc?: string;
    phase_b_name?: string;
    phase_b_start?: string;
    phase_b_end?: string;
    phase_b_desc?: string;
    phase_c_name?: string;
    phase_c_start?: string;
    phase_c_end?: string;
    phase_c_desc?: string;
}

async function importMasterData() {
    console.log('🚀 Iniciando importación de datos maestros...\n');

    // 1. Leer CSV
    const csvPath = path.join(__dirname, '../data/MASTER_DATA_TEMPLATE.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const rows: MasterDataRow[] = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
    });

    console.log(`📄 Encontradas ${rows.length} filas en el CSV\n`);

    // 2. Procesar cada ingrediente
    for (const row of rows) {
        console.log(`\n📦 Procesando: ${row.ingredient_name_de}...`);

        try {
            // 2.1 Insertar ingrediente
            const { data: ingredient, error: ingredientError } = await supabase
                .from('ingredients')
                .insert({
                    name_de: row.ingredient_name_de,
                    name_en: row.ingredient_name_en,
                    category: row.ingredient_category,
                    taste_sweet: row.taste_sweet ? parseInt(row.taste_sweet) : null,
                    taste_sour: row.taste_sour ? parseInt(row.taste_sour) : null,
                    taste_salty: row.taste_salty ? parseInt(row.taste_salty) : null,
                    taste_bitter: row.taste_bitter ? parseInt(row.taste_bitter) : null,
                    taste_umami: row.taste_umami ? parseInt(row.taste_umami) : null,
                })
                .select()
                .single();

            if (ingredientError) throw ingredientError;
            console.log(`  ✅ Ingrediente creado: ${ingredient.id}`);

            // 2.2 Insertar grupos (1-9)
            const groups = [];
            for (let i = 1; i <= 9; i++) {
                const slotKey = `group_${i}_slot` as keyof MasterDataRow;
                const descriptorKey = `group_${i}_descriptor` as keyof MasterDataRow;
                const tempStartKey = `group_${i}_temp_start` as keyof MasterDataRow;
                const tempEndKey = `group_${i}_temp_end` as keyof MasterDataRow;

                if (row[slotKey]) {
                    const { data: group, error: groupError } = await supabase
                        .from('ingredient_groups')
                        .insert({
                            ingredient_id: ingredient.id,
                            slot: parseInt(row[slotKey] as string),
                            descriptor_de: row[descriptorKey] as string,
                        })
                        .select()
                        .single();

                    if (groupError) throw groupError;
                    groups.push(group);
                    console.log(`  ✅ Grupo ${i} creado`);

                    // 2.2.1 Insertar temperatura del grupo
                    if (row[tempStartKey] && row[tempEndKey]) {
                        const { error: tempError } = await supabase
                            .from('group_temperatures')
                            .insert({
                                group_id: group.id,
                                temp_start_c: parseInt(row[tempStartKey] as string),
                                temp_end_c: parseInt(row[tempEndKey] as string),
                            });

                        if (tempError) throw tempError;
                        console.log(`    ✅ Temperatura del grupo ${i} creada`);
                    }
                }
            }

            // 2.3 Insertar moléculas (1-20)
            for (let i = 1; i <= 20; i++) {
                const nameKey = `molecule_${i}_name` as keyof MasterDataRow;
                const groupKey = `molecule_${i}_group` as keyof MasterDataRow;
                const casKey = `molecule_${i}_cas` as keyof MasterDataRow;
                const noteKey = `molecule_${i}_note` as keyof MasterDataRow;

                if (row[nameKey]) {
                    const groupSlot = parseInt(row[groupKey] as string);
                    const targetGroup = groups.find(g => g.slot === groupSlot);

                    if (!targetGroup) {
                        console.warn(`  ⚠️  Grupo ${groupSlot} no encontrado para molécula ${i}`);
                        continue;
                    }

                    const { error: moleculeError } = await supabase
                        .from('molecules')
                        .insert({
                            group_id: targetGroup.id,
                            name: row[nameKey] as string,
                            cas_number: row[casKey] as string,
                            note_de: row[noteKey] as string,
                        });

                    if (moleculeError) throw moleculeError;
                    console.log(`  ✅ Molécula ${i} creada`);
                }
            }

            // 2.4 Insertar fases de temperatura (A, B, C)
            const phases = ['a', 'b', 'c'];
            for (const phase of phases) {
                const nameKey = `phase_${phase}_name` as keyof MasterDataRow;
                const startKey = `phase_${phase}_start` as keyof MasterDataRow;
                const endKey = `phase_${phase}_end` as keyof MasterDataRow;
                const descKey = `phase_${phase}_desc` as keyof MasterDataRow;

                if (row[nameKey]) {
                    const { error: phaseError } = await supabase
                        .from('temperature_phases')
                        .insert({
                            ingredient_id: ingredient.id,
                            phase_name: row[nameKey] as string,
                            temp_start_c: parseInt(row[startKey] as string),
                            temp_end_c: parseInt(row[endKey] as string),
                            description_de: row[descKey] as string,
                        });

                    if (phaseError) throw phaseError;
                    console.log(`  ✅ Fase ${phase.toUpperCase()} creada`);
                }
            }

            console.log(`✅ ${row.ingredient_name_de} importado completamente`);
        } catch (error) {
            console.error(`❌ Error procesando ${row.ingredient_name_de}:`, error);
        }
    }

    console.log('\n🎉 Importación completada!');
}

// Ejecutar
importMasterData().catch(console.error);
