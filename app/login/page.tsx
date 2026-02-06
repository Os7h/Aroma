'use client';

import { Suspense, useState, useEffect } from 'react';
import {
    Container,
    Typography,
    TextField,
    Box,
    Paper,
    Button,
    Alert,
    CircularProgress
} from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { login, signup } from './actions';

function LoginForm() {
    const searchParams = useSearchParams();
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const msg = searchParams.get('message');
        const err = searchParams.get('error');
        if (msg) setMessage(msg);
        if (err) setError(err);
    }, [searchParams]);

    return (
        <Paper
            elevation={0}
            sx={{
                p: 4,
                borderRadius: '24px',
                backgroundColor: 'rgba(30, 41, 59, 0.4)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                width: '100%',
                maxWidth: '400px',
            }}
        >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary">
                    {mode === 'login' ? 'Willkommen' : 'Konto erstellen'}
                </Typography>
                <Typography color="text.secondary">
                    {mode === 'login'
                        ? 'Melde dich an, um Aromen zu verwalten'
                        : 'Registriere dich für vollen Zugriff'}
                </Typography>
            </Box>

            {message && (
                <Alert severity="info" sx={{ mb: 3, borderRadius: '12px' }}>
                    {message}
                </Alert>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                    {error}
                </Alert>
            )}

            {/* ROBUST FORM: Uses key={mode} to force fresh instance on switch */}
            <form key={mode} action={mode === 'login' ? login : signup}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        fullWidth
                        required
                        autoComplete="email"
                        variant="outlined"
                        InputProps={{
                            sx: {
                                borderRadius: '12px',
                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                color: 'white',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'primary.main',
                                },
                            }
                        }}
                        InputLabelProps={{
                            sx: { color: 'rgba(255, 255, 255, 0.7)' }
                        }}
                    />
                    <TextField
                        label="Passwort"
                        name="password"
                        type="password"
                        fullWidth
                        required
                        autoComplete={mode === 'login' ? "current-password" : "new-password"}
                        variant="outlined"
                        InputProps={{
                            sx: {
                                borderRadius: '12px',
                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                color: 'white',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'primary.main',
                                },
                            }
                        }}
                        InputLabelProps={{
                            sx: { color: 'rgba(255, 255, 255, 0.7)' }
                        }}
                    />

                    <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        size="large"
                        sx={{
                            mt: 2,
                            borderRadius: '12px',
                            background: 'linear-gradient(45deg, #6366f1, #ec4899)',
                            height: '48px',
                            fontWeight: 'bold',
                            fontSize: '1.1rem'
                        }}
                    >
                        {mode === 'login' ? 'Anmelden' : 'Registrieren'}
                    </Button>

                    <Box sx={{ textAlign: 'center', mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            {mode === 'login' ? 'Noch kein Konto?' : 'Bereits registriert?'}
                            <Button
                                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                sx={{
                                    ml: 1,
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    color: 'primary.main'
                                }}
                            >
                                {mode === 'login' ? 'Jetzt registrieren' : 'Jetzt anmelden'}
                            </Button>
                        </Typography>
                    </Box>
                </Box>
            </form>
        </Paper>
    );
}

export default function LoginPage() {
    return (
        <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh' }}>
            <Suspense fallback={<CircularProgress />}>
                <LoginForm />
            </Suspense>
        </Container>
    );
}
