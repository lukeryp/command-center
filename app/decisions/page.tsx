'use client';
import { useState, useEffect } from 'react';

interface Decision {
  id: string;
  date: string;
  title: string;
  context: string;
  decision: string;
  reasoning: string;
  alternatives: string[];
  impact: 'high' | 'medium' | 'low';
  project?: string;
  tags: string[];
  revisitDate?: string;
}

const STORAGE_KEY = 'ryp_cc_decisions';

const SEED_DECISIONS: Decision[] = [
  {
    id: 'd1',
    date: '2026-04-04',
    title: 'Instagram carousel Template #1 as default',
    context: 'Tested 10 different carousel template styles for social media brand identity',
    decision: 'Template #1 (Current Light) — white bg, circular headshot, bold text, clean layout',
    reasoning: 'Strongest visual hierarchy, most readable on mobile, consistent with data-first brand voice. Templates 2-10 archived for future experimentation.',
    alternatives: ['Template #3 (Dark Mode)', 'Template #7 (Split Layout)', 'Template #9 (Minimalist)'],
    impact: 'medium',
    project: 'social-media',
    tags: ['brand', 'design', 'social'],
  },
  {
    id: 'd2',
    date: '2026-04-04',
    title: 'RYP Red: 6-phase strategic build vs fast MVP',
    context: 'RYP Red has 32 patent claims and needs to compete with 18 Birdies and DECADE long-term',
    decision: 'Phased approach: Core Loop → Coach → Peer Intelligence → Multi-Club → Mobile → AI',
    reasoning: 'Patent protection gives us time. Building right > building fast. Senior dev standards non-negotiable. Phase 1 proves the card-scan-to-insight loop with 5 Interlachen players.',
    alternatives: ['Fast MVP with just card scan', 'Full feature parity with 18 Birdies from day 1'],
    impact: 'high',
    project: 'ryp-red',
    tags: ['product', 'strategy', 'engineering'],
  },
  {
    id: 'd3',
    date: '2026-04-04',
    title: 'Content Machine: Python pipeline first, then integrate',
    context: 'Need to automate video → 8 platform content briefs for Teddy',
    decision: 'Standalone Python pipeline first, integrate into Command Center after it works',
    reasoning: 'Python has better ML/audio libraries (Whisper, ffmpeg bindings). Can test and iterate faster outside Next.js. Command Center gets a clean API integration once pipeline is proven.',
    alternatives: ['Build entirely inside Command Center as API routes', 'Use third-party tool (Repurpose.io, etc.)'],
    impact: 'medium',
    project: 'content-machine',
    tags: ['engineering', 'content', 'automation'],
  },
  {
    id: 'd4',
    date: '2026-04-01',
    title: 'Caleb VanArragon carousel: real statistics, not estimates',
    context: 'First carousel used estimated Tour probabilities. Luke wanted actual math.',
    decision: 'Rebuilt with scipy normal distribution calculations using verified SG data',
    reasoning: 'No Fiction Policy. Scheffler +1.27/round (verified), Tiger +2.07 (ShotLink record), tour SD 0.37 (skill), within-round SD 1.7 (corrected from 2.7 after sanity check against empirical frequency).',
    alternatives: ['Use estimated/rounded numbers', 'Skip statistical claims entirely'],
    impact: 'high',
    project: 'social-media',
    tags: ['data', 'brand', 'no-fiction-policy'],
  },
  {
    id: 'd5',
    date: '2026-03-28',
    title: 'Known: Multi-club architecture over single-tenant',
    context: 'Known needs to scale beyond Interlachen',
    decision: 'Multi-tenant with club-level isolation via Supabase RLS policies',
    reasoning: 'Single database, row-level security per club. Cheaper than separate instances. Easier to maintain. Manager dashboard per club. Already deployed at Interlachen as proof.',
    alternatives: ['Separate Supabase project per club', 'Single shared database without isolation'],
    impact: 'high',
    project: 'known',
    tags: ['architecture', 'security', 'scalability'],
  },
];

function load(): Decision[] {
  if (typeof window === 'undefined') return SEED_DECISIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_DECISIONS;
    return JSON.parse(raw);
  } catch { return SEED_DECISIONS; }
}

function save(decisions: Decision[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
}

const IMPACT_STYLE = {
  high: 'bg-[#00af51]/15 text-[#00af51] border-[#00af51]/30',
  medium: 'bg-[#f4ee19]/15 text-[#f4ee19] border-[#f4ee19]/30',
  low: 'bg-white/8 text-white/40 border-white/15',
};

export default function DecisionsPage() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);

  // New decision form state
  const [newTitle, setNewTitle] = useState('');
  const [newContext, setNewContext] = useState('');
  const [newDecision, setNewDecision] = useState('');
  const [newReasoning, setNewReasoning] = useState('');
  const [newImpact, setNewImpact] = useState<'high' | 'medium' | 'low'>('medium');
  const [newTags, setNewTags] = useState('');

  useEffect(() => { setDecisions(load()); }, []);

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const filtered = decisions.filter(d => {
    if (!search) return true;
    const q = search.toLowerCase();
    return d.title.toLowerCase().includes(q) ||
           d.decision.toLowerCase().includes(q) ||
           d.tags.some(t => t.toLowerCase().includes(q)) ||
           (d.project || '').toLowerCase().includes(q);
  });

  const addDecision = () => {
    if (!newTitle || !newDecision) return;
    const d: Decision = {
      id: Date.now().toString(36),
      date: new Date().toISOString().slice(0, 10),
      title: newTitle,
      context: newContext,
      decision: newDecision,
      reasoning: newReasoning,
      alternatives: [],
      impact: newImpact,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
    };
    const updated = [d, ...decisions];
    setDecisions(updated);
    save(updated);
    setShowForm(false);
    setNewTitle(''); setNewContext(''); setNewDecision(''); setNewReasoning(''); setNewTags('');
  };

  return (
    <div className="page">
      <div className="animate-fade-up mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Raleway, sans-serif' }}>
              Decision Log
            </h1>
            <p className="text-white/40 text-sm mt-0.5">{decisions.length} decisions recorded</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-[#00af51] text-black hover:bg-[#00af51]/80 transition-all"
          >
            + Log Decision
          </button>
        </div>

        {/* Search */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search decisions, tags, projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-[#00af51]/50 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* New decision form */}
      {showForm && (
        <div className="animate-fade-up mb-5 bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 space-y-3">
          <input
            type="text" placeholder="Decision title"
            value={newTitle} onChange={e => setNewTitle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-[#00af51]/50 focus:outline-none"
          />
          <textarea
            placeholder="Context — what prompted this decision?"
            value={newContext} onChange={e => setNewContext(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-[#00af51]/50 focus:outline-none resize-none h-20"
          />
          <textarea
            placeholder="The decision — what did you decide?"
            value={newDecision} onChange={e => setNewDecision(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-[#00af51]/50 focus:outline-none resize-none h-20"
          />
          <textarea
            placeholder="Reasoning — why this over alternatives?"
            value={newReasoning} onChange={e => setNewReasoning(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-[#00af51]/50 focus:outline-none resize-none h-20"
          />
          <div className="flex gap-3">
            <select
              value={newImpact} onChange={e => setNewImpact(e.target.value as Decision['impact'])}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#00af51]/50 focus:outline-none"
            >
              <option value="high">High Impact</option>
              <option value="medium">Medium Impact</option>
              <option value="low">Low Impact</option>
            </select>
            <input
              type="text" placeholder="Tags (comma-separated)"
              value={newTags} onChange={e => setNewTags(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-[#00af51]/50 focus:outline-none"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={addDecision} className="px-4 py-2 rounded-xl text-sm font-medium bg-[#00af51] text-black">Save</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm font-medium bg-white/5 text-white/50 border border-white/10">Cancel</button>
          </div>
        </div>
      )}

      {/* Decision list */}
      <div className="space-y-2">
        {filtered.map((d, i) => (
          <div key={d.id} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
            <button
              onClick={() => toggle(d.id)}
              className="w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all"
            >
              <span className={`text-white/25 text-[10px] transition-transform duration-200 ${expanded.has(d.id) ? 'rotate-90' : ''}`}>▶</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-white font-medium text-sm">{d.title}</h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${IMPACT_STYLE[d.impact]}`}>
                    {d.impact}
                  </span>
                </div>
                <p className="text-white/30 text-xs mt-0.5 truncate">{d.decision}</p>
              </div>
              <span className="text-white/20 text-[11px] shrink-0">{d.date}</span>
            </button>

            {expanded.has(d.id) && (
              <div className="ml-8 mr-2 mt-1 mb-2 bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 space-y-3 animate-fade-up">
                {d.context && (
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Context</div>
                    <p className="text-white/50 text-sm">{d.context}</p>
                  </div>
                )}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Decision</div>
                  <p className="text-white/70 text-sm font-medium">{d.decision}</p>
                </div>
                {d.reasoning && (
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Reasoning</div>
                    <p className="text-white/50 text-sm">{d.reasoning}</p>
                  </div>
                )}
                {d.alternatives.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Alternatives Considered</div>
                    <div className="space-y-1">
                      {d.alternatives.map((alt, j) => (
                        <p key={j} className="text-white/35 text-sm">× {alt}</p>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {d.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] text-white/30 border border-white/[0.06]">{tag}</span>
                  ))}
                  {d.project && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#00af51]/10 text-[#00af51]/60 border border-[#00af51]/20">{d.project}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
