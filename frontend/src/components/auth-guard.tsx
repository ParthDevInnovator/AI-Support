'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const _hasHydrated = useAuthStore((state) => state._hasHydrated);

    useEffect(() => {
        if (!_hasHydrated) return; // Wait for hydration before executing redirect logic

        if (!isAuthenticated) {
            router.push('/login');
        } else if (user && !user.orgId && !window.location.pathname.startsWith('/onboarding')) {
            router.push('/onboarding');
        } else if (user && user.orgId && window.location.pathname.startsWith('/onboarding')) {
            router.push('/dashboard');
        }
    }, [_hasHydrated, isAuthenticated, user, router]);

    if (!_hasHydrated || !isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return <>{children}</>;
}
