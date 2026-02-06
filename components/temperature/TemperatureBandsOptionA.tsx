'use client';

import { useState } from 'react';
import { Box, Typography, Slider, Chip, Button, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import { useQuery } from '@tanstack/react-query';
import { TemperatureEditModal } from './TemperatureEditModal';
import { TemperaturePhasesEditor } from './TemperaturePhasesEditor';
import { getTemperaturePhases } from '@/lib/queries/temperaturePhases';
import type { GroupWithMolecules } from '@/types/app';

interface TemperatureBandsOptionAProps {
    groups: GroupWithMolecules[];
    ingredientId: string;
    ingredientName: string;
    isAdmin?: boolean;
}

export function TemperatureBandsOptionA({ groups, ingredientId, ingredientName, isAdmin = false }: TemperatureBandsOptionAProps) {
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
                <Typography variant="h6">Opción A: Slider + Chips</Typography>
                {isAdmin && (
                    <Button size="small" startIcon={<SettingsIcon />} onClick={() => setShowPhasesEditor(true)} variant="outlined">
                        Phasen
                    </Button>
                )}
            </Box>

            {/* Compact slider */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, minWidth: 70, color: 'primary.main' }}>
                    {currentTemp}°C
                </Typography>
                {currentPhase && <Chip label={currentPhase.phase_name} color="primary" size="small" />}
                <Slider
                    value={currentTemp}
                    onChange={(_, value) => setCurrentTemp(value as number)}
                    min={0}
                    max={170}
                    step={5}
                    sx={{ flex: 1 }}
                />
            </Box>

            {/* Active groups as chips */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                    Aktiv:
                </Typography>
                {activeGroupsAtTemp.map((group) => (
                    <Chip
                        key={group.id}
                        label={`Gruppe ${group.slot}`}
                        size="small"
                        sx={{
                            bgcolor: `${group.color_hex}20`,
                            borderColor: group.color_hex,
                            color: group.color_hex,
                            fontWeight: 600,
                        }}
                        variant="outlined"
                        onDelete={isAdmin ? () => setEditingGroup(group) : undefined}
                        deleteIcon={isAdmin ? <EditIcon fontSize="small" /> : undefined}
                    />
                ))}
                {activeGroupsAtTemp.length === 0 && (
                    <Typography variant="caption" color="text.secondary">
                        Keine
                    </Typography>
                )}
            </Box>

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
