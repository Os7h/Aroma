'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    CircularProgress,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateIngredientName } from '@/lib/mutations/ingredients';

interface IngredientEditModalProps {
    open: boolean;
    onClose: () => void;
    ingredientId: string;
    currentName: string;
}

export function IngredientEditModal({
    open,
    onClose,
    ingredientId,
    currentName,
}: IngredientEditModalProps) {
    const [name, setName] = useState(currentName);
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: () => updateIngredientName(ingredientId, name.trim()),
        onSuccess: () => {
            // Invalidate ingredient profile and list queries
            queryClient.invalidateQueries({ queryKey: ['ingredient-profile', ingredientId] });
            queryClient.invalidateQueries({ queryKey: ['ingredients'] });
            onClose();
        },
    });

    const handleSave = () => {
        if (name.trim()) {
            updateMutation.mutate();
        }
    };

    const handleClose = () => {
        if (!updateMutation.isPending) {
            setName(currentName);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Ingredientname bearbeiten</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Name (Deutsch)"
                    type="text"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={updateMutation.isPending}
                    error={!name.trim()}
                    helperText={!name.trim() ? 'Name darf nicht leer sein' : ''}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={updateMutation.isPending}>
                    Abbrechen
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={!name.trim() || updateMutation.isPending}
                    startIcon={updateMutation.isPending ? <CircularProgress size={16} /> : null}
                >
                    Speichern
                </Button>
            </DialogActions>
        </Dialog>
    );
}
