'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAdminStore } from '@/stores/useAdminStore'

export default function DebugAuth() {
    const [authInfo, setAuthInfo] = useState<any>({ status: 'init' })
    const { isAdminMode } = useAdminStore()
    const supabase = createClient()

    useEffect(() => {
        const check = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            let profile = null
            let error = null

            if (user) {
                const res = await supabase.from('profiles').select('*').eq('id', user.id).single()
                profile = res.data
                error = res.error
            }

            setAuthInfo({
                userId: user?.id,
                email: user?.email,
                profileData: profile,
                profileError: error,
                timestamp: new Date().toISOString()
            })
        }

        check()
        const timer = setInterval(check, 5000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div style={{
            position: 'fixed',
            bottom: 10,
            left: 10,
            zIndex: 99999,
            background: 'black',
            color: 'lime',
            border: '2px solid red',
            padding: '10px',
            fontSize: '12px',
            maxWidth: '300px',
            opacity: 0.9
        }}>
            <h3 style={{ margin: 0, borderBottom: '1px solid white' }}>DEBUG AUTH</h3>
            <div>Store isAdmin: {String(isAdminMode)}</div>
            <div>Auth ID: {authInfo.userId?.slice(0, 8) || 'NONE'}</div>
            <div>Email: {authInfo.email}</div>
            <div>Profile Role: {authInfo.profileData?.role || 'N/A'}</div>
            {authInfo.profileError && (
                <div style={{ color: 'red' }}>Error: {JSON.stringify(authInfo.profileError)}</div>
            )}
            <div>Time: {authInfo.timestamp}</div>
        </div>
    )
}
