'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginInput } from '@repo/shared';
import api from '@/lib/axios';
import { useAuthStore } from '@/store';
import { AlertCircle, Loader2 } from 'lucide-react';

import { InputField } from '@/components/ui/input-field';

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" style={{ color: '#EA610E' }} /></div>}>
            <LoginForm />
        </Suspense>
    );
}

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [error, setError] = useState<string | null>(null);

    // Capture OAuth tokens from URL after Google redirect
    useEffect(() => {
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');

        if (accessToken && refreshToken) {
            // Store tokens and redirect to dashboard
            setAuth(null, accessToken, refreshToken);
            router.push('/dashboard');
        }
    }, [searchParams, setAuth, router]);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
        resolver: zodResolver(LoginSchema),
    });

    const onSubmit = async (data: LoginInput) => {
        try {
            setError(null);
            const res = await api.post('/auth/login', data);
            const { user, tokens } = res.data.data;
            setAuth(user, tokens.accessToken, tokens.refreshToken);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to sign in. Please check your credentials.');
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/google`;
    };

    return (
        <div className="w-full">
            <div className="mb-8">
                <h2 className="font-display text-3xl font-bold tracking-tight mb-2" style={{ color: '#F0ECE6' }}>Welcome back</h2>
                <p className="text-sm" style={{ color: '#8a7060' }}>Sign in to your Resolvo account.</p>
            </div>

            {/* Google OAuth */}
            <button
                onClick={handleGoogleLogin}
                type="button"
                style={{ backgroundColor: '#1f1209', borderColor: '#64290C', color: '#F0ECE6' }}
                className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border text-sm font-medium hover:border-[#EA610E] transition-all mb-6"
            >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
            </button>

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" style={{ borderColor: '#64290C' }} />
                </div>
                <div className="relative flex justify-center">
                    <span className="px-3 text-xs uppercase tracking-widest" style={{ backgroundColor: '#190F0B', color: '#8a7060' }}>or</span>
                </div>
            </div>

            {error && (
                <div className="mb-5 p-3.5 rounded-xl flex items-start gap-2.5 text-sm" style={{ backgroundColor: 'rgba(234,97,14,0.1)', borderColor: '#EA610E', border: '1px solid' }}>
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#EA610E' }} />
                    <span style={{ color: '#F0ECE6' }}>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <InputField
                    id="email"
                    label="Email address"
                    type="email"
                    placeholder="you@company.com"
                    error={errors.email?.message}
                    {...register('email')}
                />
                <InputField
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    error={errors.password?.message}
                    rightSlot={
                        <Link href="/forgot-password" className="text-xs font-medium hover:opacity-80 transition-opacity" style={{ color: '#EA610E' }}>
                            Forgot password?
                        </Link>
                    }
                    {...register('password')}
                />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{ backgroundColor: '#EA610E' }}
                    className="w-full h-11 mt-2 rounded-xl font-semibold text-white text-sm hover:opacity-90 transition-all shadow-lg shadow-orange-900/40 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                    {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : 'Sign in to Resolvo'}
                </button>
            </form>

            <p className="mt-8 text-center text-sm" style={{ color: '#8a7060' }}>
                Don't have an account?{' '}
                <Link href="/register" className="font-semibold hover:opacity-80 transition-opacity" style={{ color: '#EA610E' }}>
                    Create account
                </Link>
            </p>
        </div>
    );
}
