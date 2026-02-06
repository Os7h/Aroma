'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Box,
    Typography,
    Alert,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTemperaturePhases, upsertTemperaturePhase, deleteTemperaturePhase } from '@/lib/queries/temperaturePhases';
import type { TemperaturePhase } from '@/types/temperature';

interface TemperaturePhasesEditorProps {
    open: boolean;
    onClose: () => void;
    ingredientId: string;
    ingredientName: string;
}

// Generate temperature options (0, 10, 20, ..., 170)
const TEMP_OPTIONS = Array.from({ length: 18 }, (_, i) => i * 10);

interface PhaseForm {
    id?: string;
    phase_name: string;
    temp_start_c: number;
    temp_end_c: number;
    description_de: string;
}

export function TemperaturePhasesEditor({ open, onClose, ingredientId, ingredientName }: TemperaturePhasesEditorProps) {
    const queryClient = useQueryClient();

    const [editingPhase, setEditingPhase] = useState<PhaseForm | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    // Fetch existing phases
    const { data: phases = [], isLoading } = useQuery({
        queryKey: ['temperature-phases', ingredientId],
        queryFn: () => getTemperaturePhases(ingredientId),
        enabled: open,
    });

    const upsertMutation = useMutation({
        mutationFn: upsertTemperaturePhase,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['temperature-phases', ingredientId] });
            setEditingPhase(null);
            setValidationError(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTemperaturePhase,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['temperature-phases', ingredientId] });
        },
    });

    const handleAddPhase = () => {
        // Find next available phase letter
        const usedPhases = phases.map(p => p.phase_name);
        const availablePhases = ['A', 'B', 'C', 'D', 'E', 'F'];
        const nextPhase = availablePhases.find(p => !usedPhases.includes(p)) || 'A';

        setEditingPhase({
            phase_name: nextPhase,
            temp_start_c: 0,
            temp_end_c: 170,
            description_de: '',
        });
    };

    const handleEditPhase = (phase: TemperaturePhase) => {
        setEditingPhase({
            id: phase.id,
            phase_name: phase.phase_name,
            temp_start_c: phase.temp_start_c,
            temp_end_c: phase.temp_end_c,
            description_de: phase.description_de || '',
        });
    };

    const handleSavePhase = () => {
        if (!editingPhase) return;

        // Validate
        if (editingPhase.temp_start_c >= editingPhase.temp_end_c) {
            setValidationError('Start-Temperatur muss kleiner als End-Temperatur sein');
            return;
        }

        if (!editingPhase.phase_name.trim()) {
            setValidationError('Phase-Name ist erforderlich');
            return;
        }

        setValidationError(null);

        upsertMutation.mutate({
            id: editingPhase.id,
            ingredient_id: ingredientId,
            phase_name: editingPhase.phase_name,
            temp_start_c: editingPhase.temp_start_c,
            temp_end_c: editingPhase.temp_end_c,
            description_de: editingPhase.description_de.trim() || undefined,
        });
    };

    const handleDeletePhase = (phaseId: string) => {
        if (confirm('Möchten Sie diese Phase wirklich löschen?')) {
            deleteMutation.mutate(phaseId);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Temperaturphasen bearbeiten - {ingredientName}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2 }}>
                    {/* Existing Phases */}
                    {!isLoading && phases.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Definierte Phasen
                            </Typography>
                            <List>
                                {phases.map((phase) => (
                                    <ListItem
                                        key={phase.id}
                                        sx={{
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            borderRadius: 1,
                                            mb: 1,
                                            cursor: 'pointer',
                                            '&:hover': { bgcolor: 'action.hover' },
                                        }}
                                        onClick={() => handleEditPhase(phase)}
                                    >
                                        <ListItemText
                                            primary={`Phase ${phase.phase_name}: ${phase.temp_start_c}–${phase.temp_end_c}°C`}
                                            secondary={phase.description_de || 'Keine Beschreibung'}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                edge="end"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeletePhase(phase.id);
                                                }}
                                                disabled={deleteMutation.isPending}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}

                    {/* Add Phase Button */}
                    {!editingPhase && (
                        <Button
                            startIcon={<AddIcon />}
                            onClick={handleAddPhase}
                            variant="outlined"
                            fullWidth
                        >
                            Phase hinzufügen
                        </Button>
                    )}

                    {/* Edit Phase Form */}
                    {editingPhase && (
                        <Box sx={{ p: 2, border: '2px solid', borderColor: 'primary.main', borderRadius: 1 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                {editingPhase.id ? 'Phase bearbeiten' : 'Neue Phase'}
                            </Typography>

                            {/* Phase Name */}
                            <TextField
                                label="Phase-Name"
                                value={editingPhase.phase_name}
                                onChange={(e) => setEditingPhase({ ...editingPhase, phase_name: e.target.value.toUpperCase() })}
                                fullWidth
                                sx={{ mb: 2 }}
                                placeholder="A, B, C, etc."
                            />

                            {/* Temperature Range */}
                            <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                                <TextField
                                    select
                                    label="Von"
                                    value={editingPhase.temp_start_c}
                                    onChange={(e) => setEditingPhase({ ...editingPhase, temp_start_c: Number(e.target.value) })}
                                    sx={{ flex: 1 }}
                                >
                                    {TEMP_OPTIONS.map((temp) => (
                                        <MenuItem key={temp} value={temp}>
                                            {temp}°C
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <Typography>bis</Typography>
                                <TextField
                                    select
                                    label="Bis"
                                    value={editingPhase.temp_end_c}
                                    onChange={(e) => setEditingPhase({ ...editingPhase, temp_end_c: Number(e.target.value) })}
                                    sx={{ flex: 1 }}
                                >
                                    {TEMP_OPTIONS.map((temp) => (
                                        <MenuItem key={temp} value={temp}>
                                            {temp}°C
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>

                            {/* Description */}
                            <TextField
                                label="Beschreibung (optional)"
                                multiline
                                rows={2}
                                value={editingPhase.description_de}
                                onChange={(e) => setEditingPhase({ ...editingPhase, description_de: e.target.value })}
                                fullWidth
                                sx={{ mb: 2 }}
                                placeholder="z.B. Frische Phase, Entwicklungsphase, etc."
                            />

                            {/* Validation Error */}
                            {validationError && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {validationError}
                                </Alert>
                            )}

                            {/* Action Buttons */}
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    onClick={() => {
                                        setEditingPhase(null);
                                        setValidationError(null);
                                    }}
                                    disabled={upsertMutation.isPending}
                                >
                                    Abbrechen
                                </Button>
                                <Button
                                    onClick={handleSavePhase}
                                    variant="contained"
                                    disabled={upsertMutation.isPending}
                                >
                                    {upsertMutation.isPending ? 'Speichern...' : 'Speichern'}
                                </Button>
                            </Box>
                        </Box>
                    )}

                    {/* Mutation Error */}
                    {upsertMutation.isError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            Fehler beim Speichern. Bitte versuchen Sie es erneut.
                        </Alert>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Schließen</Button>
            </DialogActions>
        </Dialog>
    );
}
