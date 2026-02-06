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
import { useRouter } from 'next/navigation';
import { createIngredient } from '@/lib/mutations/ingredients';

interface IngredientCreateModalProps {
    open: boolean;
    onClose: () => void;
}

export function IngredientCreateModal({ open, onClose }: IngredientCreateModalProps) {
    const [name, setName] = useState('');
    const queryClient = useQueryClient();
    const router = useRouter();

    const createMutation = useMutation({
        mutationFn: () => createIngredient(name.trim()),
        onSuccess: (data) => {
            // Invalidate ingredients list
            queryClient.invalidateQueries({ queryKey: ['ingredients'] });
            // Navigate to new ingredient page
            router.push(`/ingredients/${data.id}`);
            // Reset and close
            setName('');
            onClose();
        },
    });

    const handleCreate = () => {
        if (name.trim()) {
            createMutation.mutate();
        }
    };

    const handleClose = () => {
        if (!createMutation.isPending) {
            setName('');
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Neues Ingredient erstellen</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Name (Deutsch)"
                    type="text"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={createMutation.isPending}
                    error={!name.trim() && name.length > 0}
                    helperText={!name.trim() && name.length > 0 ? 'Name darf nicht leer sein' : ''}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && name.trim()) {
                            handleCreate();
                        }
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={createMutation.isPending}>
                    Abbrechen
                </Button>
                <Button
                    onClick={handleCreate}
                    variant="contained"
                    disabled={!name.trim() || createMutation.isPending}
                    startIcon={createMutation.isPending ? <CircularProgress size={16} /> : null}
                >
                    Erstellen
                </Button>
            </DialogActions>
        </Dialog>
    );
}
