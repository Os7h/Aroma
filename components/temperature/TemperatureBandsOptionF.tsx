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

interface TemperatureBandsOptionFProps {
    groups: GroupWithMolecules[];
    ingredientId: string;
    ingredientName: string;
    isAdmin?: boolean;
}

export function TemperatureBandsOptionF({ groups, ingredientId, ingredientName, isAdmin = false }: TemperatureBandsOptionFProps) {
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
                <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 2, color: 'text.primary' }}>
                    AROMENENTFALTUNG
                </Typography>
                {isAdmin && (
                    <Button size="small" startIcon={<SettingsIcon />} onClick={() => setShowPhasesEditor(true)} variant="outlined">
                        Phasen bearbeiten
                    </Button>
                )}
            </Box>

            {/* Main temperature diagram */}
            <Box sx={{ position: 'relative', mt: 2 }}>
                {/* Phase markers (circles with letters) */}
                {phases.map((phase) => {
                    const positionPercent = ((phase.temp_start_c + phase.temp_end_c) / 2 / maxTemp) * 100;

                    return (
                        <Box key={phase.id}>
                            {/* Phase circle */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    left: `${positionPercent}%`,
                                    top: -35,
                                    transform: 'translateX(-50%)',
                                    bgcolor: 'grey.700',
                                    color: 'white',
                                    width: 28,
                                    height: 28,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '0.875rem',
                                    zIndex: 2,
                                }}
                            >
                                {phase.phase_name}
                            </Box>

                            {/* Vertical dashed line */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    left: `${positionPercent}%`,
                                    top: -5,
                                    height: groupsWithTemp.length * 24 + (groupsWithTemp.length - 1) * 4,
                                    width: 1,
                                    borderLeft: '2px dashed',
                                    borderColor: 'grey.400',
                                    zIndex: 1,
                                }}
                            />
                        </Box>
                    );
                })}

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
                                    height: 24,
                                    bgcolor: 'grey.200',
                                    borderRadius: 0,
                                    cursor: isAdmin ? 'pointer' : 'default',
                                    '&:hover': isAdmin ? {
                                        '& .edit-icon': {
                                            opacity: 1,
                                        },
                                    } : {},
                                }}
                                onClick={() => isAdmin && setEditingGroup(group)}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: `${startPercent}%`,
                                        width: `${widthPercent}%`,
                                        height: '100%',
                                        background: `linear-gradient(90deg, 
                      ${group.color_hex}60 0%, 
                      ${group.color_hex} 40%, 
                      ${group.color_hex} 60%, 
                      ${group.color_hex}60 100%)`,
                                    }}
                                />
                                {isAdmin && (
                                    <EditIcon
                                        className="edit-icon"
                                        sx={{
                                            position: 'absolute',
                                            right: 8,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            fontSize: '1rem',
                                            color: 'white',
                                            opacity: 0,
                                            transition: 'opacity 0.2s',
                                            zIndex: 2,
                                        }}
                                    />
                                )}
                            </Box>
                        );
                    })}
                </Box>

                {/* Temperature scale */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, px: 0.5 }}>
                    <Typography variant="body2" fontWeight={700}>0</Typography>
                    <Typography variant="body2" fontWeight={700}>50</Typography>
                    <Typography variant="body2" fontWeight={700}>100</Typography>
                    <Typography variant="body2" fontWeight={700}>150 °C</Typography>
                </Box>
            </Box>

            {/* Phase descriptions */}
            {phases.length > 0 && (
                <Box sx={{ mt: 3 }}>
                    {phases.map((phase, index) => (
                        <Typography
                            key={phase.id}
                            variant="body2"
                            component="span"
                            sx={{
                                mr: 2,
                                '& strong': { fontWeight: 700 },
                            }}
                        >
                            <strong>{phase.phase_name}</strong>{' '}
                            {phase.description_de && (
                                <span style={{ fontStyle: 'italic', color: '#666' }}>
                                    {phase.description_de}
                                </span>
                            )}
                            {index < phases.length - 1 && ' • '}
                        </Typography>
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
