'use client';

import { Box, Tooltip } from '@mui/material';

interface AromaCircleProps {
    slot: number; // 1-9
    name: string;
    descriptor: string;
    color: string;
    isActive: boolean;
    size?: 'small' | 'medium';
    onClick?: () => void;
}

export function AromaCircle({
    slot,
    name,
    descriptor,
    color,
    isActive,
    size = 'medium',
    onClick
}: AromaCircleProps) {
    const isSmall = size === 'small';
    const circleSize = isSmall ? 32 : 80;
    const fontSize = isSmall ? '0.875rem' : '1.5rem';
    const borderWidth = isSmall ? 2 : 3;

    return (
        <Tooltip title={isActive ? `${name} - ${descriptor}` : name} arrow disableInteractive>
            <Box
                onClick={onClick}
                sx={{
                    width: circleSize,
                    height: circleSize,
                    borderRadius: '50%',
                    backgroundColor: isActive ? `${color}dd` : 'rgba(255, 255, 255, 0.03)',
                    border: `${borderWidth}px solid ${color}`,
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: onClick ? 'pointer' : 'default',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    opacity: isActive ? 1 : 0.2,
                    boxShadow: isActive ? `0 0 15px ${color}40` : 'none',
                    '&:hover': onClick ? {
                        transform: 'scale(1.15)',
                        opacity: 1,
                        boxShadow: `0 0 25px ${color}60`,
                        backgroundColor: isActive ? color : 'rgba(255, 255, 255, 0.1)',
                    } : {},
                }}
                aria-label={`Gruppe ${slot}: ${name}`}
            >
                {!isSmall && (
                    <Box
                        sx={{
                            fontSize: fontSize,
                            fontWeight: 800,
                            color: isActive ? 'white' : color,
                            textShadow: isActive ? '0 2px 4px rgba(0,0,0,0.3)' : 'none',
                        }}
                    >
                        {slot}
                    </Box>
                )}
            </Box>
        </Tooltip>
    );
}
