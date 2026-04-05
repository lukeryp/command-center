'use client';
import { useState } from 'react';

interface RevenueStream {
  id: string;
  name: string;
  type: 'product' | 'service' | 'subscription' | 'licensing';
  status: 'active' | 'planned' | 'building';
  mrrCurrent: number;
  mrrTarget: number;
  source: string;
  notes: string;
  color: string;
}

const STREAMS: RevenueStream[] = [
  {
    id: 'rypstick',
    name: 'Rypstick Sales',
    type: 'product',
    status: 'active',
    mrrCurrent: 0,
    mrrTarget: 5000,
    source: 'Shopify (Swing Speed Golf Lab)',
    notes: 'Active Shopify store. Revenue varies by season. Speed training device with patented rotatable shaft.',
    color: '#22d3ee',
  },
  {
    id: 'chip-lessons',
    name: 'CHIP Lessons',
    type: 'service',
    status: 'active',
    mrrCurrent: 0,
    mrrTarget: 8000,
    source: 'Interlachen CC',
    notes: 'Lesson revenue through Interlachen. Includes private, group, and junior programs.',
    color: '#0ea5e9',
  },
  {
    id: 'certification',
    name: 'RYP Certification',
    type: 'subscription',
    status: 'building',
    mrrCurrent: 0,
    mrrTarget: 10000,
    source: 'cert.rypgolf.com (Stripe)',
    notes: 'L1 Instructor Certification. Beta with 7 Interlachen pros. Pricing TBD. Target: $500-1000/cert.',
    color: '#f97316',
  },
  {
    id: 'ryp-red-sub',
    name: 'RYP Red Subscriptions',
    type: 'subscription',
    status: 'planned',
    mrrCurrent: 0,
    mrrTarget: 25000,
    source: 'rypgolf.com (Stripe)',
    notes: 'Player analytics platform. Phase 4 includes billing. Target: $10-15/mo per player, $50/mo per coach.',
    color: '#ef4444',
  },
  {
    id: 'known-club',
    name: 'Known Club Licenses',
    type: 'licensing',
    status: 'building',
    mrrCurrent: 0,
    mrrTarget: 15000,
    source: 'known.golf (Stripe)',
    notes: 'Per-club SaaS license. First club: Interlachen (free beta). Target: $200-500/mo per club.',
    color: '#00af51',
  },
  {
    id: 'textbook',
    name: 'The Golf Textbook',
    type: 'product',
    status: 'building',
    mrrCurrent: 0,
    mrrTarget: 3000,
    source: 'Amazon KDP + direct sales',
    notes: 'Masters Week launch (Apr 6). Print + Kindle. Direct sales via rypgolf.com.',
    color: '#6366f1',
  },
  {
    id: 'forge-products',
    name: 'FORGE Training Aids',
    type: 'product',
    status: 'planned',
    mrrCurrent: 0,
    mrrTarget: 8000,
    source: 'Shopify / rypgolf.com',
    notes: 'Hammer Schleis, Lag Strip, Big Ball, Hockey Helmet, Ground Force Belt. 5 patents filed. Manufacturing partnerships being finalized.',
    color: '#f4ee19',
  },
];

const STATUS_STYLE = {
  active:   { label: 'Active',   cls: 'bg-[#00af51]/15 text-[#00af51] border-[#00af51]/30' },
  building: { label: 'Building', cls: 'bg-[#f4ee19]/15 text-[#f4ee19] border-[#f4ee19]/30' },
  planned:  { label: 'Planned',  cls: 'bg-white/8 text-white/40 border-white/15' },
};

export default function RevenuePage() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpanded(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  const totalMRR = STREAMS.reduce((sum, s) => sum + s.mrrCurrent, 0);
  const totalTarget = STREAMS.reduce((sum, s) => sum + s.mrrTarget, 0);
  const activeStreams = STREAMS.filter(s => s.status === 'active').length;
  const buildingStreams = STREAMS.filter(s => s.status === 'building').length;

  return (
    <div className="page">
      <div className="animate-fade-up mb-6">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Raleway, sans-serif' }}>Revenue Tracker</h1>
        <p className="text-white/40 text-sm mt-0.5">{STREAMS.length} revenue streams · {activeStreams} active · {buildingStreams} building</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-up">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
          <div className="text-white/30 text-[10px] uppercase tracking-wider">Current MRR</div>
          <div className="text-white font-bold text-2xl mt-1" style={{ fontFamily: 'Raleway, sans-serif' }}>
            ${totalMRR.toLocaleString()}
          </div>
          <div className="text-white/20 text-xs mt-0.5">Connect Stripe to track</div>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
          <div className="text-white/30 text-[10px] uppercase tracking-wider">MRR Target</div>
          <div className="text-[#00af51] font-bold text-2xl mt-1" style={{ fontFamily: 'Raleway, sans-serif' }}>
            ${totalTarget.toLocaleString()}
          </div>
          <div className="text-white/20 text-xs mt-0.5">All streams at target</div>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
          <div className="text-white/30 text-[10px] uppercase tracking-wider">ARR Target</div>
          <div className="text-[#f4ee19] font-bold text-2xl mt-1" style={{ fontFamily: 'Raleway, sans-serif' }}>
            ${(totalTarget * 12).toLocaleString()}
          </div>
          <div className="text-white/20 text-xs mt-0.5">Annualized</div>
        </div>
      </div>

      {/* Revenue streams */}
      <div className="space-y-2">
        {STREAMS.map((s, i) => {
          const pct = s.mrrTarget > 0 ? Math.round((s.mrrCurrent / s.mrrTarget) * 100) : 0;
          const ss = STATUS_STYLE[s.status];
          return (
            <div key={s.id} className="animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
              <button onClick={() => toggle(s.id)}
                className="w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all">
                <span className={`text-white/25 text-[10px] transition-transform duration-200 ${expanded.has(s.id) ? 'rotate-90' : ''}`}>▶</span>
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: s.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-medium text-sm">{s.name}</h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ss.cls}`}>{ss.label}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden max-w-32">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: s.color }} />
                    </div>
                    <span className="text-white/25 text-[10px]">${s.mrrCurrent.toLocaleString()} / ${s.mrrTarget.toLocaleString()} MRR</span>
                  </div>
                </div>
              </button>

              {expanded.has(s.id) && (
                <div className="ml-8 mr-2 mt-1 mb-2 bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 space-y-2 animate-fade-up">
                  <div className="flex gap-4 text-xs">
                    <span className="text-white/30">Type: <span className="text-white/50">{s.type}</span></span>
                    <span className="text-white/30">Source: <span className="text-white/50">{s.source}</span></span>
                  </div>
                  <p className="text-white/40 text-sm">{s.notes}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="mt-8 text-center text-white/15 text-xs animate-fade-up">
        Connect Stripe and Shopify to see real-time revenue data
      </div>
    </div>
  );
}
