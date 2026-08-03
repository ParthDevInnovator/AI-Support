'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OnboardingSchema, OnboardingInput } from '@repo/shared';
import { Loader2 } from 'lucide-react';

export default function OnboardingPage() {
    const router = useRouter();
    const { user, token, refreshToken, setAuth, isAuthenticated, _hasHydrated } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [errors, setErrors] = useState<{ orgName?: string; timezone?: string }>({});

    // Keep state
    const [orgName, setOrgName] = useState('');
    const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');

    useEffect(() => {
        if (!_hasHydrated) return; // wait for storage to hydrate
        if (!isAuthenticated) {
            router.push('/login');
        } else if (user?.orgId) {
            router.push('/dashboard');
        }
    }, [_hasHydrated, isAuthenticated, user?.orgId, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setServerError('');
        setIsLoading(true);

        const data: OnboardingInput = { orgName, timezone };

        try {
            // Validate locally using Zod
            OnboardingSchema.parse(data);

            // Call API
            const res = await api.post('/org/setup', data);

            // The backend returns new tokens because orgId changed
            const { organization, tokens } = res.data.data;

            if (user) {
                setAuth(
                    { ...user, orgId: organization.id },
                    tokens.accessToken,
                    tokens.refreshToken
                );
            }

            // Route to dashboard
            router.push('/dashboard');
        } catch (err: any) {
            if (err?.errors) {
                const zErrors: any = {};
                err.errors.forEach((e: any) => {
                    if (e.path[0]) zErrors[e.path[0] as string] = e.message;
                });
                setErrors(zErrors);
            } else if (err.response?.data?.error) {
                setServerError(err.response.data.error);
            } else {
                setServerError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!user || user.orgId) {
        return null;
    }

    return (
        <div className="w-full flex-col flex gap-8">
            <div>
                <h1 className="font-display text-4xl font-bold tracking-tight mb-2" style={{ color: '#F0ECE6' }}>
                    Welcome to Resolvo
                </h1>
                <p className="text-sm" style={{ color: '#8a7060' }}>
                    Let's set up your helpdesk workspace. You can invite your team later.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {serverError && (
                    <div className="p-3 rounded-lg text-sm bg-red-900/40 text-red-200 border border-red-900">
                        {serverError}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="orgName" style={{ color: '#F0ECE6' }}>Workspace Name</Label>
                    <Input
                        id="orgName"
                        type="text"
                        placeholder="e.g. Acme Corp"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        disabled={isLoading}
                        className="bg-[#2C3647] border-0 text-[#F0ECE6] focus-visible:ring-1 focus-visible:ring-[#EA610E]"
                    />
                    {errors.orgName && <p className="text-xs text-red-400">{errors.orgName}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="timezone" style={{ color: '#F0ECE6' }}>Timezone</Label>
                    <select
                        id="timezone"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        disabled={isLoading}
                        className="flex h-10 w-full rounded-md px-3 py-2 text-sm bg-[#2C3647] border-0 text-[#F0ECE6] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#EA610E]"
                    >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time (US & Canada)</option>
                        <option value="America/Chicago">Central Time (US & Canada)</option>
                        <option value="America/Denver">Mountain Time (US & Canada)</option>
                        <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                        <option value="Europe/London">London</option>
                        <option value="Europe/Berlin">Berlin</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                        <option value="Asia/Kolkata">India (IST)</option>
                        <option value="Australia/Sydney">Sydney</option>
                        {/* More timezones could be added, or use a timezone library */}
                    </select>
                    {errors.timezone && <p className="text-xs text-red-400">{errors.timezone}</p>}
                </div>

                <Button
                    type="submit"
                    className="mt-4 w-full h-11 text-base font-semibold"
                    style={{ backgroundColor: '#EA610E', color: '#190F0B' }}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Create Workspace'}
                </Button>
            </form>
        </div>
    );
}
