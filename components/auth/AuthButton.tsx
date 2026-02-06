'use client'

import { useEffect, useState } from 'react'
import { Button, Paper, Typography, Box } from '@mui/material'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAdminStore } from '@/stores/useAdminStore'
import { logout } from '@/app/login/actions'

export function AuthButton() {
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname() // Hook to track navigation
    const { setAdminMode } = useAdminStore()
    const supabase = createClient()

    useEffect(() => {
        let mounted = true;

        const checkUserRole = async (userId: string, retryCount = 0) => {
            // console.log("Checking role for user:", userId, "Attempt:", retryCount + 1)
            try {
                // Explicitly cast or handle potential type mismatch if needed,
                // but standard select usually works if database.types.ts is correct.
                // If 'role' is missing in types, we might need to update the interface manually or cast.
                // For now, assuming standard query is robust.
                const { data, error } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', userId)
                    .single()

                const profile = data as any // FIX: Bypass missing type definition

                // console.log("Role check result:", data, error)

                if (error && retryCount < 3 && mounted) {
                    // console.log("Retrying role check in 1s...")
                    setTimeout(() => checkUserRole(userId, retryCount + 1), 1000)
                    return
                }

                if (mounted) {
                    if (profile && profile.role === 'admin') {
                        setAdminMode(true)
                    } else {
                        setAdminMode(false)
                    }
                }
            } catch (e) {
                console.error("Role check failed", e)
            }
        }

        const initAuth = async () => {
            try {
                // 1. Get current session
                const { data: { session } } = await supabase.auth.getSession()
                // console.log("Initial Session:", session?.user?.email)

                if (mounted) {
                    if (session?.user) {
                        setUserEmail(session.user.email ?? null)
                        await checkUserRole(session.user.id)
                    } else {
                        // console.log("No session found (init)")
                        setUserEmail(null)
                        setAdminMode(false)
                    }
                }
            } catch (e) {
                console.error("Auth check failed", e)
            } finally {
                if (mounted) setIsLoading(false)
            }
        }

        initAuth()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            // console.log("Auth Event:", event)
            if (mounted) {
                if (session?.user) {
                    setUserEmail(session.user.email ?? null)
                    // If we just signed in, force a check
                    await checkUserRole(session.user.id)
                } else {
                    // console.log("No session (event)")
                    setUserEmail(null)
                    setAdminMode(false)
                }
                setIsLoading(false)
            }
        })

        return () => {
            mounted = false;
            subscription.unsubscribe()
        }
    }, [supabase, setAdminMode, pathname]) // Added pathname to dependencies

    const handleLogin = () => {
        router.push('/login')
    }

    const handleLogout = async () => {
        // Optimistic UI clear
        setAdminMode(false)
        setUserEmail(null)
        setIsLoading(true)

        // Client-side Logout (Reliable)
        await supabase.auth.signOut()

        // Refresh to clear server caches/cookies
        router.refresh()
        router.push('/login')
    }

    // Loading Placeholder
    if (isLoading) {
        return (
            <Paper
                elevation={3}
                sx={{
                    position: 'fixed',
                    top: 16,
                    right: 16,
                    zIndex: 1000,
                    p: 1.5,
                    width: '130px',
                    height: '50px',
                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                    borderRadius: '16px',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            />
        )
    }

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
                gap: 2,
                borderRadius: '16px',
                backdropFilter: 'blur(8px)',
                backgroundColor: 'rgba(30, 41, 59, 0.8)', // Fixed duplicate key
                border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
        >
            {userEmail ? (
                <>
                    <Typography variant="body2" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
                        {userEmail}
                    </Typography>
                    <Button
                        size="small"
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                        color="inherit"
                        sx={{ textTransform: 'none' }}
                    >
                        Abmelden
                    </Button>
                </>
            ) : (
                <Button
                    size="small"
                    startIcon={<LoginIcon />}
                    onClick={handleLogin}
                    variant="contained"
                    sx={{
                        borderRadius: '8px',
                        background: 'linear-gradient(45deg, #6366f1, #ec4899)',
                        textTransform: 'none',
                        fontWeight: 'bold'
                    }}
                >
                    Anmelden
                </Button>
            )}
        </Paper>
    )
}
