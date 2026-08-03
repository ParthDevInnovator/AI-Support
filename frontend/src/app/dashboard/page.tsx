'use client';

import AuthGuard from '@/components/auth-guard';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
    const { user, logout } = useAuthStore();

    return (
        <AuthGuard>
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
                <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
                <p className="mb-8">Welcome, {user?.email}. Your workspace is ready!</p>

                <Button onClick={logout} variant="outline">
                    Sign Out
                </Button>
            </div>
        </AuthGuard>
    );
}
