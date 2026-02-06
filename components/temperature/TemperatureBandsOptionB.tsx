'use client';

import { useState } from 'react';
import { Box, Typography, Slider, Paper, Button } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useQuery } from '@tanstack/react-query';
import { TemperatureEditModal } from './TemperatureEditModal';
import { TemperaturePhasesEditor } from './TemperaturePhasesEditor';
import { getTemperaturePhases } from '@/lib/queries/temperaturePhases';
import type { GroupWithMolecules } from '@/types/app';

interface TemperatureBandsOptionBProps {
    groups: GroupWithMolecules[];
    ingredientId: string;
    ingredientName: string;
    isAdmin?: boolean;
}

export function TemperatureBandsOptionB({ groups, ingredientId, ingredientName, isAdmin = false }: TemperatureBandsOptionBProps) {
    const [currentTemp, setCurrentTemp] = useState(85);
    const [editingGroup, setEditingGroup] = useState<GroupWithMolecules | null>(null);
    const [showPhasesEditor, setShowPhasesEditor] = useState(false);

    const { data: phases = [] } = useQuery({
        queryKey: ['temperature-phases', ingredientId],
        queryFn: () => getTemperaturePhases(ingredientId),
    });

    const groupsWithTemp = groups.filter(g => g.molecules.length > 0 && g.temperature);
    const currentPhase = phases.find(p => currentTemp >= p.temp_start_c && currentTemp <= p.temp_end_c);
    const activeGroupsAtTemp = groupsWithTemp.filter(g => {
        const { temp_start_c, temp_end_c } = g.temperature!;
        return currentTemp >= temp_start_c && currentTemp <= temp_end_c;
    });

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Opción B: Card Compacta</Typography>
                {isAdmin && (
                    <Button size="small" startIcon={<SettingsIcon />} onClick={() => setShowPhasesEditor(true)} variant="outlined">
                        Phasen
                    </Button>
                )}
            </Box>

            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                {/* Header row */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {currentTemp}°C
                    </Typography>
                    {currentPhase && (
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                                Phase {currentPhase.phase_name}
                            </Typography>
                            {currentPhase.description_de && (
                                <Typography variant="caption" display="block" sx={{ fontStyle: 'italic' }}>
                                    {currentPhase.description_de}
                                </Typography>
                            )}
                        </Box>
                    )}
                </Box>

                {/* Slider */}
                <Slider
                    value={currentTemp}
                    onChange={(_, value) => setCurrentTemp(value as number)}
                    min={0}
                    max={170}
                    step={5}
                    marks={[
                        { value: 0, label: '0°' },
                        { value: 85, label: '85°' },
                        { value: 170, label: '170°' },
                    ]}
                    sx={{ mb: 1 }}
                />

                {/* Active groups inline */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Typography variant="caption" fontWeight={600}>
                        Aktiv:
                    </Typography>
                    {activeGroupsAtTemp.map((group) => (
                        <Box
                            key={group.id}
                            sx={{
                                px: 1,
                                py: 0.25,
                                borderRadius: 1,
                                bgcolor: group.color_hex,
                                color: 'white',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                            }}
                        >
                            G{group.slot}
                        </Box>
                    ))}
                    {activeGroupsAtTemp.length === 0 && (
                        <Typography variant="caption" color="text.secondary">
                            Keine
                        </Typography>
                    )}
                </Box>
            </Paper>

            {editingGroup && (
                <TemperatureEditModal
                    open={!!editingGroup}
                    onClose={() => setEditingGroup(null)}
                    ingredientId={ingredientId}
                    group={editingGroup}
                />
            )}

            {showPhasesEditor && (
                <TemperaturePhasesEditor
                    open={showPhasesEditor}
                    onClose={() => setShowPhasesEditor(false)}
                    ingredientId={ingredientId}
                    ingredientName={ingredientName}
                />
            )}
        </Box>
    );
}
