import Link from 'next/link';

const features = [
  {
    icon: '⚡',
    title: 'Instant AI Triage',
    desc: 'Incoming tickets are classified, tagged, and routed to the right agent in milliseconds — not minutes.',
  },
  {
    icon: '🔍',
    title: 'Smart Sentiment Analysis',
    desc: 'Detect customer frustration before it escalates. AI flags at-risk tickets so your team responds first.',
  },
  {
    icon: '🤖',
    title: 'AI-Assisted Replies',
    desc: 'One-click suggested responses drawn from your knowledge base, trained on your unique tone of voice.',
  },
  {
    icon: '📊',
    title: 'Real-time Analytics',
    desc: 'Live dashboards for ticket volume, resolution time, CSAT scores, and agent performance — all in one view.',
  },
  {
    icon: '🔗',
    title: 'Seamless Integrations',
    desc: 'Connect to email, Slack, HubSpot, Jira and more. Drop Resolvo into your workflow in minutes.',
  },
  {
    icon: '🛡️',
    title: 'Enterprise Security',
    desc: 'SOC 2 ready, end-to-end encryption, RBAC, and full audit logs so your data stays yours.',
  },
];

const stats = [
  { value: '78%', label: 'Faster resolution time' },
  { value: '3.2×', label: 'Higher agent throughput' },
  { value: '94%', label: 'Customer satisfaction' },
  { value: '<2min', label: 'Average first response' },
];

const testimonials = [
  {
    quote: "Resolvo cut our ticket backlog in half within the first week. The AI routing is eerily accurate.",
    name: "Sarah Chen",
    role: "Head of CX, Stripe",
  },
  {
    quote: "Finally, a helpdesk that actually gets smarter over time. Our agents love the AI reply suggestions.",
    name: "Marcus Okafor",
    role: "VP Support, Linear",
  },
  {
    quote: "We handle 10k+ tickets/month with a lean team. Resolvo makes it feel effortless.",
    name: "Priya Nair",
    role: "Operations Lead, Vercel",
  },
];

const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: '/mo',
    desc: 'Perfect for small teams getting started.',
    features: ['Up to 3 agents', '500 tickets/month', 'AI triage & classification', 'Email integration', 'Community support'],
    cta: 'Get started free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/mo',
    desc: 'For growing teams that need more power.',
    features: ['Up to 20 agents', 'Unlimited tickets', 'AI reply suggestions', 'All integrations', 'Priority support', 'Analytics dashboard'],
    cta: 'Start free trial',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For large orgs with advanced needs.',
    features: ['Unlimited agents', 'Custom AI models', 'SLA guarantees', 'SSO / SAML', 'Dedicated CSM', 'On-prem option'],
    cta: 'Contact sales',
    highlight: false,
  },
];

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: '#190F0B', color: '#F0ECE6' }} className="min-h-screen font-sans overflow-x-hidden">

      {/* ─── NAV ─────────────────────────────────────────── */}
      <nav style={{ borderBottom: '1px solid #64290C' }} className="sticky top-0 z-50 backdrop-blur-xl bg-[#190F0B]/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div style={{ backgroundColor: '#2C3647' }} className="w-8 h-8 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#F0ECE6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-display font-bold text-lg" style={{ color: '#F0ECE6' }}>Resolvo<span style={{ color: '#EA610E' }}> AI</span></span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Pricing', 'Docs', 'Blog'].map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} style={{ color: '#8a7060' }} className="text-sm font-medium hover:text-[#F0ECE6] transition-colors">
                {link}
              </a>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <Link href="/login" style={{ color: '#F0ECE6' }} className="text-sm font-medium hover:text-[#EA610E] transition-colors hidden sm:block">
              Sign in
            </Link>
            <Link href="/register" style={{ backgroundColor: '#EA610E', color: '#F0ECE6' }} className="text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-all shadow-lg shadow-orange-900/40">
              Get started free →
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[140px] opacity-25 float-anim" style={{ backgroundColor: '#EA610E' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[120px] opacity-20 float-anim-delay" style={{ backgroundColor: '#64290C' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[200px] opacity-10" style={{ backgroundColor: '#EA610E' }} />

        {/* Badge */}
        <div className="fade-in relative z-10 mb-8">
          <span style={{ borderColor: '#64290C', color: '#EA610E', backgroundColor: 'rgba(234,97,14,0.08)' }}
            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full border uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA610E] animate-pulse" />
            AI-Powered · Real-time · Forever Free to Start
          </span>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl font-bold leading-[1.05] tracking-tight mb-8 fade-in fade-delay-1">
            Your support team's<br />
            <span className="shimmer-text">secret weapon</span>
          </h1>

          <p className="fade-in fade-delay-2 text-lg sm:text-xl max-w-2xl mx-auto mb-12" style={{ color: '#8a7060', lineHeight: '1.7' }}>
            Resolvo classifies, routes, and resolves customer tickets before your agents even open their laptops. Reduce response time by 78% — guaranteed.
          </p>

          <div className="fade-in fade-delay-3 flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/register" style={{ backgroundColor: '#EA610E' }} className="px-8 py-4 rounded-xl font-semibold text-white text-base hover:opacity-90 transition-all shadow-xl shadow-orange-900/40 flex items-center justify-center gap-2">
              Start for free — no card needed
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a href="#features" style={{ borderColor: '#64290C', color: '#F0ECE6' }} className="px-8 py-4 rounded-xl font-semibold text-base border hover:border-[#EA610E] hover:text-[#EA610E] transition-all flex items-center justify-center gap-2">
              See how it works
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </a>
          </div>

          {/* Dashboard Preview */}
          <div className="fade-in fade-delay-4 relative mx-auto max-w-4xl gradient-border rounded-2xl overflow-hidden float-anim" style={{ backgroundColor: '#1f1209' }}>
            <div style={{ borderBottom: '1px solid #64290C' }} className="flex items-center gap-2 px-5 py-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div style={{ backgroundColor: '#190F0B', borderColor: '#64290C' }} className="flex-1 mx-4 rounded-md px-3 py-1.5 text-xs border text-center" style={{ color: '#8a7060' }}>
                app.Resolvo.ai/dashboard
              </div>
            </div>
            {/* Fake Ticket rows */}
            <div className="p-6 space-y-3">
              {[
                { id: '#3012', subj: 'Payment failed for subscription renewal', priority: 'critical', status: 'Escalated', time: '0m ago' },
                { id: '#3011', subj: 'Unable to connect Slack integration', priority: 'high', status: 'In Progress', time: '3m ago' },
                { id: '#3010', subj: 'Feature request: bulk export to CSV', priority: 'low', status: 'Triaged', time: '7m ago' },
                { id: '#3009', subj: 'Billing invoice discrepancy for June', priority: 'medium', status: 'AI Replied', time: '12m ago' },
                { id: '#3008', subj: 'Dashboard not loading on Safari', priority: 'high', status: 'Open', time: '18m ago' },
              ].map((t) => (
                <div key={t.id} style={{ backgroundColor: '#190F0B', borderColor: '#64290C' }} className="flex items-center gap-4 p-4 rounded-xl border hover:border-[#EA610E]/40 transition-all group cursor-pointer">
                  <span className="text-xs font-mono" style={{ color: '#8a7060' }}>{t.id}</span>
                  <span className="flex-1 text-sm font-medium truncate" style={{ color: '#F0ECE6' }}>{t.subj}</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${t.priority === 'critical' ? 'bg-red-500/20 text-red-400' : t.priority === 'high' ? 'bg-orange-500/20 text-orange-400' : t.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                    {t.priority}
                  </span>
                  <span className="text-xs" style={{ color: '#8a7060' }}>{t.status}</span>
                  <span className="text-xs" style={{ color: '#64290C' }}>{t.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ────────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid #64290C', borderBottom: '1px solid #64290C' }} className="py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-5xl font-bold mb-2" style={{ color: '#EA610E' }}>{s.value}</div>
              <div className="text-sm" style={{ color: '#8a7060' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ────────────────────────────────────── */}
      <section id="features" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: '#EA610E' }}>Why Resolvo</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6" style={{ color: '#F0ECE6' }}>
              Built for speed.<br />Designed for delight.
            </h2>
            <p className="text-base max-w-2xl mx-auto" style={{ color: '#8a7060' }}>
              Every feature is crafted to eliminate the manual grunt work from your support workflow.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} style={{ backgroundColor: '#1f1209', borderColor: '#64290C' }} className="group p-7 rounded-2xl border hover:border-[#EA610E] transition-all duration-300 cursor-default hover:shadow-lg hover:shadow-orange-900/20">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-display text-base font-semibold mb-3" style={{ color: '#F0ECE6' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#8a7060' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ────────────────────────────────── */}
      <section style={{ borderTop: '1px solid #64290C' }} className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: '#EA610E' }}>Loved by teams worldwide</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold" style={{ color: '#F0ECE6' }}>Don't take our word for it</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} style={{ backgroundColor: '#1f1209', borderColor: '#64290C' }} className="p-7 rounded-2xl border hover:border-[#EA610E] transition-all duration-300">
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => <span key={i} style={{ color: '#EA610E' }}>★</span>)}
                </div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#8a7060' }}>"{t.quote}"</p>
                <div>
                  <div className="text-sm font-semibold" style={{ color: '#F0ECE6' }}>{t.name}</div>
                  <div className="text-xs mt-1" style={{ color: '#64290C' }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─────────────────────────────────────── */}
      <section id="pricing" style={{ borderTop: '1px solid #64290C' }} className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: '#EA610E' }}>Pricing</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4" style={{ color: '#F0ECE6' }}>Simple, transparent pricing</h2>
            <p className="text-base" style={{ color: '#8a7060' }}>No hidden fees. Cancel anytime.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div key={p.name} style={{
                backgroundColor: p.highlight ? 'transparent' : '#1f1209',
                borderColor: p.highlight ? '#EA610E' : '#64290C',
                background: p.highlight ? 'linear-gradient(135deg, #2a1208, #1f1209)' : undefined
              }} className={`relative p-8 rounded-2xl border flex flex-col ${p.highlight ? 'shadow-2xl shadow-orange-900/50 scale-[1.03]' : ''}`}>
                {p.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span style={{ backgroundColor: '#EA610E' }} className="text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <div className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: '#EA610E' }}>{p.name}</div>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="font-display text-5xl font-bold" style={{ color: '#F0ECE6' }}>{p.price}</span>
                    <span className="text-sm pb-2" style={{ color: '#8a7060' }}>{p.period}</span>
                  </div>
                  <p className="text-sm" style={{ color: '#8a7060' }}>{p.desc}</p>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: '#F0ECE6' }}>
                      <span style={{ color: '#EA610E' }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" style={{
                  backgroundColor: p.highlight ? '#EA610E' : 'transparent',
                  borderColor: '#64290C',
                  color: '#F0ECE6'
                }} className={`block text-center py-3.5 px-6 rounded-xl font-semibold text-sm transition-all ${p.highlight ? 'hover:opacity-90 shadow-lg shadow-orange-900/40' : 'border hover:border-[#EA610E] hover:text-[#EA610E]'}`}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full rounded-3xl blur-[120px] opacity-20" style={{ backgroundColor: '#EA610E' }} />
          </div>
          <div className="relative z-10">
            <h2 className="font-display text-5xl sm:text-6xl font-bold mb-6" style={{ color: '#F0ECE6' }}>
              Ready to transform<br />your support?
            </h2>
            <p className="text-lg mb-10" style={{ color: '#8a7060' }}>
              Join 2,000+ teams already using Resolvo. Set up in under 5 minutes.
            </p>
            <Link href="/register" style={{ backgroundColor: '#EA610E' }} className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-semibold text-white text-lg hover:opacity-90 transition-all shadow-2xl shadow-orange-900/50">
              Get started for free
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="text-xs mt-4" style={{ color: '#8a7060' }}>No credit card required · Free forever plan · Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid #64290C' }} className="py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div style={{ backgroundColor: '#2C3647' }} className="w-7 h-7 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#F0ECE6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-display font-bold" style={{ color: '#F0ECE6' }}>Resolvo<span style={{ color: '#EA610E' }}> AI</span></span>
          </div>
          <div className="flex gap-8">
            {['Privacy', 'Terms', 'Docs', 'Status'].map((l) => (
              <a key={l} href="#" className="text-xs hover:text-[#EA610E] transition-colors" style={{ color: '#8a7060' }}>{l}</a>
            ))}
          </div>
          <p className="text-xs" style={{ color: '#64290C' }}>© {new Date().getFullYear()} Resolvo Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
