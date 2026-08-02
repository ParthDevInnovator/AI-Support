'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

/* ── Logos for social proof marquee ── */
const logos = ['Stripe', 'Linear', 'Vercel', 'Notion', 'Figma', 'Loom', 'Intercom', 'Hubspot', 'Zendesk', 'Twilio'];

/* ── Features bento config ── */
const bentoFeatures = [
  {
    span: 'bento-wide bento-tall',
    icon: '⚡',
    title: 'Instant AI Triage',
    desc: 'Every ticket is classified, tagged with sentiment, and routed to the perfect agent in under 200ms — before a human even notices it arrived.',
    accent: true,
  },
  {
    span: 'bento-wide',
    icon: '🔍',
    title: 'Sentiment Detection',
    desc: 'Predict churn before it happens. Our model flags at-risk conversations with 94% accuracy.',
    accent: false,
  },
  {
    span: 'bento-wide',
    icon: '🤖',
    title: 'AI Reply Drafts',
    desc: 'One-click suggested responses trained on your knowledge base and brand voice.',
    accent: false,
  },
  {
    span: 'bento-3',
    icon: '📊',
    title: 'Live Analytics Dashboard',
    desc: 'Real-time CSAT, ticket backlog, resolution speed, and agent leaderboard — all on one screen.',
    accent: false,
  },
  {
    span: 'bento-wide bento-tall',
    icon: '🛡️',
    title: 'Enterprise Security',
    desc: 'SOC 2 compliance, end-to-end encryption, SSO, RBAC and complete audit logs. Your data never leaves.',
    accent: false,
  },
  {
    span: 'bento-wide',
    icon: '🔗',
    title: 'Plug-and-play Integrations',
    desc: 'Email, Slack, HubSpot, Jira, Zendesk and more. Live in minutes, not weeks.',
    accent: false,
  },
];

const steps = [
  {
    num: '01',
    title: 'Connect your inbox',
    desc: 'Plug in email, Slack, or any existing helpdesk. Takes under 5 minutes.',
  },
  {
    num: '02',
    title: 'AI learns your workflow',
    desc: 'Resolvo reads your historical tickets and learns how your team triages and responds.',
  },
  {
    num: '03',
    title: 'Watch tickets vanish',
    desc: 'Sit back as AI routes, drafts replies, and resolves repetitive issues automatically.',
  },
];

const testimonials = [
  {
    quote: "Resolvo cut our ticket backlog in half within the first week. The AI routing is eerily accurate.",
    name: "Sarah Chen",
    role: "Head of CX · Stripe",
    avatar: 'SC',
  },
  {
    quote: "Finally, a helpdesk that gets smarter every day. Our agents love the one-click AI reply drafts.",
    name: "Marcus Okafor",
    role: "VP Support · Linear",
    avatar: 'MO',
  },
  {
    quote: "We handle 10k tickets/month with a lean team. Resolvo makes it feel effortless.",
    name: "Priya Nair",
    role: "Operations Lead · Vercel",
    avatar: 'PN',
  },
];

const stats = [
  { value: '78%', label: 'Faster resolution', sub: 'vs. traditional helpdesk' },
  { value: '3.2×', label: 'Agent throughput', sub: 'more tickets per hour' },
  { value: '94%', label: 'CSAT score', sub: 'across 2,000+ teams' },
  { value: '<2m', label: 'First response', sub: 'average time' },
];

const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: '/mo',
    desc: 'Perfect for small support teams.',
    cta: 'Start free',
    features: ['3 agents', '500 tickets/mo', 'AI triage & routing', 'Email channel', 'Community support'],
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/mo',
    desc: 'For growing teams that need more AI.',
    cta: 'Start 14-day trial',
    features: ['20 agents', 'Unlimited tickets', 'AI reply drafts', 'All channels', 'Priority support', 'Advanced analytics'],
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'Advanced AI + dedicated support.',
    cta: 'Talk to sales',
    features: ['Unlimited agents', 'Custom AI models', 'SLA guarantees', 'SSO / SAML', 'Dedicated CSM', 'On-prem option'],
    highlight: false,
  },
];

export default function LandingPage() {
  /* Scroll reveal effect */
  const revealRef = useRef<NodeListOf<Element> | null>(null);
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    revealRef.current = els;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ backgroundColor: '#190F0B' }} className="min-h-screen overflow-x-hidden">

      {/* ── NAV ──────────────────────────────────────── */}
      <nav style={{ borderBottom: '1px solid rgba(100,41,12,0.6)' }} className="fixed top-0 inset-x-0 z-50 backdrop-blur-2xl bg-[#190F0B]/75">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div style={{ backgroundColor: '#2C3647' }} className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg">
              <span className="font-display font-black text-base" style={{ color: '#EA610E' }}>R</span>
            </div>
            <span className="font-display font-bold text-xl" style={{ color: '#F0ECE6' }}>Resolvo</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How it works', 'Pricing', 'Blog'].map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`} style={{ color: '#7a6050' }}
                className="text-sm font-medium hover:text-[#F0ECE6] transition-colors">
                {l}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" style={{ color: '#7a6050' }} className="text-sm font-medium hover:text-[#F0ECE6] transition-colors hidden sm:block">
              Sign in
            </Link>
            <Link href="/register"
              className="btn-glow text-sm font-semibold px-5 py-2.5 rounded-xl text-white">
              Get started free →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="mesh-hero dot-grid relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-32 overflow-hidden">
        {/* Floating blobs */}
        <div className="float-anim absolute top-20 left-[12%] w-72 h-72 rounded-full blur-[140px] opacity-20" style={{ backgroundColor: '#EA610E' }} />
        <div className="float-delay absolute bottom-20 right-[12%] w-80 h-80 rounded-full blur-[150px] opacity-15" style={{ backgroundColor: '#64290C' }} />
        <div className="float-delay2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[200px] opacity-8" style={{ backgroundColor: '#EA610E' }} />

        {/* Badge */}
        <div className="fade-up relative z-10 mb-8">
          <span style={{ borderColor: '#64290C', color: '#EA610E', backgroundColor: 'rgba(234,97,14,0.08)' }}
            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA610E] animate-pulse" />
            Intelligent · Real-time · Free to start
          </span>
        </div>

        {/* Headline */}
        <h1 className="fade-up delay-1 relative z-10 font-display text-6xl sm:text-7xl md:text-[88px] font-black leading-[1.0] tracking-tight mb-7 text-balance">
          <span style={{ color: '#F0ECE6' }}>Your support team's<br /></span>
          <span className="shimmer-text">unfair advantage.</span>
        </h1>

        <p className="fade-up delay-2 relative z-10 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed" style={{ color: '#7a6050' }}>
          Resolvo uses AI to classify, route, and draft responses for every support ticket — before your agents finish their morning coffee.
        </p>

        {/* CTAs */}
        <div className="fade-up delay-3 relative z-10 flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Link href="/register" className="btn-glow text-base font-bold px-9 py-4 rounded-2xl text-white flex items-center gap-2 justify-center">
            Start for free — no card needed
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <a href="#how-it-works" style={{ borderColor: '#64290C', color: '#F0ECE6' }}
            className="text-base font-semibold px-9 py-4 rounded-2xl border hover:border-[#EA610E] hover:text-[#EA610E] transition-all flex items-center gap-2 justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Watch 2-min demo
          </a>
        </div>
        <p className="fade-up delay-4 relative z-10 text-xs" style={{ color: '#64290C' }}>
          Free forever plan · No credit card · Cancel anytime
        </p>

        {/* Dashboard mockup */}
        <div className="fade-up delay-5 relative z-10 mt-20 w-full max-w-5xl mx-auto float-anim">
          <div className="glass-card rounded-3xl overflow-hidden shadow-2xl" style={{ boxShadow: '0 40px 120px rgba(234,97,14,0.15), 0 0 0 1px #64290C' }}>
            {/* Browser chrome */}
            <div style={{ backgroundColor: '#1d1108', borderBottom: '1px solid #64290C' }} className="flex items-center gap-3 px-5 py-3.5">
              <div className="flex gap-1.5">
                {['#ff5f57', '#febc2e', '#28c840'].map((c) => <div key={c} style={{ backgroundColor: c }} className="w-3 h-3 rounded-full opacity-80" />)}
              </div>
              <div style={{ backgroundColor: '#190F0B', borderColor: '#64290C', color: '#7a6050' }} className="flex-1 mx-4 text-xs rounded-lg px-4 py-1.5 border text-center">
                app.resolvo.ai — Dashboard
              </div>
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => <div key={i} style={{ backgroundColor: '#64290C' }} className="w-6 h-1.5 rounded-full opacity-60" />)}
              </div>
            </div>

            {/* Sidebar + Content */}
            <div className="flex" style={{ minHeight: '340px' }}>
              {/* Sidebar */}
              <div style={{ backgroundColor: '#190F0B', borderRight: '1px solid #64290C', width: '200px' }} className="hidden sm:flex flex-col p-4 gap-1 shrink-0">
                {['Dashboard', 'Tickets', 'Analytics', 'Agents', 'Settings'].map((item, i) => (
                  <div key={item} style={{
                    backgroundColor: i === 1 ? 'rgba(234,97,14,0.15)' : 'transparent',
                    color: i === 1 ? '#EA610E' : '#7a6050',
                    borderRadius: '8px',
                  }} className="px-3 py-2 text-xs font-medium cursor-pointer hover:text-[#F0ECE6] transition-colors">
                    {item}
                  </div>
                ))}
                <div className="mt-auto pt-4" style={{ borderTop: '1px solid #64290C' }}>
                  <div className="flex items-center gap-2 px-2">
                    <div style={{ backgroundColor: '#EA610E' }} className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold">J</div>
                    <div>
                      <div className="text-xs font-medium" style={{ color: '#F0ECE6' }}>Jane D.</div>
                      <div className="text-[10px]" style={{ color: '#64290C' }}>Admin</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main area */}
              <div className="flex-1 p-5 overflow-auto">
                {/* Stats row */}
                <div className="grid grid-cols-4 gap-3 mb-5">
                  {[
                    { label: 'Open', val: '24', color: '#EA610E' },
                    { label: 'Resolved', val: '189', color: '#22c55e' },
                    { label: 'AI Handled', val: '71%', color: '#3b82f6' },
                    { label: 'Avg. Time', val: '1.8m', color: '#a855f7' },
                  ].map((s) => (
                    <div key={s.label} style={{ backgroundColor: '#190F0B', borderColor: '#64290C' }} className="rounded-xl p-3 border">
                      <div className="text-xs mb-1" style={{ color: '#7a6050' }}>{s.label}</div>
                      <div className="font-display text-xl font-bold" style={{ color: s.color }}>{s.val}</div>
                    </div>
                  ))}
                </div>

                {/* Ticket list */}
                <div className="space-y-2">
                  {[
                    { id: '#4021', subj: 'Payment failed for renewal — urgent refund request', priority: 'critical', status: 'AI Routed', badge: 'bg-red-500/20 text-red-400' },
                    { id: '#4020', subj: 'Slack integration not syncing messages', priority: 'high', status: 'Draft Ready', badge: 'bg-orange-500/20 text-orange-400' },
                    { id: '#4019', subj: 'Need bulk export to CSV with custom fields', priority: 'low', status: 'Triaged', badge: 'bg-blue-500/20 text-blue-400' },
                    { id: '#4018', subj: 'Safari dashboard blank on load', priority: 'high', status: 'AI Replied', badge: 'bg-orange-500/20 text-orange-400' },
                    { id: '#4017', subj: 'Invoice amount mismatch for June billing cycle', priority: 'medium', status: 'Pending', badge: 'bg-yellow-500/20 text-yellow-400' },
                  ].map((t) => (
                    <div key={t.id} className="ticket-card rounded-xl flex items-center gap-3 px-4 py-3">
                      <div className="w-14 text-[10px] font-mono shrink-0" style={{ color: '#64290C' }}>{t.id}</div>
                      <div className="flex-1 text-xs font-medium truncate" style={{ color: '#F0ECE6' }}>{t.subj}</div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${t.badge}`}>{t.priority}</span>
                      <span className="text-[10px] shrink-0 hidden md:block" style={{ color: '#7a6050' }}>{t.status}</span>
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: '#EA610E', opacity: 0.6 }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Glow under the dashboard */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-12 blur-2xl rounded-full opacity-30" style={{ backgroundColor: '#EA610E' }} />
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────── */}
      <div style={{ borderTop: '1px solid #64290C', borderBottom: '1px solid #64290C', backgroundColor: '#1d1108' }} className="py-5 overflow-hidden">
        <div className="flex gap-0">
          <div className="marquee-track whitespace-nowrap">
            {[...logos, ...logos].map((l, i) => (
              <span key={i} className="inline-flex items-center gap-3 mx-8 text-sm font-semibold" style={{ color: '#7a6050' }}>
                <span style={{ color: '#EA610E' }}>✦</span>
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS ────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={s.label} className={`reveal glass-card rounded-2xl p-8 text-center`} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="font-display text-5xl font-black mb-2" style={{ color: '#EA610E' }}>{s.value}</div>
              <div className="text-sm font-semibold mb-1" style={{ color: '#F0ECE6' }}>{s.label}</div>
              <div className="text-xs" style={{ color: '#7a6050' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES BENTO ───────────────────────────── */}
      <section id="features" className="py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span style={{ color: '#EA610E' }} className="text-xs uppercase tracking-widest font-semibold">Features</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black mt-3 mb-4" style={{ color: '#F0ECE6' }}>
              Everything you need.<br />
              <span className="gradient-heading">Nothing you don't.</span>
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: '#7a6050' }}>
              Built from the ground up for AI-first support teams.
            </p>
          </div>

          <div className="bento-grid reveal">
            {bentoFeatures.map((f) => (
              <div key={f.title} style={{
                background: f.accent ? 'linear-gradient(135deg, rgba(234,97,14,0.2) 0%, rgba(29,17,8,0.9) 60%)' : 'rgba(29,17,8,0.8)',
                border: `1px solid ${f.accent ? 'rgba(234,97,14,0.4)' : '#64290C'}`,
                backdropFilter: 'blur(20px)',
                boxShadow: f.accent ? '0 0 60px rgba(234,97,14,0.12) inset' : 'none',
              }} className={`${f.span} glass-card rounded-2xl p-7 flex flex-col`}>
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-display text-lg font-bold mb-3" style={{ color: '#F0ECE6' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed flex-1" style={{ color: '#7a6050' }}>{f.desc}</p>
                {f.accent && (
                  <div className="mt-6">
                    <Link href="/register" style={{ color: '#EA610E' }} className="text-sm font-semibold flex items-center gap-1.5 hover:gap-3 transition-all">
                      Get started free
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section id="how-it-works" style={{ borderTop: '1px solid #64290C' }} className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20 reveal">
            <span style={{ color: '#EA610E' }} className="text-xs uppercase tracking-widest font-semibold">How it works</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black mt-3" style={{ color: '#F0ECE6' }}>
              Live in 3 steps.
            </h2>
          </div>
          <div className="relative">
            {/* Vertical connector line */}
            <div className="absolute left-[28px] top-8 bottom-8 w-px hidden md:block" style={{ background: 'linear-gradient(180deg, #EA610E, #64290C)' }} />
            <div className="space-y-8">
              {steps.map((s, i) => (
                <div key={s.num} className="reveal flex items-start gap-8">
                  <div className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center font-display font-black text-xl" style={{ backgroundColor: 'rgba(234,97,14,0.15)', border: '1px solid #EA610E', color: '#EA610E' }}>
                    {s.num}
                  </div>
                  <div className="glass-card flex-1 rounded-2xl p-7">
                    <h3 className="font-display text-xl font-bold mb-3" style={{ color: '#F0ECE6' }}>{s.title}</h3>
                    <p className="text-base leading-relaxed" style={{ color: '#7a6050' }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────── */}
      <section style={{ borderTop: '1px solid #64290C' }} className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span style={{ color: '#EA610E' }} className="text-xs uppercase tracking-widest font-semibold">Wall of love</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black mt-3" style={{ color: '#F0ECE6' }}>
              Teams that trust Resolvo.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={t.name} className="reveal glass-card rounded-2xl p-8 flex flex-col" style={{ animationDelay: `${i * 0.12}s` }}>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => <span key={j} style={{ color: '#EA610E' }}>★</span>)}
                </div>
                <p className="text-base leading-relaxed flex-1 mb-8 italic" style={{ color: '#8a7060' }}>"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div style={{ backgroundColor: 'rgba(234,97,14,0.2)', border: '1px solid #EA610E', color: '#EA610E' }} className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-display">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: '#F0ECE6' }}>{t.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#64290C' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────── */}
      <section id="pricing" style={{ borderTop: '1px solid #64290C' }} className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span style={{ color: '#EA610E' }} className="text-xs uppercase tracking-widest font-semibold">Pricing</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black mt-3 mb-3" style={{ color: '#F0ECE6' }}>
              Simple. Transparent. Fair.
            </h2>
            <p style={{ color: '#7a6050' }}>No hidden fees. Upgrade or cancel anytime.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {plans.map((p, i) => (
              <div key={p.name} className={`reveal flex flex-col rounded-3xl p-8 ${p.highlight ? 'scale-[1.04]' : ''}`} style={{
                border: `1px solid ${p.highlight ? '#EA610E' : '#64290C'}`,
                background: p.highlight ? 'linear-gradient(160deg, #2a1208, #1d1108)' : 'rgba(29,17,8,0.7)',
                backdropFilter: 'blur(16px)',
                boxShadow: p.highlight ? '0 0 80px rgba(234,97,14,0.18), 0 0 0 1px rgba(234,97,14,0.3)' : 'none',
                animationDelay: `${i * 0.1}s`,
              }}>
                {p.highlight && (
                  <div className="mb-5 -mt-2">
                    <span style={{ backgroundColor: '#EA610E' }} className="text-white text-xs font-bold px-3 py-1 rounded-full">
                      ✦ Most Popular
                    </span>
                  </div>
                )}
                <div className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: '#EA610E' }}>{p.name}</div>
                <div className="flex items-end gap-1 mb-1">
                  <span className="font-display text-5xl font-black" style={{ color: '#F0ECE6' }}>{p.price}</span>
                  <span className="text-sm pb-2" style={{ color: '#7a6050' }}>{p.period}</span>
                </div>
                <p className="text-sm mb-7" style={{ color: '#7a6050' }}>{p.desc}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: '#F0ECE6' }}>
                      <span style={{ color: '#EA610E' }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register"
                  className={`block text-center py-3.5 rounded-xl font-semibold text-sm transition-all ${p.highlight ? 'btn-glow text-white' : 'border hover:border-[#EA610E] hover:text-[#EA610E]'}`}
                  style={{ borderColor: p.highlight ? 'transparent' : '#64290C', color: p.highlight ? 'white' : '#F0ECE6' }}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BIG CTA ──────────────────────────────────── */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[600px] h-[600px] rounded-full blur-[180px] opacity-15" style={{ backgroundColor: '#EA610E' }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center reveal">
          <p style={{ color: '#EA610E' }} className="text-xs uppercase tracking-widest font-semibold mb-4">Join 2,000+ teams</p>
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight" style={{ color: '#F0ECE6' }}>
            Ready to resolve<br />
            <span className="shimmer-text">tickets at AI speed?</span>
          </h2>
          <p className="text-lg mb-12 max-w-xl mx-auto" style={{ color: '#7a6050' }}>
            Set up Resolvo in 5 minutes. No engineers needed. Begin triaging smarter today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-glow text-lg font-bold px-12 py-5 rounded-2xl text-white flex items-center justify-center gap-2">
              Get started — it's free
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link href="/login" style={{ borderColor: '#64290C', color: '#F0ECE6' }} className="text-lg font-semibold px-12 py-5 rounded-2xl border hover:border-[#EA610E] transition-all flex items-center justify-center">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid #64290C', backgroundColor: '#1d1108' }} className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
            <Link href="/" className="flex items-center gap-2.5">
              <div style={{ backgroundColor: '#2C3647' }} className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg">
                <span className="font-display font-black text-base" style={{ color: '#EA610E' }}>R</span>
              </div>
              <span className="font-display font-bold text-xl" style={{ color: '#F0ECE6' }}>Resolvo</span>
            </Link>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
              {['Product', 'Pricing', 'Docs', 'Blog', 'Changelog', 'Status', 'Privacy', 'Terms'].map((l) => (
                <a key={l} href="#" style={{ color: '#7a6050' }} className="text-xs hover:text-[#EA610E] transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid #64290C' }} className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs" style={{ color: '#64290C' }}>© {new Date().getFullYear()} Resolvo Inc. All rights reserved.</p>
            <p className="text-xs" style={{ color: '#64290C' }}>Made with ❤️ for support teams worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
