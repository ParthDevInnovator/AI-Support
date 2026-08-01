'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetPasswordSchema, ResetPasswordInput } from '@repo/shared';
import api from '@/lib/axios';
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordInput>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: { token: token || '' },
    });

    const onSubmit = async (data: ResetPasswordInput) => {
        try {
            setError(null);
            await api.post('/auth/reset-password', data);
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Invalid or expired token.');
        }
    };

    if (!token) {
        return (
            <div className="w-full text-center">
                <div className="mb-6 p-4 rounded-xl flex items-start gap-3 text-sm" style={{ backgroundColor: 'rgba(234,97,14,0.1)', border: '1px solid #EA610E' }}>
                    <AlertCircle className="w-5 h-5 shrink-0" style={{ color: '#EA610E' }} />
                    <span style={{ color: '#F0ECE6' }}>Missing or invalid reset token. Please use the link sent to your email.</span>
                </div>
                <Link href="/forgot-password">
                    <button style={{ backgroundColor: '#EA610E' }} className="w-full h-11 rounded-xl font-semibold text-white text-sm hover:opacity-90 transition-all shadow-lg shadow-orange-900/40">
                        Request new link
                    </button>
                </Link>
            </div>
        );
    }

    if (success) {
        return (
            <div className="w-full text-center">
                <CheckCircle2 className="w-16 h-16 mx-auto mb-6" style={{ color: '#EA610E' }} />
                <h2 className="font-display text-3xl font-bold mb-4" style={{ color: '#F0ECE6' }}>Password updated!</h2>
                <p className="text-sm mb-10" style={{ color: '#8a7060' }}>Your Resolvo password has been reset. Sign in to continue.</p>
                <Link href="/login">
                    <button style={{ backgroundColor: '#EA610E' }} className="w-full h-11 rounded-xl font-semibold text-white text-sm hover:opacity-90 transition-all shadow-lg shadow-orange-900/40">
                        Sign in to Resolvo
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-8">
                <h2 className="font-display text-3xl font-bold tracking-tight mb-2" style={{ color: '#F0ECE6' }}>Set new password</h2>
                <p className="text-sm" style={{ color: '#8a7060' }}>Choose a strong password for your Resolvo account.</p>
            </div>

            {error && (
                <div className="mb-5 p-3.5 rounded-xl flex items-start gap-2.5 text-sm" style={{ backgroundColor: 'rgba(234,97,14,0.1)', border: '1px solid #EA610E' }}>
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#EA610E' }} />
                    <span style={{ color: '#F0ECE6' }}>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input type="hidden" {...register('token')} />

                {[
                    { id: 'password', label: 'New password', key: 'password' as keyof ResetPasswordInput },
                    { id: 'confirmPassword', label: 'Confirm password', key: 'confirmPassword' as keyof ResetPasswordInput },
                ].map(({ id, label, key }) => (
                    <div key={id} className="space-y-1.5">
                        <label htmlFor={id} className="text-sm font-medium" style={{ color: '#F0ECE6' }}>{label}</label>
                        <input
                            id={id}
                            type="password"
                            placeholder="••••••••"
                            style={{ backgroundColor: '#1f1209', borderColor: errors[key] ? '#EA610E' : '#64290C', color: '#F0ECE6', outline: 'none' }}
                            className="w-full h-11 px-4 rounded-xl border text-sm focus:border-[#EA610E] placeholder:text-[#5a4435] transition-all"
                            {...register(key)}
                        />
                        {errors[key] && <p className="text-xs font-medium" style={{ color: '#EA610E' }}>{errors[key]?.message}</p>}
                    </div>
                ))}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{ backgroundColor: '#EA610E' }}
                    className="w-full h-11 mt-2 rounded-xl font-semibold text-white text-sm hover:opacity-90 transition-all shadow-lg shadow-orange-900/40 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                    {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save new password'}
                </button>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center">
                <Loader2 className="animate-spin w-8 h-8" style={{ color: '#EA610E' }} />
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
