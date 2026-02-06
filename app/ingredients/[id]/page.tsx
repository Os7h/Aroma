'use client';

import { useState, use } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    IconButton,
    CircularProgress,
    Alert,
    Divider,
    Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/navigation';
import { AromaCircleGrid9 } from '@/components/circles/AromaCircleGrid9';
import { GroupMoleculePanel } from '@/components/molecules/GroupMoleculePanel';
import { FlavorMatchesList } from '@/components/matches/FlavorMatchesList';
import { TemperatureBands } from '@/components/temperature/TemperatureBands';
import { TasteProfileDisplay } from '@/components/taste/TasteProfileDisplay';
import { IngredientEditModal } from '@/components/ingredients/IngredientEditModal';
import { useIngredientProfile, useIngredientMatches, useAllGroups } from '@/lib/hooks/useIngredients';
import { useAdminStore } from '@/stores/useAdminStore';
import type { GroupWithMolecules } from '@/types/app';

export default function IngredientProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [selectedGroup, setSelectedGroup] = useState<GroupWithMolecules | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const { isAdminMode } = useAdminStore();

    // Unwrap params using React.use()
    const { id } = use(params);

    const { data: profile, isLoading: profileLoading, error: profileError } = useIngredientProfile(id);
    const { data: matches, isLoading: matchesLoading } = useIngredientMatches(id);
    const { data: allGroups } = useAllGroups();

    const isLoading = profileLoading || matchesLoading;

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (profileError || !profile) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">
                    Fehler beim Laden des Inhaltsstoffs. Bitte versuchen Sie es erneut.
                </Alert>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => router.push('/ingredients')}
                    sx={{ mt: 2 }}
                >
                    Zurück zur Liste
                </Button>
            </Container>
        );
    }

    // Get slots with molecules
    const slotsWithMolecules = profile.groups
        .filter(g => g.molecules.length > 0)
        .map(g => g.slot);

    // Check if any molecule from groups 1-8 has trigeminal activation
    const hasTrigeminalActivation = profile.groups
        .filter(g => g.slot >= 1 && g.slot <= 8) // Only groups 1-8
        .some(g => g.molecules.some(m => m.has_trigeminal_activation));

    // Auto-activate group 9 if trigeminal molecules exist in groups 1-8
    const activeSlots = hasTrigeminalActivation && !slotsWithMolecules.includes(9)
        ? [...slotsWithMolecules, 9]
        : slotsWithMolecules;

    // Handle circle click
    const handleCircleClick = (slot: number) => {
        const group = profile.groups.find(g => g.slot === slot);
        if (group) {
            // Allow opening if group has molecules OR if admin mode is active
            if (group.molecules.length > 0 || isAdminMode) {
                setSelectedGroup(group);
            }
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <IconButton
                        onClick={() => router.push('/ingredients')}
                        size="large"
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(8px)',
                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Box>
                        <Typography variant="h2" component="h1" sx={{ fontWeight: 800 }}>
                            {profile.ingredient.name_de}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" sx={{ opacity: 0.7 }}>
                            Profil & Aromenentfaltung
                        </Typography>
                    </Box>
                </Box>
                {isAdminMode && (
                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => setShowEditModal(true)}
                        sx={{
                            borderRadius: '12px',
                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                            color: 'primary.light',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                            '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.2)' }
                        }}
                    >
                        Name bearbeiten
                    </Button>
                )}
            </Box>

            {/* Main Content Grid */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

                {/* ROW 1: Aromagruppen */}
                <Paper sx={{ p: 5, borderRadius: '24px' }}>
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: 4, color: 'primary.main', opacity: 0.8 }}>
                            AROMAGRUPPEN
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, opacity: 0.6 }}>
                            Klicken Sie auf einen Kreis, um die Moleküle zu explorieren
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <AromaCircleGrid9
                            groups={profile.groups}
                            activeSlots={activeSlots}
                            onCircleClick={handleCircleClick}
                        />
                    </Box>
                </Paper>

                {/* ROW 2: Taste and Temperature (Side by Side on Large screens) */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 4 }}>
                    <Paper sx={{ p: 4, borderRadius: '24px', height: '100%' }}>
                        <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: 4, color: 'primary.main', mb: 3, display: 'block' }}>
                            GESCHMACKSPROFIL
                        </Typography>
                        <TasteProfileDisplay
                            profile={{
                                sweet: profile.ingredient.taste_sweet,
                                sour: profile.ingredient.taste_sour,
                                salty: profile.ingredient.taste_salty,
                                bitter: profile.ingredient.taste_bitter,
                                umami: profile.ingredient.taste_umami,
                            }}
                            description={profile.ingredient.taste_description_de}
                            isAdmin={isAdminMode}
                            ingredientId={id}
                            ingredientName={profile.ingredient.name_de}
                        />
                    </Paper>

                    <Paper sx={{ p: 4, borderRadius: '24px', height: '100%' }}>
                        <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: 4, color: 'primary.main', mb: 3, display: 'block' }}>
                            TEMPERATUR-BANDS
                        </Typography>
                        <TemperatureBands
                            groups={profile.groups}
                            ingredientId={id}
                            ingredientName={profile.ingredient.name_de}
                            isAdmin={isAdminMode}
                        />
                    </Paper>
                </Box>

                {/* ROW 3: Flavor Matches */}
                <Paper sx={{ p: 5, borderRadius: '24px' }}>
                    <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: 4, color: 'primary.main', mb: 4, display: 'block' }}>
                        FLAVOR MATCHES
                    </Typography>
                    <FlavorMatchesList
                        matches={matches || []}
                        groups={allGroups || []}
                    />
                </Paper>
            </Box>

            {/* Back button at bottom */}
            <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="text"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => router.push('/ingredients')}
                    sx={{
                        color: 'text.secondary',
                        opacity: 0.6,
                        '&:hover': { opacity: 1, backgroundColor: 'transparent' }
                    }}
                >
                    Zurück zur Liste
                </Button>
            </Box>

            {/* Group Details Panel (Drawer) */}
            <GroupMoleculePanel
                group={selectedGroup}
                open={!!selectedGroup}
                onClose={() => setSelectedGroup(null)}
                isAdmin={isAdminMode}
                ingredientId={id}
            />

            {/* Edit Ingredient Name Modal */}
            {showEditModal && (
                <IngredientEditModal
                    open={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    ingredientId={id}
                    currentName={profile.ingredient.name_de}
                />
            )}
        </Container>
    );
}
