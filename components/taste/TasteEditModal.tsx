'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Slider,
    Alert,
    TextField,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTasteProfile } from '@/lib/mutations/taste';

interface TasteEditModalProps {
    open: boolean;
    onClose: () => void;
    ingredientId: string;
    ingredientName: string;
    currentProfile: {
        sweet?: number;
        sour?: number;
        salty?: number;
        bitter?: number;
        umami?: number;
    };
    currentDescription?: string;
}

const TASTE_CONFIG = [
    { key: 'sweet', label: 'Süß', color: '#E91E63', icon: '🍬' },
    { key: 'sour', label: 'Sauer', color: '#CDDC39', icon: '🍋' },
    { key: 'salty', label: 'Salzig', color: '#00BCD4', icon: '🧂' },
    { key: 'bitter', label: 'Bitter', color: '#795548', icon: '☕' },
    { key: 'umami', label: 'Umami', color: '#FF9800', icon: '🍄' },
] as const;

export function TasteEditModal({
    open,
    onClose,
    ingredientId,
    ingredientName,
    currentProfile,
    currentDescription,
}: TasteEditModalProps) {
    const queryClient = useQueryClient();
    const [description, setDescription] = useState(currentDescription || '');
    const [values, setValues] = useState({
        sweet: currentProfile.sweet || 0,
        sour: currentProfile.sour || 0,
        salty: currentProfile.salty || 0,
        bitter: currentProfile.bitter || 0,
        umami: currentProfile.umami || 0,
    });

    const mutation = useMutation({
        mutationFn: updateTasteProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ingredient-profile', ingredientId] });
            onClose();
        },
    });

    const handleSave = () => {
        mutation.mutate({
            ingredient_id: ingredientId,
            taste_sweet: values.sweet || null,
            taste_sour: values.sour || null,
            taste_salty: values.salty || null,
            taste_bitter: values.bitter || null,
            taste_umami: values.umami || null,
            taste_description_de: description.trim() || null,
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Geschmack bearbeiten - {ingredientName}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2 }}>
                    {/* Description field */}
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Beschreibung (optional)"
                        placeholder="z.B. Kerbel hat einen milden, leicht süßlichen Geschmack..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{ mb: 3 }}
                    />

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Wählen Sie die Intensität für jeden Geschmack (0 = nicht vorhanden, 1-3 = schwach bis stark)
                    </Typography>

                    <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {TASTE_CONFIG.map(({ key, label, color, icon }) => (
                            <Box key={key}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography sx={{ fontSize: '1.5rem' }}>{icon}</Typography>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color, flex: 1 }}>
                                        {label}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            color: values[key as keyof typeof values] > 0 ? color : 'text.disabled',
                                            minWidth: 40,
                                            textAlign: 'right',
                                        }}
                                    >
                                        {values[key as keyof typeof values] || '—'}
                                    </Typography>
                                </Box>

                                <Slider
                                    value={values[key as keyof typeof values]}
                                    onChange={(_, value) => setValues({ ...values, [key]: value as number })}
                                    min={0}
                                    max={3}
                                    step={1}
                                    marks={[
                                        { value: 0, label: '—' },
                                        { value: 1, label: '1' },
                                        { value: 2, label: '2' },
                                        { value: 3, label: '3' },
                                    ]}
                                    sx={{
                                        color,
                                        '& .MuiSlider-thumb': {
                                            width: 20,
                                            height: 20,
                                        },
                                        '& .MuiSlider-track': {
                                            height: 6,
                                        },
                                        '& .MuiSlider-rail': {
                                            height: 6,
                                        },
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>

                    {mutation.isError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            Fehler beim Speichern. Bitte versuchen Sie es erneut.
                        </Alert>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={mutation.isPending}>
                    Abbrechen
                </Button>
                <Button onClick={handleSave} variant="contained" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Speichern...' : 'Speichern'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
