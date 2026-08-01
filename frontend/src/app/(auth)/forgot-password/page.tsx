'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ForgotPasswordSchema, ForgotPasswordInput } from '@repo/shared';
import api from '@/lib/axios';
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(ForgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordInput) => {
        try {
            setError(null);
            await api.post('/auth/forgot-password', data);
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Something went wrong.');
        }
    };

    if (success) {
        return (
            <div className="w-full text-center">
                <div className="flex justify-center mb-6">
                    <CheckCircle2 className="w-16 h-16" style={{ color: '#EA610E' }} />
                </div>
                <h2 className="font-display text-3xl font-bold mb-4" style={{ color: '#F0ECE6' }}>Check your inbox</h2>
                <p className="text-sm mb-10" style={{ color: '#8a7060' }}>
                    We sent a password reset link to your email. It expires in 15 minutes.
                </p>
                <Link href="/login">
                    <button style={{ backgroundColor: '#EA610E' }} className="w-full h-11 rounded-xl font-semibold text-white text-sm hover:opacity-90 transition-all shadow-lg shadow-orange-900/40">
                        Back to sign in
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-8">
                <h2 className="font-display text-3xl font-bold tracking-tight mb-2" style={{ color: '#F0ECE6' }}>Reset your password</h2>
                <p className="text-sm" style={{ color: '#8a7060' }}>
                    We'll email you a secure link to reset your Resolvo password.
                </p>
            </div>

            {error && (
                <div className="mb-5 p-3.5 rounded-xl flex items-start gap-2.5 text-sm" style={{ backgroundColor: 'rgba(234,97,14,0.1)', border: '1px solid #EA610E' }}>
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#EA610E' }} />
                    <span style={{ color: '#F0ECE6' }}>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                    <label htmlFor="email" className="text-sm font-medium" style={{ color: '#F0ECE6' }}>Email address</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        style={{ backgroundColor: '#1f1209', borderColor: errors.email ? '#EA610E' : '#64290C', color: '#F0ECE6', outline: 'none' }}
                        className="w-full h-11 px-4 rounded-xl border text-sm focus:border-[#EA610E] placeholder:text-[#5a4435] transition-all"
                        {...register('email')}
                    />
                    {errors.email && <p className="text-xs font-medium" style={{ color: '#EA610E' }}>{errors.email.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{ backgroundColor: '#EA610E' }}
                    className="w-full h-11 mt-2 rounded-xl font-semibold text-white text-sm hover:opacity-90 transition-all shadow-lg shadow-orange-900/40 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                    {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : 'Send reset link'}
                </button>
            </form>

            <p className="mt-8 text-center text-sm" style={{ color: '#8a7060' }}>
                Remember your password?{' '}
                <Link href="/login" className="font-semibold hover:opacity-80 transition-opacity" style={{ color: '#EA610E' }}>
                    Back to sign in
                </Link>
            </p>
        </div>
    );
}
