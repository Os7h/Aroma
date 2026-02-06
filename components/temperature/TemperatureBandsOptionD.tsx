'use client';

import { useState } from 'react';
import { Box, Typography, Chip, Button, IconButton, Paper } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import { useQuery } from '@tanstack/react-query';
import { TemperatureEditModal } from './TemperatureEditModal';
import { TemperaturePhasesEditor } from './TemperaturePhasesEditor';
import { getTemperaturePhases } from '@/lib/queries/temperaturePhases';
import type { GroupWithMolecules } from '@/types/app';

interface TemperatureBandsOptionDProps {
    groups: GroupWithMolecules[];
    ingredientId: string;
    ingredientName: string;
    isAdmin?: boolean;
}

export function TemperatureBandsOptionD({ groups, ingredientId, ingredientName, isAdmin = false }: TemperatureBandsOptionDProps) {
    const [editingGroup, setEditingGroup] = useState<GroupWithMolecules | null>(null);
    const [showPhasesEditor, setShowPhasesEditor] = useState(false);

    const { data: phases = [] } = useQuery({
        queryKey: ['temperature-phases', ingredientId],
        queryFn: () => getTemperaturePhases(ingredientId),
    });

    const groupsWithTemp = groups.filter(g => g.molecules.length > 0 && g.temperature);

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Opción D: Vista Estática Mejorada</Typography>
                {isAdmin && (
                    <Button size="small" startIcon={<SettingsIcon />} onClick={() => setShowPhasesEditor(true)} variant="outlined">
                        Phasen
                    </Button>
                )}
            </Box>

            <Paper sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                {/* Phases */}
                {phases.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                            <Typography variant="caption" fontWeight={600} sx={{ mr: 1 }}>
                                Phasen:
                            </Typography>
                            {phases.map((phase) => (
                                <Chip
                                    key={phase.id}
                                    label={`${phase.phase_name}: ${phase.temp_start_c}–${phase.temp_end_c}°C`}
                                    size="small"
                                    sx={{
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Groups */}
                {groupsWithTemp.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                            <Typography variant="caption" fontWeight={600} sx={{ mr: 1 }}>
                                Gruppen:
                            </Typography>
                            {groupsWithTemp.map((group) => (
                                <Chip
                                    key={group.id}
                                    label={`G${group.slot}: ${group.temperature!.temp_start_c}–${group.temperature!.temp_end_c}°C`}
                                    size="small"
                                    sx={{
                                        bgcolor: group.color_hex,
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        '&:hover': {
                                            opacity: 0.8,
                                        },
                                    }}
                                    onDelete={isAdmin ? () => setEditingGroup(group) : undefined}
                                    deleteIcon={isAdmin ? <EditIcon fontSize="small" sx={{ color: 'white !important' }} /> : undefined}
                                />
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Visual Timeline */}
                <Box>
                    {/* Temperature scale */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, px: 0.5 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>0°C</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>85°C</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>170°C</Typography>
                    </Box>

                    {/* Phase background */}
                    <Box
                        sx={{
                            position: 'relative',
                            height: 8,
                            bgcolor: 'grey.300',
                            borderRadius: 1,
                            mb: 1,
                            overflow: 'hidden',
                        }}
                    >
                        {phases.map((phase) => {
                            const startPercent = (phase.temp_start_c / 170) * 100;
                            const widthPercent = ((phase.temp_end_c - phase.temp_start_c) / 170) * 100;

                            return (
                                <Box
                                    key={phase.id}
                                    sx={{
                                        position: 'absolute',
                                        left: `${startPercent}%`,
                                        width: `${widthPercent}%`,
                                        height: '100%',
                                        bgcolor: 'primary.light',
                                        opacity: 0.5,
                                    }}
                                />
                            );
                        })}
                    </Box>

                    {/* Group bars */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {groupsWithTemp.map((group) => {
                            const { temp_start_c, temp_end_c } = group.temperature!;
                            const startPercent = (temp_start_c / 170) * 100;
                            const widthPercent = ((temp_end_c - temp_start_c) / 170) * 100;

                            return (
                                <Box
                                    key={group.id}
                                    sx={{
                                        position: 'relative',
                                        height: 24,
                                        bgcolor: 'grey.200',
                                        borderRadius: 1,
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            left: `${startPercent}%`,
                                            width: `${widthPercent}%`,
                                            height: '100%',
                                            background: `linear-gradient(90deg, ${group.color_hex}dd, ${group.color_hex})`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: `0 2px 4px ${group.color_hex}40`,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'scaleY(1.1)',
                                                zIndex: 1,
                                            },
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'white',
                                                fontWeight: 700,
                                                fontSize: '0.7rem',
                                                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                                            }}
                                        >
                                            G{group.slot}
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
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
