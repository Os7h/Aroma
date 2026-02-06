'use client';

import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { TasteEditModal } from './TasteEditModal';

interface TasteProfile {
    sweet?: number;
    sour?: number;
    salty?: number;
    bitter?: number;
    umami?: number;
}

interface TasteProfileDisplayProps {
    profile: TasteProfile;
    description?: string;
    isAdmin?: boolean;
    ingredientId?: string;
    ingredientName?: string;
}

const TASTE_CONFIG = [
    { key: 'sweet', label: 'Süß', color: '#EC4899' },      // Pink-500 (más distintivo)
    { key: 'sour', label: 'Sauer', color: '#EAB308' },     // Yellow-500 (más brillante)
    { key: 'salty', label: 'Salzig', color: '#06B6D4' },   // Cyan-500 (más claro)
    { key: 'bitter', label: 'Bitter', color: '#78716C' },  // Stone-500 (gris neutro)
    { key: 'umami', label: 'Umami', color: '#F97316' },    // Orange-500 (más vibrante)
] as const;

export function TasteProfileDisplay({ profile, description, isAdmin = false, ingredientId, ingredientName }: TasteProfileDisplayProps) {
    const [showEditModal, setShowEditModal] = useState(false);

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                    Geschmack
                </Typography>
                {isAdmin && ingredientId && ingredientName && (
                    <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => setShowEditModal(true)}
                        variant="outlined"
                    >
                        Bearbeiten
                    </Button>
                )}
            </Box>

            {/* Description text */}
            {description ? (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontStyle: 'italic' }}>
                    {description}
                </Typography>
            ) : isAdmin ? (
                <Typography variant="body2" color="text.disabled" sx={{ mb: 3, fontStyle: 'italic' }}>
                    Keine Beschreibung. Klicken Sie auf "Bearbeiten", um eine hinzuzufügen.
                </Typography>
            ) : null}

            {/* Compact horizontal display */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {TASTE_CONFIG.map(({ key, label, color }) => {
                    const value = profile[key as keyof TasteProfile] || 0;
                    const isActive = value > 0;

                    return (
                        <Box
                            key={key}
                            sx={{
                                flex: '1 1 160px',
                                minWidth: 160,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 0.5,
                            }}
                        >
                            {/* Label above */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontWeight: 600,
                                        color: isActive ? color : 'text.secondary',
                                    }}
                                >
                                    {label}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 700,
                                        color: isActive ? color : 'text.disabled',
                                    }}
                                >
                                    {value > 0 ? value : '—'}
                                </Typography>
                            </Box>

                            {/* Visual bar */}
                            <Box
                                sx={{
                                    height: 12,
                                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: 6,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        bottom: 0,
                                        width: `${(value / 3) * 100}%`,
                                        bgcolor: color,
                                        boxShadow: `0 0 10px ${color}60`,
                                        borderRadius: 6,
                                        transition: 'width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                    }}
                                />
                            </Box>
                        </Box>
                    );
                })}
            </Box>

            {/* Edit Modal */}
            {isAdmin && ingredientId && ingredientName && showEditModal && (
                <TasteEditModal
                    open={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    ingredientId={ingredientId}
                    ingredientName={ingredientName}
                    currentProfile={profile}
                    currentDescription={description}
                />
            )}
        </Box>
    );
}
