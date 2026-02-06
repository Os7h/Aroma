'use client';

import { Box } from '@mui/material';
import { AromaCircle } from './AromaCircle';
import type { AromaGroup } from '@/types/app';

interface MiniCircleStrip9Props {
    groups: AromaGroup[]; // All 9 groups
    activeSlots: number[]; // Active slots for this ingredient
}

export function MiniCircleStrip9({ groups, activeSlots }: MiniCircleStrip9Props) {
    const sortedGroups = [...groups].sort((a, b) => a.slot - b.slot);

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 0.75,
                alignItems: 'center',
            }}
        >
            {sortedGroups.map((group) => {
                const isActive = activeSlots.includes(group.slot);

                return (
                    <AromaCircle
                        key={group.id}
                        slot={group.slot}
                        name={group.name_de}
                        descriptor={group.descriptor_de}
                        color={group.color_hex}
                        isActive={isActive}
                        size="small"
                    />
                );
            })}
        </Box>
    );
}
