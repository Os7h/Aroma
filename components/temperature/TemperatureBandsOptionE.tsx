'use client';

import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import { useQuery } from '@tanstack/react-query';
import { TemperatureEditModal } from './TemperatureEditModal';
import { TemperaturePhasesEditor } from './TemperaturePhasesEditor';
import { getTemperaturePhases } from '@/lib/queries/temperaturePhases';
import type { GroupWithMolecules } from '@/types/app';

interface TemperatureBandsOptionEProps {
    groups: GroupWithMolecules[];
    ingredientId: string;
    ingredientName: string;
    isAdmin?: boolean;
}

export function TemperatureBandsOptionE({ groups, ingredientId, ingredientName, isAdmin = false }: TemperatureBandsOptionEProps) {
    const [editingGroup, setEditingGroup] = useState<GroupWithMolecules | null>(null);
    const [showPhasesEditor, setShowPhasesEditor] = useState(false);

    const { data: phases = [] } = useQuery({
        queryKey: ['temperature-phases', ingredientId],
        queryFn: () => getTemperaturePhases(ingredientId),
    });

    const groupsWithTemp = groups.filter(g => g.molecules.length > 0 && g.temperature);
    const maxTemp = 170;

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 2 }}>
                    AROMENENTFALTUNG
                </Typography>
                {isAdmin && (
                    <Button size="small" startIcon={<SettingsIcon />} onClick={() => setShowPhasesEditor(true)} variant="outlined">
                        Phasen
                    </Button>
                )}
            </Box>

            {/* Color dots for each group (like in the book) */}
            <Box sx={{ mb: 3 }}>
                {groupsWithTemp.map((group) => (
                    <Box key={group.id} sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                        {/* Dots showing temperature range */}
                        <Box sx={{ display: 'flex', gap: 0.5, flex: 1, maxWidth: 400 }}>
                            {Array.from({ length: 9 }).map((_, i) => {
                                const tempAtDot = (i / 8) * maxTemp;
                                const { temp_start_c, temp_end_c } = group.temperature!;
                                const isActive = tempAtDot >= temp_start_c && tempAtDot <= temp_end_c;
                                const intensity = isActive
                                    ? 1 - Math.abs((tempAtDot - (temp_start_c + temp_end_c) / 2) / ((temp_end_c - temp_start_c) / 2))
                                    : 0;

                                return (
                                    <Box
                                        key={i}
                                        sx={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: '50%',
                                            border: '1px solid',
                                            borderColor: isActive ? group.color_hex : 'grey.400',
                                            bgcolor: isActive ? `${group.color_hex}${Math.round(intensity * 255).toString(16).padStart(2, '0')}` : 'transparent',
                                            transition: 'all 0.3s ease',
                                        }}
                                    />
                                );
                            })}
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, minWidth: 100 }}>
                            Gruppe {group.slot}
                        </Typography>
                        {isAdmin && (
                            <EditIcon
                                fontSize="small"
                                sx={{ cursor: 'pointer', color: 'action.active' }}
                                onClick={() => setEditingGroup(group)}
                            />
                        )}
                    </Box>
                ))}
            </Box>

            {/* Main temperature diagram */}
            <Box sx={{ position: 'relative', mt: 4 }}>
                {/* Phase dividers (vertical dashed lines) */}
                {phases.map((phase) => (
                    <Box key={phase.id}>
                        {/* Start line */}
                        <Box
                            sx={{
                                position: 'absolute',
                                left: `${(phase.temp_start_c / maxTemp) * 100}%`,
                                top: -30,
                                bottom: -60,
                                width: 1,
                                borderLeft: '2px dashed',
                                borderColor: 'grey.500',
                                zIndex: 1,
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: -25,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    bgcolor: 'grey.700',
                                    color: 'white',
                                    width: 24,
                                    height: 24,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                }}
                            >
                                {phase.phase_name}
                            </Box>
                        </Box>
                    </Box>
                ))}

                {/* Temperature bars */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {groupsWithTemp.map((group) => {
                        const { temp_start_c, temp_end_c } = group.temperature!;
                        const startPercent = (temp_start_c / maxTemp) * 100;
                        const widthPercent = ((temp_end_c - temp_start_c) / maxTemp) * 100;

                        return (
                            <Box
                                key={group.id}
                                sx={{
                                    position: 'relative',
                                    height: 20,
                                    bgcolor: 'grey.200',
                                    borderRadius: 0.5,
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: `${startPercent}%`,
                                        width: `${widthPercent}%`,
                                        height: '100%',
                                        background: `linear-gradient(90deg, 
                      ${group.color_hex}40 0%, 
                      ${group.color_hex} 50%, 
                      ${group.color_hex}40 100%)`,
                                        borderRadius: 0.5,
                                    }}
                                />
                            </Box>
                        );
                    })}
                </Box>

                {/* Temperature scale */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, px: 0.5 }}>
                    <Typography variant="caption" fontWeight={700}>0</Typography>
                    <Typography variant="caption" fontWeight={700}>50</Typography>
                    <Typography variant="caption" fontWeight={700}>100</Typography>
                    <Typography variant="caption" fontWeight={700}>150 °C</Typography>
                </Box>
            </Box>

            {/* Phase descriptions */}
            {phases.length > 0 && (
                <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {phases.map((phase) => (
                        <Box key={phase.id} sx={{ flex: '1 1 200px' }}>
                            <Typography variant="caption" fontWeight={700}>
                                {phase.phase_name}
                            </Typography>
                            {phase.description_de && (
                                <Typography variant="caption" display="block" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                    {phase.description_de}
                                </Typography>
                            )}
                        </Box>
                    ))}
                </Box>
            )}

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
