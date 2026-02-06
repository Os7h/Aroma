'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Chip,
    Drawer,
    useMediaQuery,
    useTheme,
    IconButton,
    Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeMoleculeFromIngredient } from '@/lib/mutations/molecules';
import { MoleculeSearchModal } from './MoleculeSearchModal';
import { MoleculeEditModal } from './MoleculeEditModal';
import type { GroupWithMolecules, MoleculeWithFlags } from '@/types/app';

interface GroupMoleculePanelProps {
    group: GroupWithMolecules | null;
    open: boolean;
    onClose: () => void;
    isAdmin?: boolean;
    ingredientId?: string;
}

export function GroupMoleculePanel({ group, open, onClose, isAdmin = false, ingredientId }: GroupMoleculePanelProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [editingMolecule, setEditingMolecule] = useState<MoleculeWithFlags | null>(null);
    const queryClient = useQueryClient();

    // Remove molecule mutation
    const removeMutation = useMutation({
        mutationFn: (moleculeId: string) => {
            if (!ingredientId) throw new Error('No ingredient ID');
            return removeMoleculeFromIngredient(ingredientId, moleculeId);
        },
        onSuccess: () => {
            if (ingredientId) {
                queryClient.invalidateQueries({ queryKey: ['ingredient-profile', ingredientId] });
            }
        },
    });

    if (!group) return null;

    const content = (
        <Box sx={{ p: 3, minWidth: isMobile ? '100%' : 400, maxWidth: 600 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                    <Typography variant="h5" gutterBottom>
                        Gruppe {group.slot}: {group.name_de}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontStyle: 'italic', mb: 2 }}
                    >
                        {group.descriptor_de}
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Color indicator */}
            <Box
                sx={{
                    width: '100%',
                    height: 4,
                    backgroundColor: group.color_hex,
                    borderRadius: 1,
                    mb: 3,
                }}
            />

            {/* Molecules list header with add button */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                    Moleküle ({group.molecules.length})
                </Typography>
                {isAdmin && ingredientId && (
                    <Button
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => setShowSearchModal(true)}
                        variant="outlined"
                    >
                        Hinzufügen
                    </Button>
                )}
            </Box>

            {group.molecules.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                    Keine Moleküle für diesen Inhaltsstoff
                </Typography>
            ) : (
                <List>
                    {group.molecules.map((molecule) => (
                        <ListItem
                            key={molecule.id}
                            sx={{
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                py: 2,
                            }}
                        >
                            {/* Molecule name with key/tracked/trigeminal indicators */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                {molecule.is_key && (
                                    <Chip
                                        label="◆"
                                        size="small"
                                        sx={{
                                            backgroundColor: '#FFD700',
                                            color: '#000',
                                            fontWeight: 'bold',
                                            minWidth: 32,
                                        }}
                                    />
                                )}
                                {molecule.is_tracked && !molecule.is_key && (
                                    <Chip
                                        label="◦"
                                        size="small"
                                        variant="outlined"
                                        sx={{ minWidth: 32 }}
                                    />
                                )}
                                {molecule.has_trigeminal_activation && (
                                    <Chip
                                        label="T"
                                        size="small"
                                        sx={{
                                            backgroundColor: '#FF6B6B',
                                            color: '#fff',
                                            fontWeight: 'bold',
                                            minWidth: 32,
                                        }}
                                    />
                                )}
                                <Typography variant="subtitle1" fontWeight={600}>
                                    {molecule.name_de} {molecule.variation_label ? `(${molecule.variation_label})` : ''}
                                </Typography>
                            </Box>

                            {/* Aromatics/descriptors */}
                            <ListItemText
                                primary={
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Aromatik:</strong> {molecule.descriptors_de}
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        <strong>Löslichkeit:</strong> {molecule.solubility_de}
                                    </Typography>
                                }
                            />

                            {/* Admin actions */}
                            {isAdmin && ingredientId && (
                                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                    <Chip
                                        label="Bearbeiten"
                                        size="small"
                                        clickable
                                        onClick={() => setEditingMolecule(molecule)}
                                    />
                                    <Chip
                                        label="Entfernen"
                                        size="small"
                                        color="error"
                                        variant="outlined"
                                        clickable
                                        onClick={() => removeMutation.mutate(molecule.id)}
                                        disabled={removeMutation.isPending}
                                    />
                                </Box>
                            )}
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );

    return (
        <>
            <Drawer
                anchor={isMobile ? 'bottom' : 'right'}
                open={open}
                onClose={onClose}
                PaperProps={{
                    sx: {
                        maxHeight: isMobile ? '80vh' : '100vh',
                        backgroundColor: 'rgba(30, 41, 59, 0.8)',
                        backdropFilter: 'blur(16px)',
                        borderLeft: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                        borderTop: isMobile ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                        boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
                    },
                }}
            >
                {content}
            </Drawer>

            {/* Search and add molecule modal */}
            {showSearchModal && ingredientId && (
                <MoleculeSearchModal
                    open={showSearchModal}
                    onClose={() => setShowSearchModal(false)}
                    groupId={group.id}
                    groupName={group.name_de}
                    ingredientId={ingredientId}
                    existingMoleculeIds={group.molecules.map(m => m.id)}
                />
            )}

            {/* Edit Molecule Modal */}
            {editingMolecule && ingredientId && (
                <MoleculeEditModal
                    open={!!editingMolecule}
                    onClose={() => setEditingMolecule(null)}
                    ingredientId={ingredientId}
                    molecule={editingMolecule}
                />
            )}
        </>
    );
}
