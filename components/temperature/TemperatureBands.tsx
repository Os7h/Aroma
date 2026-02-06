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

interface TemperatureBandsProps {
    groups: GroupWithMolecules[];
    ingredientId: string;
    ingredientName: string;
    isAdmin?: boolean;
}

export function TemperatureBands({ groups, ingredientId, ingredientName, isAdmin = false }: TemperatureBandsProps) {
    const [editingGroup, setEditingGroup] = useState<GroupWithMolecules | null>(null);
    const [showPhasesEditor, setShowPhasesEditor] = useState(false);

    const { data: phases = [] } = useQuery({
        queryKey: ['temperature-phases', ingredientId],
        queryFn: () => getTemperaturePhases(ingredientId),
    });

    const groupsWithTemp = groups.filter(g => g.molecules.length > 0);
    const maxTemp = 170;

    // Get unique phase boundaries for vertical lines
    const phaseBoundaries = new Set<number>();
    phases.forEach(phase => {
        phaseBoundaries.add(phase.temp_start_c);
        phaseBoundaries.add(phase.temp_end_c);
    });
    const sortedBoundaries = Array.from(phaseBoundaries).sort((a, b) => a - b);

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
                {/* Vertical boundary lines - Transparent to events */}
                {sortedBoundaries.map((temp) => {
                    const positionPercent = (temp / maxTemp) * 100;

                    return (
                        <Box
                            key={`boundary-${temp}`}
                            sx={{
                                position: 'absolute',
                                left: `${positionPercent}%`,
                                top: -17,
                                height: groupsWithTemp.length * 24 + (groupsWithTemp.length - 1) * 4,
                                width: 1,
                                borderLeft: '2px dashed',
                                borderColor: 'grey.400',
                                zIndex: 1,
                                pointerEvents: 'none',
                            }}
                        />
                    );
                })}

                {/* Phase labels - Transparent to events */}
                {phases.map((phase) => {
                    const centerTemp = (phase.temp_start_c + phase.temp_end_c) / 2;
                    const positionPercent = (centerTemp / maxTemp) * 100;

                    return (
                        <Box key={phase.id} sx={{ pointerEvents: 'none' }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    position: 'absolute',
                                    left: `${positionPercent}%`,
                                    top: -40,
                                    transform: 'translateX(-50%)',
                                    fontWeight: 700,
                                    color: 'grey.700',
                                    fontSize: '0.75rem',
                                    zIndex: 2,
                                }}
                            >
                                {phase.phase_name}
                            </Typography>

                            <Box
                                sx={{
                                    position: 'absolute',
                                    left: `${positionPercent}%`,
                                    top: -25,
                                    transform: 'translateX(-50%)',
                                    bgcolor: 'grey.700',
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    zIndex: 2,
                                }}
                            />
                        </Box>
                    );
                })}

                {/* Temperature bars - Always on top */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, position: 'relative', zIndex: 10 }}>
                    {groupsWithTemp.map((group) => {
                        // Use full range (0-170) if no temperature defined
                        const temp_start_c = group.temperature?.temp_start_c ?? 0;
                        const temp_end_c = group.temperature?.temp_end_c ?? maxTemp;
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
                                    userSelect: 'none',
                                    '&:hover': isAdmin ? {
                                        bgcolor: 'grey.300',
                                        '& .edit-icon': {
                                            opacity: 1,
                                        },
                                        '& .group-label': {
                                            opacity: 1,
                                        },
                                    } : {},
                                }}
                                onClick={() => isAdmin && setEditingGroup(group)}
                            >
                                {isAdmin && (
                                    <Typography
                                        className="group-label"
                                        variant="caption"
                                        sx={{
                                            position: 'absolute',
                                            left: 4,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            fontWeight: 600,
                                            fontSize: '0.7rem',
                                            color: 'grey.700',
                                            opacity: 0.6,
                                            pointerEvents: 'none',
                                            zIndex: 3,
                                        }}
                                    >
                                        Gruppe {group.slot}
                                    </Typography>
                                )}

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
                                        pointerEvents: 'none',
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
                                            opacity: 0.6,
                                            pointerEvents: 'none',
                                            zIndex: 3,
                                        }}
                                    />
                                )}
                            </Box>
                        );
                    })}
                </Box>

                {/* Temperature scale with ABSOLUTE positioning for precision */}
                <Box sx={{ position: 'relative', mt: 1, height: 20 }}>
                    {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170].map((temp) => {
                        const positionPercent = (temp / maxTemp) * 100;
                        return (
                            <Typography
                                key={temp}
                                variant="caption"
                                fontWeight={700}
                                sx={{
                                    position: 'absolute',
                                    left: `${positionPercent}%`,
                                    transform: 'translateX(-50%)',
                                    fontSize: '0.65rem',
                                }}
                            >
                                {temp}{temp === 170 ? '°C' : ''}
                            </Typography>
                        );
                    })}
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
