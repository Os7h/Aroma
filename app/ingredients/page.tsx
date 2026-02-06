'use client';

import { useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    CircularProgress,
    Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';
import { useAllIngredients } from '@/lib/hooks/useIngredients';
import { IngredientCreateModal } from '@/components/ingredients/IngredientCreateModal';
import { useAdminStore } from '@/stores/useAdminStore';
import type { IngredientListItem } from '@/types/app';

export default function IngredientsPage() {
    const router = useRouter();
    const { data: ingredients, isLoading } = useAllIngredients();
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { isAdminMode } = useAdminStore();

    // Filter ingredients by search query
    const filteredIngredients: IngredientListItem[] = (ingredients || []).filter((ing) =>
        ing.name_de.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group by first letter
    const groupedIngredients = filteredIngredients.reduce((acc, ing) => {
        const firstLetter = ing.name_de[0]?.toUpperCase() || '#';
        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }
        acc[firstLetter].push(ing);
        return acc;
    }, {} as Record<string, IngredientListItem[]>);

    const sortedLetters = Object.keys(groupedIngredients).sort();

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            {/* Header */}
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography variant="h1" gutterBottom>
                    Aroma Explorer
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ opacity: 0.8, fontWeight: 400 }}>
                    Entdecken Sie die Wissenschaft der Aromen und Geschmacksprofile
                </Typography>
            </Box>

            {/* Search */}
            <Box sx={{ mb: 6 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Zutat suchen (z.B. Basilikum, Vanille...)"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: '16px',
                            transition: 'all 0.3s ease',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            '& fieldset': { border: 'none' },
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                            },
                            '&.Mui-focused': {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(99, 102, 241, 0.4)',
                                boxShadow: '0 0 20px rgba(99, 102, 241, 0.1)',
                            },
                        },
                    }}
                />
            </Box>

            {/* Admin Action */}
            {isAdminMode && (
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setShowCreateModal(true)}
                        sx={{
                            borderRadius: '12px',
                            background: 'linear-gradient(45deg, #6366f1, #ec4899)',
                            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                        }}
                    >
                        Neues Ingredient
                    </Button>
                </Box>
            )}

            {/* Loading state */}
            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress color="primary" />
                </Box>
            )}

            {/* Ingredients list */}
            {!isLoading && (
                <Box>
                    {sortedLetters.length === 0 ? (
                        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '24px' }}>
                            <Typography color="text.secondary">
                                Keine Zutaten gefunden
                            </Typography>
                        </Paper>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {sortedLetters.map((letter) => (
                                <Box key={letter}>
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            mb: 2,
                                            ml: 1,
                                            fontWeight: 800,
                                            color: 'primary.main',
                                            opacity: 0.9
                                        }}
                                    >
                                        {letter}
                                    </Typography>
                                    <Paper
                                        sx={{
                                            overflow: 'hidden',
                                            borderRadius: '24px',
                                            backgroundColor: 'rgba(30, 41, 59, 0.4)',
                                        }}
                                    >
                                        <List disablePadding>
                                            {groupedIngredients[letter].map((ingredient, index) => (
                                                <ListItemButton
                                                    key={ingredient.id}
                                                    onClick={() => router.push(`/ingredients/${ingredient.id}`)}
                                                    sx={{
                                                        py: 2,
                                                        px: 3,
                                                        borderBottom: index === groupedIngredients[letter].length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                                        },
                                                    }}
                                                >
                                                    <ListItemText
                                                        primary={ingredient.name_de}
                                                        primaryTypographyProps={{
                                                            variant: 'body1',
                                                            fontWeight: 500,
                                                            letterSpacing: '0.01em',
                                                        }}
                                                    />
                                                </ListItemButton>
                                            ))}
                                        </List>
                                    </Paper>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            )}

            {/* Results count */}
            {!isLoading && filteredIngredients.length > 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 4, textAlign: 'center', display: 'block', opacity: 0.6 }}>
                    {filteredIngredients.length} Zutat{filteredIngredients.length !== 1 ? 'en' : ''} gefunden
                </Typography>
            )}

            {/* Create Ingredient Modal */}
            <IngredientCreateModal
                open={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
        </Container>
    );
}
