'use client';
import { useState } from 'react';

interface Feature {
  name: string;
  ryp: 'yes' | 'partial' | 'planned' | 'no' | 'moat';
  competitors: Record<string, 'yes' | 'partial' | 'no'>;
}

interface Competitor {
  id: string;
  name: string;
  tagline: string;
  pricing: string;
  users: string;
  strengths: string[];
  weaknesses: string[];
  rypAdvantage: string;
  threat: 'high' | 'medium' | 'low';
  lastChecked: string;
}

const COMPETITORS: Competitor[] = [
  {
    id: '18birdies',
    name: '18 Birdies',
    tagline: 'GPS rangefinder + game tracking',
    pricing: '$12/mo or $80/yr premium',
    users: '5M+ downloads',
    strengths: ['Large user base', 'GPS rangefinder built in', 'Social features', 'Club recommendation engine'],
    weaknesses: ['No prospective aim capture', 'Retrospective-only analysis', 'Generic club recommendations', 'No coach integration'],
    rypAdvantage: 'RYP Red captures aim BEFORE the shot. 18 Birdies only knows what happened, never what the player intended. Our SSL/ESL decomposition is patent-protected.',
    threat: 'high',
    lastChecked: '2026-04-04',
  },
  {
    id: 'arccos',
    name: 'Arccos',
    tagline: 'Smart sensors + AI caddie',
    pricing: '$12/mo (sensors $180-250 one-time)',
    users: '300K+ sensors sold',
    strengths: ['Automatic shot tracking via sensors', 'AI caddie (Arccos Caddie)', 'Strokes gained analysis', 'Partnership with club manufacturers'],
    weaknesses: ['Requires hardware purchase', 'No prospective aim data', 'Sensor reliability issues', 'No coach workflow', 'No manual entry fallback'],
    rypAdvantage: 'RYP Red works with any scoring method — no hardware required. Card scan pipeline means zero friction. Our bias analysis and per-club dispersion models are deeper than Arccos SG.',
    threat: 'medium',
    lastChecked: '2026-04-04',
  },
  {
    id: 'decade',
    name: 'DECADE',
    tagline: 'Course management system by Scott Fawcett',
    pricing: '$200-500 for course strategy',
    users: 'Used by 100+ Tour pros',
    strengths: ['Elite credibility (Tour pros)', 'Deep course management theory', 'Aim point methodology', 'Strong brand in competitive golf'],
    weaknesses: ['High price point', 'Manual/spreadsheet-heavy', 'No real-time data capture', 'No consumer-friendly UX', 'No per-club analysis'],
    rypAdvantage: 'DECADE tells you where to aim. RYP Red tells you where you aimed, how you executed, and decomposes the gap into strategy vs. execution with per-club specificity. We democratize what DECADE does manually.',
    threat: 'medium',
    lastChecked: '2026-04-04',
  },
  {
    id: 'shotscope',
    name: 'Shot Scope',
    tagline: 'GPS watch + shot tracking',
    pricing: '$200-300 (watch), free app',
    users: '500K+ users',
    strengths: ['Automatic shot detection', 'No phone needed on course', 'Detailed post-round stats', 'Affordable hardware'],
    weaknesses: ['Retrospective only', 'Limited AI analysis', 'No bias/shape analysis', 'No coach integration', 'Basic UI'],
    rypAdvantage: 'RYP Red\'s 2-factor dispersion model (FCF × SAF) provides per-club, per-shape analytics Shot Scope can\'t touch. Our wind decomposition and bias analysis are unique in market.',
    threat: 'low',
    lastChecked: '2026-04-04',
  },
  {
    id: 'golfmetrics',
    name: 'Golfmetrics',
    tagline: 'Strokes gained analytics for amateur golfers',
    pricing: '$50/year',
    users: 'Niche academic following',
    strengths: ['True strokes gained methodology', 'Academic rigor', 'Course-adjusted stats'],
    weaknesses: ['Dated UI', 'Manual data entry', 'No mobile app', 'No aim capture', 'Tiny user base'],
    rypAdvantage: 'We build on Broadie\'s foundation but add prospective aim capture (patent-protected), per-club dispersion models, and AI-powered card scan. We are what Golfmetrics would be if rebuilt in 2026.',
    threat: 'low',
    lastChecked: '2026-04-04',
  },
];

const FEATURES: Feature[] = [
  { name: 'Prospective aim capture', ryp: 'moat', competitors: { '18birdies': 'no', arccos: 'no', decade: 'partial', shotscope: 'no', golfmetrics: 'no' } },
  { name: 'SSL/ESL decomposition', ryp: 'moat', competitors: { '18birdies': 'no', arccos: 'no', decade: 'no', shotscope: 'no', golfmetrics: 'no' } },
  { name: 'Per-club dispersion model', ryp: 'moat', competitors: { '18birdies': 'no', arccos: 'partial', decade: 'no', shotscope: 'partial', golfmetrics: 'no' } },
  { name: 'AI card scan extraction', ryp: 'moat', competitors: { '18birdies': 'no', arccos: 'no', decade: 'no', shotscope: 'no', golfmetrics: 'no' } },
  { name: 'Strokes gained analysis', ryp: 'yes', competitors: { '18birdies': 'partial', arccos: 'yes', decade: 'partial', shotscope: 'partial', golfmetrics: 'yes' } },
  { name: 'Bias/shape analysis', ryp: 'yes', competitors: { '18birdies': 'no', arccos: 'partial', decade: 'no', shotscope: 'no', golfmetrics: 'no' } },
  { name: 'Wind decomposition', ryp: 'planned', competitors: { '18birdies': 'no', arccos: 'no', decade: 'partial', shotscope: 'no', golfmetrics: 'no' } },
  { name: 'Coach dashboard', ryp: 'planned', competitors: { '18birdies': 'no', arccos: 'no', decade: 'no', shotscope: 'no', golfmetrics: 'no' } },
  { name: 'GPS rangefinder', ryp: 'no', competitors: { '18birdies': 'yes', arccos: 'yes', decade: 'no', shotscope: 'yes', golfmetrics: 'no' } },
  { name: 'Auto shot tracking (hardware)', ryp: 'no', competitors: { '18birdies': 'no', arccos: 'yes', decade: 'no', shotscope: 'yes', golfmetrics: 'no' } },
  { name: 'Mobile app', ryp: 'planned', competitors: { '18birdies': 'yes', arccos: 'yes', decade: 'partial', shotscope: 'yes', golfmetrics: 'no' } },
  { name: 'AI caddie / recommendations', ryp: 'planned', competitors: { '18birdies': 'partial', arccos: 'yes', decade: 'yes', shotscope: 'no', golfmetrics: 'no' } },
];

const CELL_STYLE = {
  yes: 'bg-[#00af51]/15 text-[#00af51]',
  partial: 'bg-[#f4ee19]/15 text-[#f4ee19]',
  planned: 'bg-[#0ea5e9]/15 text-[#0ea5e9]',
  no: 'bg-white/3 text-white/15',
  moat: 'bg-[#00af51]/25 text-[#00af51] font-bold',
};

const CELL_LABEL = { yes: '✓', partial: '◐', planned: '○', no: '—', moat: '🛡' };

const THREAT_STYLE = {
  high: 'bg-red-500/15 text-red-400 border-red-500/30',
  medium: 'bg-[#f4ee19]/15 text-[#f4ee19] border-[#f4ee19]/30',
  low: 'bg-white/8 text-white/40 border-white/15',
};

export default function CompetitorsPage() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [view, setView] = useState<'cards' | 'matrix'>('cards');

  const toggle = (id: string) => {
    setExpanded(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  return (
    <div className="page">
      <div className="animate-fade-up mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Raleway, sans-serif' }}>Competitor Watch</h1>
            <p className="text-white/40 text-sm mt-0.5">{COMPETITORS.length} competitors tracked · {FEATURES.filter(f => f.ryp === 'moat').length} patent-protected moats</p>
          </div>
          <div className="flex bg-white/5 border border-white/10 rounded-lg p-0.5">
            <button onClick={() => setView('cards')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${view === 'cards' ? 'bg-[#00af51] text-black' : 'text-white/40'}`}>Cards</button>
            <button onClick={() => setView('matrix')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${view === 'matrix' ? 'bg-[#00af51] text-black' : 'text-white/40'}`}>Matrix</button>
          </div>
        </div>
      </div>

      {view === 'matrix' ? (
        <div className="animate-fade-up overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left text-white/30 font-medium pb-3 pr-4 sticky left-0 bg-[#0d0d0d]">Feature</th>
                <th className="text-center text-[#00af51] font-bold pb-3 px-2">RYP Red</th>
                {COMPETITORS.map(c => (
                  <th key={c.id} className="text-center text-white/40 font-medium pb-3 px-2 whitespace-nowrap">{c.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map(f => (
                <tr key={f.name} className="border-t border-white/[0.04]">
                  <td className="py-2 pr-4 text-white/50 sticky left-0 bg-[#0d0d0d]">{f.name}</td>
                  <td className="py-2 px-2 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] ${CELL_STYLE[f.ryp]}`}>{CELL_LABEL[f.ryp]}</span>
                  </td>
                  {COMPETITORS.map(c => (
                    <td key={c.id} className="py-2 px-2 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] ${CELL_STYLE[f.competitors[c.id.replace(/\s/g, '')] || 'no']}`}>
                        {CELL_LABEL[f.competitors[c.id.replace(/\s/g, '')] || 'no']}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex gap-4 mt-4 text-[10px] text-white/25">
            <span>🛡 Patent moat</span> <span>✓ Has</span> <span>◐ Partial</span> <span>○ Planned</span> <span>— No</span>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {COMPETITORS.map((c, i) => (
            <div key={c.id} className="animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
              <button onClick={() => toggle(c.id)} className="w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all">
                <span className={`text-white/25 text-[10px] transition-transform duration-200 ${expanded.has(c.id) ? 'rotate-90' : ''}`}>▶</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-medium text-sm">{c.name}</h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${THREAT_STYLE[c.threat]}`}>{c.threat} threat</span>
                  </div>
                  <p className="text-white/30 text-xs mt-0.5">{c.tagline} · {c.pricing}</p>
                </div>
                <span className="text-white/15 text-[10px] shrink-0">Updated {c.lastChecked}</span>
              </button>

              {expanded.has(c.id) && (
                <div className="ml-8 mr-2 mt-1 mb-2 bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 space-y-3 animate-fade-up">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1.5">Strengths</div>
                      {c.strengths.map((s, j) => <p key={j} className="text-white/50 text-sm mb-1">+ {s}</p>)}
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1.5">Weaknesses</div>
                      {c.weaknesses.map((w, j) => <p key={j} className="text-white/35 text-sm mb-1">− {w}</p>)}
                    </div>
                  </div>
                  <div className="bg-[#00af51]/5 border border-[#00af51]/15 rounded-xl p-3">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#00af51]/40 mb-1">RYP Advantage</div>
                    <p className="text-[#00af51]/70 text-sm">{c.rypAdvantage}</p>
                  </div>
                  <div className="flex gap-3 text-xs text-white/30">
                    <span>Users: {c.users}</span>
                    <span>Pricing: {c.pricing}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
