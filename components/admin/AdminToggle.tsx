'use client';

import { Box, Switch, FormControlLabel, Paper } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAdminStore } from '@/stores/useAdminStore';

export function AdminToggle() {
    const { isAdminMode, toggleAdminMode } = useAdminStore();

    return (
        <Paper
            elevation={3}
            sx={{
                position: 'fixed',
                top: 16,
                right: 16,
                zIndex: 1000,
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                backgroundColor: isAdminMode ? 'primary.main' : 'background.paper',
                color: isAdminMode ? 'primary.contrastText' : 'text.primary',
                transition: 'all 0.3s ease',
            }}
        >
            <AdminPanelSettingsIcon />
            <FormControlLabel
                control={
                    <Switch
                        checked={isAdminMode}
                        onChange={toggleAdminMode}
                        color={isAdminMode ? 'default' : 'primary'}
                    />
                }
                label={isAdminMode ? 'Admin Mode' : 'Lesemodus'}
            />
        </Paper>
    );
}
