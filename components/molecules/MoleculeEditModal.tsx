'use client';

import { useState, useEffect } from 'react';
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
    Divider,
    Typography,
    Autocomplete,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { updateMolecule, updateIngredientMolecule } from '@/lib/mutations/molecules';
import { searchMoleculesByGroup } from '@/lib/queries/molecules';

interface MoleculeEditModalProps {
    open: boolean;
    onClose: () => void;
    ingredientId: string;
    molecule: {
        id: string;
        name_de: string;
        descriptors_de: string;
        solubility_de: string;
        group_id: string;
        parent_id?: string;
        variation_label?: string;
        is_key: boolean;
        is_tracked: boolean;
        has_trigeminal_activation?: boolean;
    };
}

export function MoleculeEditModal({
    open,
    onClose,
    ingredientId,
    molecule,
}: MoleculeEditModalProps) {
    const [descriptorsDe, setDescriptorsDe] = useState(molecule.descriptors_de || '');
    const [solubilityDe, setSolubilityDe] = useState(molecule.solubility_de || '');
    const [isKey, setIsKey] = useState(molecule.is_key);
    const [isTracked, setIsTracked] = useState(molecule.is_tracked);
    const [hasTrigeminalActivation, setHasTrigeminalActivation] = useState(molecule.has_trigeminal_activation ?? false);
    const [parentId, setParentId] = useState<string | null>(molecule.parent_id || null);
    const [variationLabel, setVariationLabel] = useState(molecule.variation_label || '');
    const queryClient = useQueryClient();

    // Fetch potential parent molecules from the same group
    const { data: groupMolecules = [] } = useQuery({
        queryKey: ['group-molecules', molecule.group_id],
        queryFn: () => searchMoleculesByGroup(molecule.group_id),
        enabled: open,
    });

    // Reset form when molecule changes
    useEffect(() => {
        setDescriptorsDe(molecule.descriptors_de || '');
        setSolubilityDe(molecule.solubility_de || '');
        setIsKey(molecule.is_key);
        setIsTracked(molecule.is_tracked);
        setHasTrigeminalActivation(molecule.has_trigeminal_activation ?? false);
        setParentId(molecule.parent_id || null);
        setVariationLabel(molecule.variation_label || '');
    }, [molecule]);

    // Update molecule properties (global)
    const updateMoleculeMutation = useMutation({
        mutationFn: () => updateMolecule(
            molecule.id,
            descriptorsDe.trim(),
            solubilityDe.trim(),
            parentId || null,
            variationLabel.trim() || null
        ),
    });

    // Update ingredient-molecule relationship (local)
    const updateRelationMutation = useMutation({
        mutationFn: () => updateIngredientMolecule(ingredientId, molecule.id, isKey, isTracked, hasTrigeminalActivation),
    });

    const handleSave = async () => {
        try {
            // Check if global properties changed
            const globalChanged =
                descriptorsDe.trim() !== (molecule.descriptors_de || '') ||
                solubilityDe.trim() !== (molecule.solubility_de || '');

            const relationChanged =
                isKey !== molecule.is_key ||
                isTracked !== molecule.is_tracked ||
                hasTrigeminalActivation !== (molecule.has_trigeminal_activation ?? false);

            const variationChanged =
                parentId !== (molecule.parent_id || null) ||
                variationLabel.trim() !== (molecule.variation_label || '');

            if (globalChanged || variationChanged) {
                await updateMoleculeMutation.mutateAsync();
            }

            if (relationChanged) {
                await updateRelationMutation.mutateAsync();
            }

            queryClient.invalidateQueries({ queryKey: ['ingredient-profile', ingredientId] });
            onClose();
        } catch (error) {
            // Error handling is done by mutations
        }
    };

    const isPending = updateMoleculeMutation.isPending || updateRelationMutation.isPending;
    const isError = updateMoleculeMutation.isError || updateRelationMutation.isError;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Molekül bearbeiten - {molecule.name_de}</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Global properties warning */}
                    <Alert severity="warning" icon={<WarningIcon />}>
                        <Typography variant="body2" fontWeight={600}>
                            Globale Eigenschaften
                        </Typography>
                        <Typography variant="caption">
                            Änderungen an Aromatik und Löslichkeit betreffen <strong>alle Zutaten</strong> mit dieser Molekül.
                        </Typography>
                    </Alert>

                    {/* Global properties */}
                    <TextField
                        label="Aromatik / Deskriptoren"
                        multiline
                        rows={3}
                        value={descriptorsDe}
                        onChange={(e) => setDescriptorsDe(e.target.value)}
                        placeholder="z.B. frisch, grün, krautig..."
                        disabled={isPending}
                    />

                    <TextField
                        label="Löslichkeit"
                        value={solubilityDe}
                        onChange={(e) => setSolubilityDe(e.target.value)}
                        placeholder="z.B. wasserlöslich, fettlöslich..."
                        disabled={isPending}
                    />

                    <Divider />
                    <Typography variant="subtitle2" color="text.secondary">
                        Variationsdetails
                    </Typography>

                    <Autocomplete
                        options={groupMolecules.filter(m => m.id !== molecule.id)}
                        getOptionLabel={(option) => option.name_de}
                        renderInput={(params) => (
                            <TextField {...params} label="Basismolekül (optional)" />
                        )}
                        value={groupMolecules.find(m => m.id === parentId) || null}
                        onChange={(_, newValue) => setParentId(newValue ? newValue.id : null)}
                        disabled={isPending}
                    />

                    <TextField
                        label="Variationsbezeichnung (ej. Floral, Picante)"
                        value={variationLabel}
                        onChange={(e) => setVariationLabel(e.target.value)}
                        placeholder="Wird als 'Nombre (Variación)' angezeigt"
                        disabled={isPending}
                    />

                    <Divider sx={{ my: 1 }} />

                    {/* Ingredient-specific properties */}
                    <Typography variant="subtitle2" color="text.secondary">
                        Zutat-spezifische Eigenschaften
                    </Typography>

                    <Box>
                        <FormControlLabel
                            control={<Checkbox checked={isKey} onChange={(e) => setIsKey(e.target.checked)} />}
                            label="Schlüsselmolekül (Key)"
                            disabled={isPending}
                        />
                        <FormControlLabel
                            control={<Checkbox checked={isTracked} onChange={(e) => setIsTracked(e.target.checked)} />}
                            label="Verfolgt (Tracked)"
                            disabled={isPending}
                        />
                        <FormControlLabel
                            control={<Checkbox checked={hasTrigeminalActivation} onChange={(e) => setHasTrigeminalActivation(e.target.checked)} />}
                            label="Trigeminal (T)"
                            disabled={isPending}
                        />
                    </Box>

                    {isError && (
                        <Alert severity="error">
                            Fehler beim Speichern. Bitte versuchen Sie es erneut.
                        </Alert>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={isPending}>
                    Abbrechen
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={isPending}
                    startIcon={isPending ? <CircularProgress size={16} /> : null}
                >
                    Speichern
                </Button>
            </DialogActions>
        </Dialog>
    );
}
