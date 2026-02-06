import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import { AuthButton } from '@/components/auth/AuthButton';
import DebugAuth from '@/components/DebugAuth'; // Added import
import './globals.css';

export const metadata: Metadata = {
    title: 'Aroma Explorer - Circles',
    description: 'Explore aroma groups and flavor profiles',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="de">
            <body className="antialiased">
                <Providers>
                    <AuthButton />
                    {children}
                </Providers>
            </body>
        </html>
    );
}
