'use client';

import { Box } from '@mui/material';
import { AromaCircle } from './AromaCircle';
import type { AromaGroup } from '@/types/app';

interface AromaCircleGrid9Props {
    groups: AromaGroup[]; // All 9 groups
    activeSlots: number[]; // Which slots are active (have molecules)
    onCircleClick?: (slot: number) => void;
}

export function AromaCircleGrid9({ groups, activeSlots, onCircleClick }: AromaCircleGrid9Props) {
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: 'repeat(3, 1fr)',
                    sm: 'repeat(3, 1fr)',
                    md: 'repeat(9, 1fr)',
                },
                gap: { xs: 2, md: 3 },
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                maxWidth: '1000px',
                mx: 'auto',
            }}
        >
            {groups.map((group) => (
                <Box key={group.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <AromaCircle
                        slot={group.slot}
                        name={group.name_de}
                        descriptor={group.descriptor_de}
                        color={group.color_hex}
                        isActive={activeSlots.includes(group.slot)}
                        onClick={onCircleClick ? () => onCircleClick(group.slot) : undefined}
                    />
                </Box>
            ))}
        </Box>
    );
}
