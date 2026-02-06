// @ts-nocheck
'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
    Box,
    Alert,
    CircularProgress,
    Autocomplete,
    Typography,
    Divider,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createMoleculeAndAssociate } from '@/lib/mutations/molecules';
import { searchMoleculesByGroup } from '@/lib/queries/molecules';
import { Molecule } from '@/types/app';

interface MoleculeCreateModalProps {
    open: boolean;
    onClose: () => void;
    groupId: string;
    groupName: string;
    ingredientId: string;
    initialName?: string;
}

export function MoleculeCreateModal({
    open,
    onClose,
    groupId,
    groupName,
    ingredientId,
    initialName = '',
}: MoleculeCreateModalProps) {
    const [nameDe, setNameDe] = useState(initialName);
    const [descriptorsDe, setDescriptorsDe] = useState('');
    const [solubilityDe, setSolubilityDe] = useState('');
    const [isKey, setIsKey] = useState(false);
    const [isTracked, setIsTracked] = useState(false);
    const [hasTrigeminalActivation, setHasTrigeminalActivation] = useState(false);
    const [isVariation, setIsVariation] = useState(false);
    const [parentId, setParentId] = useState<string | null>(null);
    const [variationLabel, setVariationLabel] = useState('');
    const queryClient = useQueryClient();

    // Fetch potential parent molecules from the same group
    const { data: groupMolecules = [] } = useQuery({
        queryKey: ['group-molecules', groupId],
        queryFn: () => searchMoleculesByGroup(groupId),
        enabled: open && isVariation,
    });

    const createMutation = useMutation({
        mutationFn: () =>
            createMoleculeAndAssociate(
                ingredientId,
                groupId,
                nameDe.trim(),
                descriptorsDe.trim(),
                solubilityDe.trim(),
                isKey,
                isTracked,
                hasTrigeminalActivation,
                isVariation ? (parentId || undefined) : undefined,
                isVariation ? variationLabel.trim() : undefined
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ingredient-profile', ingredientId] });
            handleClose();
        },
    });

    const handleClose = () => {
        setNameDe('');
        setDescriptorsDe('');
        setSolubilityDe('');
        setIsKey(false);
        setIsTracked(false);
        setHasTrigeminalActivation(false);
        setIsVariation(false);
        setParentId(null);
        setVariationLabel('');
        onClose();
    };

    const handleCreate = () => {
        if (nameDe.trim()) {
            createMutation.mutate();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Neue Molekül erstellen - {groupName}</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        autoFocus
                        label="Name (Deutsch) *"
                        value={nameDe}
                        onChange={(e) => setNameDe(e.target.value)}
                        error={!nameDe.trim() && nameDe.length > 0}
                        helperText={!nameDe.trim() && nameDe.length > 0 ? 'Name ist erforderlich' : ''}
                        disabled={createMutation.isPending}
                    />

                    <TextField
                        label="Aromatik / Deskriptoren"
                        multiline
                        rows={3}
                        value={descriptorsDe}
                        onChange={(e) => setDescriptorsDe(e.target.value)}
                        placeholder="z.B. frisch, grün, krautig..."
                        disabled={createMutation.isPending}
                    />

                    <TextField
                        label="Löslichkeit"
                        value={solubilityDe}
                        onChange={(e) => setSolubilityDe(e.target.value)}
                        placeholder="z.B. wasserlöslich, fettlöslich..."
                        disabled={createMutation.isPending}
                    />

                    <Box>
                        <FormControlLabel
                            control={<Checkbox checked={isKey} onChange={(e) => setIsKey(e.target.checked)} />}
                            label="Schlüsselmolekül (Key)"
                            disabled={createMutation.isPending}
                        />
                        <FormControlLabel
                            control={<Checkbox checked={isTracked} onChange={(e) => setIsTracked(e.target.checked)} />}
                            label="Verfolgt (Tracked)"
                            disabled={createMutation.isPending}
                        />
                        <FormControlLabel
                            control={<Checkbox checked={hasTrigeminalActivation} onChange={(e) => setHasTrigeminalActivation(e.target.checked)} />}
                            label="Trigeminal (T)"
                            disabled={createMutation.isPending}
                        />
                    </Box>

                    <Divider />

                    <Box>
                        <FormControlLabel
                            control={<Checkbox checked={isVariation} onChange={(e) => setIsVariation(e.target.checked)} />}
                            label="Ist dies eine Variation?"
                            disabled={createMutation.isPending}
                        />
                        {isVariation && (
                            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2, pl: 2, borderLeft: '2px solid #eee' }}>
                                <Autocomplete
                                    options={groupMolecules}
                                    getOptionLabel={(option: any) => option.name_de}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Basismolekül auswählen *" />
                                    )}
                                    value={groupMolecules.find((m: any) => m.id === parentId) || null}
                                    onChange={(_, newValue: any) => {
                                        setParentId(newValue ? newValue.id : null);
                                        // Auto-fill some fields from parent if they are empty
                                        if (newValue && !descriptorsDe) setDescriptorsDe(newValue.descriptors_de || '');
                                        if (newValue && !solubilityDe) setSolubilityDe(newValue.solubility_de || '');
                                        if (newValue && !nameDe) setNameDe(newValue.name_de);
                                    }}
                                    disabled={createMutation.isPending}
                                />
                                <TextField
                                    label="Variationsbezeichnung (z.B. Blumig, Isomer B) *"
                                    value={variationLabel}
                                    onChange={(e) => setVariationLabel(e.target.value)}
                                    placeholder="Wird als 'Name (Label)' angezeigt"
                                    error={isVariation && !variationLabel.trim() && variationLabel.length > 0}
                                    helperText={isVariation && !variationLabel.trim() && variationLabel.length > 0 ? 'Bezeichnung ist erforderlich' : ''}
                                    disabled={createMutation.isPending}
                                />
                            </Box>
                        )}
                    </Box>

                    {createMutation.isError && (
                        <Alert severity="error">
                            Fehler beim Erstellen. Bitte versuchen Sie es erneut.
                        </Alert>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={createMutation.isPending}>
                    Abbrechen
                </Button>
                <Button
                    onClick={handleCreate}
                    variant="contained"
                    disabled={!nameDe.trim() || createMutation.isPending || (isVariation && (!parentId || !variationLabel.trim()))}
                    startIcon={createMutation.isPending ? <CircularProgress size={16} /> : null}
                >
                    Erstellen
                </Button>
            </DialogActions>
        </Dialog>
    );
}
