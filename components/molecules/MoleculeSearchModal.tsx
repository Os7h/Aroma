'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Checkbox,
    FormControlLabel,
    Box,
    Typography,
    CircularProgress,
    Alert,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { searchMoleculesByGroup } from '@/lib/queries/molecules';
import { addMoleculeToIngredient } from '@/lib/mutations/molecules';
import { MoleculeCreateModal } from './MoleculeCreateModal';
import AddIcon from '@mui/icons-material/Add';
import type { Molecule } from '@/types/app';

interface MoleculeSearchModalProps {
    open: boolean;
    onClose: () => void;
    groupId: string;
    groupName: string;
    ingredientId: string;
    existingMoleculeIds: string[]; // IDs of molecules already in this ingredient
}

export function MoleculeSearchModal({
    open,
    onClose,
    groupId,
    groupName,
    ingredientId,
    existingMoleculeIds,
}: MoleculeSearchModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMolecule, setSelectedMolecule] = useState<string | null>(null);
    const [isKey, setIsKey] = useState(false);
    const [isTracked, setIsTracked] = useState(false);
    const [hasTrigeminalActivation, setHasTrigeminalActivation] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const queryClient = useQueryClient();

    // Search molecules
    const { data: molecules, isLoading } = useQuery<Molecule[]>({
        queryKey: ['molecules-search', groupId, searchQuery],
        queryFn: () => searchMoleculesByGroup(groupId, searchQuery) as Promise<Molecule[]>,
        enabled: open,
    });

    // Add molecule mutation
    const addMutation = useMutation({
        mutationFn: () => {
            if (!selectedMolecule) throw new Error('No molecule selected');
            return addMoleculeToIngredient(ingredientId, selectedMolecule, isKey, isTracked, hasTrigeminalActivation);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ingredient-profile', ingredientId] });
            handleClose();
        },
    });

    const handleClose = () => {
        setSearchQuery('');
        setSelectedMolecule(null);
        setIsKey(false);
        setIsTracked(false);
        setHasTrigeminalActivation(false);
        onClose();
    };

    const handleAdd = () => {
        if (selectedMolecule) {
            addMutation.mutate();
        }
    };

    // Filter out molecules already in ingredient
    const availableMolecules = molecules?.filter(
        (m) => !existingMoleculeIds.includes(m.id)
    ) || [];

    return (
        <>
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Molekül hinzufügen - {groupName}</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        {/* Search field */}
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <TextField
                                fullWidth
                                label="Molekül suchen"
                                placeholder="Name eingeben..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Button
                                variant="outlined"
                                sx={{ minWidth: 'auto', px: 2 }}
                                onClick={() => setShowCreateModal(true)}
                                title="Neue Molekül erstellen"
                            >
                                <AddIcon />
                            </Button>
                        </Box>

                        {/* Loading state */}
                        {isLoading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                                <CircularProgress />
                            </Box>
                        )}

                        {/* Molecule list */}
                        {!isLoading && availableMolecules.length > 0 && (
                            <List sx={{ maxHeight: 300, overflow: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                {availableMolecules.map((molecule) => (
                                    <ListItemButton
                                        key={molecule.id}
                                        selected={selectedMolecule === molecule.id}
                                        onClick={() => setSelectedMolecule(molecule.id)}
                                    >
                                        <ListItemText
                                            primary={`${molecule.name_de}${molecule.variation_label ? ` (${molecule.variation_label})` : ''}`}
                                            secondary={molecule.descriptors_de || 'Keine Beschreibung'}
                                        />
                                    </ListItemButton>
                                ))}
                            </List>
                        )}

                        {/* No results */}
                        {!isLoading && availableMolecules.length === 0 && (
                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <Alert severity="info" sx={{ mb: 2 }}>
                                    {molecules?.length === 0
                                        ? 'Keine Moleküle in dieser Gruppe gefunden'
                                        : 'Alle Moleküle dieser Gruppe sind bereits hinzugefügt'}
                                </Alert>

                                {searchQuery.trim() && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<AddIcon />}
                                        onClick={() => setShowCreateModal(true)}
                                        fullWidth
                                    >
                                        Neu erstellen: "{searchQuery}"
                                    </Button>
                                )}
                            </Box>
                        )}

                        {/* Options */}
                        {selectedMolecule && (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Optionen
                                </Typography>
                                <FormControlLabel
                                    control={<Checkbox checked={isKey} onChange={(e) => setIsKey(e.target.checked)} />}
                                    label="Schlüsselmolekül (Key)"
                                />
                                <FormControlLabel
                                    control={<Checkbox checked={isTracked} onChange={(e) => setIsTracked(e.target.checked)} />}
                                    label="Verfolgt (Tracked)"
                                />
                                <FormControlLabel
                                    control={<Checkbox checked={hasTrigeminalActivation} onChange={(e) => setHasTrigeminalActivation(e.target.checked)} />}
                                    label="Trigeminal (T)"
                                />
                            </Box>
                        )}

                        {/* Error */}
                        {addMutation.isError && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                Fehler beim Hinzufügen. Bitte versuchen Sie es erneut.
                            </Alert>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={addMutation.isPending}>
                        Abbrechen
                    </Button>
                    <Button
                        onClick={handleAdd}
                        variant="contained"
                        disabled={!selectedMolecule || addMutation.isPending}
                    >
                        {addMutation.isPending ? 'Hinzufügen...' : 'Hinzufügen'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Create Molecule Modal */}
            {showCreateModal && (
                <MoleculeCreateModal
                    open={showCreateModal}
                    onClose={() => {
                        setShowCreateModal(false);
                        // Optionally close search modal if creation was successful
                        // giving user a chance to see it updated
                    }}
                    groupId={groupId}
                    groupName={groupName}
                    ingredientId={ingredientId}
                    initialName={searchQuery}
                />
            )}
        </>
    );
}
