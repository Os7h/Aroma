'use client';

import { Box, Typography, Card, CardContent, CardActionArea } from '@mui/material';
import { useRouter } from 'next/navigation';
import { MiniCircleStrip9 } from '@/components/circles/MiniCircleStrip9';
import type { FlavorMatch, AromaGroup } from '@/types/app';

interface FlavorMatchesListProps {
    matches: FlavorMatch[];
    groups: AromaGroup[];
    isAdmin?: boolean;
}

export function FlavorMatchesList({ matches, groups, isAdmin = false }: FlavorMatchesListProps) {
    const router = useRouter();

    if (matches.length === 0) {
        return (
            <Box sx={{ py: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    Keine Flavor Matches definiert
                </Typography>
                {isAdmin && (
                    <Typography variant="caption" color="text.secondary">
                        Klicken Sie auf "+ Match hinzufügen" um einen neuen Match zu erstellen
                    </Typography>
                )}
            </Box>
        );
    }

    return (
        <Box sx={{ py: 2 }}>
            <Typography variant="h6" gutterBottom>
                Flavor Matches ({matches.length})
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
                {matches.map((match) => (
                    <Card
                        key={match.id}
                        variant="outlined"
                        sx={{
                            '&:hover': {
                                boxShadow: 2,
                                borderColor: 'primary.main',
                            },
                        }}
                    >
                        <CardActionArea
                            onClick={() => router.push(`/ingredients/${match.target_ingredient.id}`)}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {/* Mini circle strip */}
                                    <MiniCircleStrip9
                                        groups={groups}
                                        activeSlots={match.target_active_slots}
                                    />

                                    {/* Arrow */}
                                    <Typography variant="h6" color="text.secondary">
                                        →
                                    </Typography>

                                    {/* Ingredient name */}
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        {match.target_ingredient.name_de}
                                    </Typography>
                                </Box>

                                {/* Optional note */}
                                {match.note && (
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ mt: 1, display: 'block', fontStyle: 'italic' }}
                                    >
                                        {match.note}
                                    </Typography>
                                )}
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}
            </Box>
        </Box>
    );
}
