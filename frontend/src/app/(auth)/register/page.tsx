'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema, RegisterInput } from '@repo/shared';
import api from '@/lib/axios';
import { useAuthStore } from '@/store';
import { AlertCircle, Loader2 } from 'lucide-react';

function InputField({ id, label, type = 'text', placeholder, error, ...rest }: any) {
    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="text-sm font-medium" style={{ color: '#F0ECE6' }}>{label}</label>
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                style={{
                    backgroundColor: '#1f1209',
                    borderColor: error ? '#EA610E' : '#64290C',
                    color: '#F0ECE6',
                    outline: 'none',
                }}
                className="w-full h-11 px-4 rounded-xl border text-sm transition-all focus:border-[#EA610E] placeholder:text-[#5a4435]"
                {...rest}
            />
            {error && <p className="text-xs font-medium" style={{ color: '#EA610E' }}>{error}</p>}
        </div>
    );
}

export default function RegisterPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
        resolver: zodResolver(RegisterSchema),
    });

    const onSubmit = async (data: RegisterInput) => {
        try {
            setError(null);
            const res = await api.post('/auth/register', data);
            const { user, tokens } = res.data.data;
            setAuth(user, tokens.accessToken, tokens.refreshToken);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create account.');
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/auth/google`;
    };

    return (
        <div className="w-full">
            <div className="mb-8">
                <h2 className="font-display text-3xl font-bold tracking-tight mb-2" style={{ color: '#F0ECE6' }}>Create your account</h2>
                <p className="text-sm" style={{ color: '#8a7060' }}>Set up your Resolvo workspace in under 2 minutes.</p>
            </div>

            {error && (
                <div className="mb-5 p-3.5 rounded-xl flex items-start gap-2.5 text-sm" style={{ backgroundColor: 'rgba(234,97,14,0.1)', border: '1px solid #EA610E' }}>
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#EA610E' }} />
                    <span style={{ color: '#F0ECE6' }}>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <InputField id="firstName" label="First name" placeholder="Jane" error={errors.firstName?.message} {...register('firstName')} />
                    <InputField id="lastName" label="Last name" placeholder="Doe" error={errors.lastName?.message} {...register('lastName')} />
                </div>
                <InputField id="orgName" label="Organization name" placeholder="Acme Corp" error={errors.orgName?.message} {...register('orgName')} />
                <InputField id="email" label="Work email" type="email" placeholder="jane@company.com" error={errors.email?.message} {...register('email')} />
                <InputField id="password" label="Password" type="password" placeholder="Min 8 characters" error={errors.password?.message} {...register('password')} />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{ backgroundColor: '#EA610E' }}
                    className="w-full h-11 mt-2 rounded-xl font-semibold text-white text-sm hover:opacity-90 transition-all shadow-lg shadow-orange-900/40 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                    {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating workspace...</> : 'Create Resolvo workspace'}
                </button>
            </form>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" style={{ borderColor: '#64290C' }} />
                </div>
                <div className="relative flex justify-center">
                    <span className="px-3 text-xs uppercase tracking-widest" style={{ backgroundColor: '#190F0B', color: '#8a7060' }}>or</span>
                </div>
            </div>

            <button
                onClick={handleGoogleLogin}
                type="button"
                style={{ backgroundColor: '#1f1209', borderColor: '#64290C', color: '#F0ECE6' }}
                className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border text-sm font-medium hover:border-[#EA610E] transition-all"
            >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Sign up with Google
            </button>

            <p className="mt-8 text-center text-sm" style={{ color: '#8a7060' }}>
                Already have an account?{' '}
                <Link href="/login" className="font-semibold hover:opacity-80 transition-opacity" style={{ color: '#EA610E' }}>
                    Sign in
                </Link>
            </p>

            <p className="mt-4 text-center text-xs" style={{ color: '#64290C' }}>
                By creating an account, you agree to our{' '}
                <a href="#" className="hover:text-[#EA610E] transition-colors">Terms</a> &amp;{' '}
                <a href="#" className="hover:text-[#EA610E] transition-colors">Privacy Policy</a>.
            </p>
        </div>
    );
}
