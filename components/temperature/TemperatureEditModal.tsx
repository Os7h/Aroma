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
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTemperatureRange, deleteTemperatureRange } from '@/lib/mutations/temperature';
import { temperatureRangeSchema } from '@/lib/validation/schemas';
import type { GroupWithMolecules } from '@/types/app';

interface TemperatureEditModalProps {
    open: boolean;
    onClose: () => void;
    ingredientId: string;
    group: GroupWithMolecules;
}

// Generate temperature options (0, 10, 20, ..., 170)
const TEMP_OPTIONS = Array.from({ length: 18 }, (_, i) => i * 10);

export function TemperatureEditModal({ open, onClose, ingredientId, group }: TemperatureEditModalProps) {
    const queryClient = useQueryClient();

    const [tempStart, setTempStart] = useState(group.temperature?.temp_start_c ?? 0);
    const [tempEnd, setTempEnd] = useState(group.temperature?.temp_end_c ?? 170);
    const [behavior, setBehavior] = useState(group.temperature?.behavior_description_de ?? '');
    const [validationError, setValidationError] = useState<string | null>(null);

    const updateMutation = useMutation({
        mutationFn: updateTemperatureRange,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ingredient-profile', ingredientId] });
            onClose();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteTemperatureRange(ingredientId, group.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ingredient-profile', ingredientId] });
            onClose();
        },
    });

    const handleSave = () => {
        // Validate
        const validation = temperatureRangeSchema.safeParse({
            temp_start_c: tempStart,
            temp_end_c: tempEnd,
        });

        if (!validation.success) {
            setValidationError(validation.error.errors[0].message);
            return;
        }

        setValidationError(null);

        updateMutation.mutate({
            ingredientId,
            groupId: group.id,
            tempStartC: tempStart,
            tempEndC: tempEnd,
            behaviorDescriptionDe: behavior.trim() || undefined,
        });
    };

    const handleDelete = () => {
        if (confirm('Möchten Sie diesen Temperaturbereich wirklich löschen?')) {
            deleteMutation.mutate();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Temperatur bearbeiten - Gruppe {group.slot}: {group.name_de}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Temperature Range */}
                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            Temperaturbereich
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <TextField
                                select
                                label="Von"
                                value={tempStart}
                                onChange={(e) => setTempStart(Number(e.target.value))}
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
                                value={tempEnd}
                                onChange={(e) => setTempEnd(Number(e.target.value))}
                                sx={{ flex: 1 }}
                            >
                                {TEMP_OPTIONS.map((temp) => (
                                    <MenuItem key={temp} value={temp}>
                                        {temp}°C
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    </Box>

                    {/* Behavior Description */}
                    <TextField
                        label="Verhalten (optional)"
                        multiline
                        rows={3}
                        value={behavior}
                        onChange={(e) => setBehavior(e.target.value)}
                        placeholder="z.B. Frische, grüne Noten entwickeln sich bei niedrigen Temperaturen"
                        helperText="Beschreiben Sie, wie sich die Aromen in diesem Temperaturbereich verhalten"
                    />

                    {/* Validation Error */}
                    {validationError && (
                        <Alert severity="error">{validationError}</Alert>
                    )}

                    {/* Mutation Error */}
                    {updateMutation.isError && (
                        <Alert severity="error">
                            Fehler beim Speichern. Bitte versuchen Sie es erneut.
                        </Alert>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
                <Button
                    onClick={handleDelete}
                    color="error"
                    disabled={deleteMutation.isPending || !group.temperature}
                >
                    Löschen
                </Button>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button onClick={onClose} disabled={updateMutation.isPending}>
                        Abbrechen
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        disabled={updateMutation.isPending}
                    >
                        {updateMutation.isPending ? 'Speichern...' : 'Speichern'}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
}
