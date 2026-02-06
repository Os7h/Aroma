'use client';

import { useState } from 'react';
import { Box, Typography, Slider, Accordion, AccordionSummary, AccordionDetails, Chip, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsIcon from '@mui/icons-material/Settings';
import { useQuery } from '@tanstack/react-query';
import { TemperatureEditModal } from './TemperatureEditModal';
import { TemperaturePhasesEditor } from './TemperaturePhasesEditor';
import { getTemperaturePhases } from '@/lib/queries/temperaturePhases';
import type { GroupWithMolecules } from '@/types/app';

interface TemperatureBandsOptionCProps {
    groups: GroupWithMolecules[];
    ingredientId: string;
    ingredientName: string;
    isAdmin?: boolean;
}

export function TemperatureBandsOptionC({ groups, ingredientId, ingredientName, isAdmin = false }: TemperatureBandsOptionCProps) {
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
                <Typography variant="h6">Opción C: Acordeón</Typography>
                {isAdmin && (
                    <Button size="small" startIcon={<SettingsIcon />} onClick={() => setShowPhasesEditor(true)} variant="outlined">
                        Phasen
                    </Button>
                )}
            </Box>

            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', pr: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            {currentTemp}°C
                        </Typography>
                        {currentPhase && <Chip label={`Phase ${currentPhase.phase_name}`} size="small" color="primary" />}
                        <Box sx={{ flex: 1, display: 'flex', gap: 0.5 }}>
                            {activeGroupsAtTemp.map((group) => (
                                <Box
                                    key={group.id}
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: group.color_hex,
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    {/* Slider */}
                    <Slider
                        value={currentTemp}
                        onChange={(_, value) => setCurrentTemp(value as number)}
                        min={0}
                        max={170}
                        step={5}
                        marks={[
                            { value: 0, label: '0°C' },
                            { value: 85, label: '85°C' },
                            { value: 170, label: '170°C' },
                        ]}
                        sx={{ mb: 2 }}
                    />

                    {/* Active groups details */}
                    {activeGroupsAtTemp.length > 0 && (
                        <Box>
                            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                                Aktive Gruppen:
                            </Typography>
                            {activeGroupsAtTemp.map((group) => (
                                <Box
                                    key={group.id}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        mb: 0.5,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: '50%',
                                            bgcolor: group.color_hex,
                                        }}
                                    />
                                    <Typography variant="caption">
                                        Gruppe {group.slot} ({group.temperature!.temp_start_c}–{group.temperature!.temp_end_c}°C)
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )}

                    {currentPhase?.description_de && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', fontStyle: 'italic' }}>
                            {currentPhase.description_de}
                        </Typography>
                    )}
                </AccordionDetails>
            </Accordion>

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
