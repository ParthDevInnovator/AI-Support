import Link from 'next/link';

function ResolvoLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' };
    return (
        <Link href="/" className="flex items-center gap-2 group">
            <div
                style={{ backgroundColor: '#2C3647' }}
                className={`${sizes[size]} rounded-xl flex items-center justify-center shrink-0 shadow-lg`}
            >
                <span className="font-display font-black text-[#EA610E]">R</span>
            </div>
            <span className="font-display font-bold text-xl" style={{ color: '#F0ECE6' }}>
                Resolvo
            </span>
        </Link>
    );
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ backgroundColor: '#190F0B', color: '#F0ECE6' }} className="min-h-screen flex font-sans">

            {/* ── Left decorative panel ──────────────────────────── */}
            <div
                style={{ borderRight: '1px solid #64290C' }}
                className="hidden lg:flex w-[48%] xl:w-[44%] p-14 flex-col justify-between relative overflow-hidden"
            >
                {/* Glow blobs */}
                <div className="absolute top-[-5%] left-[-10%] w-80 h-80 rounded-full blur-[130px] opacity-30 float-anim" style={{ backgroundColor: '#EA610E' }} />
                <div className="absolute bottom-[-5%] right-[-10%] w-72 h-72 rounded-full blur-[120px] opacity-20 float-anim-delay" style={{ backgroundColor: '#64290C' }} />

                {/* Logo */}
                <div className="relative z-10">
                    <ResolvoLogo />
                </div>

                {/* Hero copy */}
                <div className="relative z-10">
                    <p className="text-xs uppercase tracking-widest font-semibold mb-5" style={{ color: '#EA610E' }}>
                        AI-Powered Helpdesk
                    </p>
                    <h1 className="font-display text-4xl xl:text-5xl font-bold leading-tight mb-6" style={{ color: '#F0ECE6' }}>
                        Resolve tickets<br />before agents even<br />
                        <span className="shimmer-text">open their inbox.</span>
                    </h1>
                    <p className="text-base leading-relaxed max-w-sm" style={{ color: '#8a7060' }}>
                        Resolvo uses AI to classify, route and draft replies for every support message. Built for speed-obsessed teams.
                    </p>

                    {/* Mini social proof */}
                    <div className="mt-10 flex flex-col gap-4">
                        {[
                            { val: '78%', label: 'Faster resolution time' },
                            { val: '3.2×', label: 'Higher agent throughput' },
                            { val: '94%', label: 'CSAT satisfaction score' },
                        ].map((s) => (
                            <div key={s.label} style={{ borderColor: '#64290C' }} className="flex items-center gap-4 py-3 border-b last:border-0">
                                <span className="font-display text-2xl font-bold" style={{ color: '#EA610E' }}>{s.val}</span>
                                <span className="text-sm" style={{ color: '#8a7060' }}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative z-10 text-xs" style={{ color: '#64290C' }}>
                    © {new Date().getFullYear()} Resolvo Inc. All rights reserved.
                </p>
            </div>

            {/* ── Right form panel ──────────────────────────────── */}
            <div className="flex-1 flex flex-col p-6 sm:p-10">
                {/* Mobile logo */}
                <div className="lg:hidden mb-8">
                    <ResolvoLogo />
                </div>

                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-[440px]">
                        {children}
                    </div>
                </div>
            </div>

        </div>
    );
}
