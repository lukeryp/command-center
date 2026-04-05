'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CONTENT_PIECES } from '@/lib/content-data';

// Filter only carousel pieces — these are Teddy's queue
const CAROUSEL_PIECES = CONTENT_PIECES.filter(p => p.platform === 'instagram-carousel');

// Teddy brief status
type BriefStatus = 'briefed' | 'in-progress' | 'ready' | 'posted';

interface CarouselBrief {
  id: string;
  title: string;
  series?: string;
  status: BriefStatus;
  slideCount: number;
  slides: string[];
  notes?: string;
  dueDate?: string;
}

// Derive briefs from carousel content pieces, with added design metadata
const BRIEFS: CarouselBrief[] = [
  {
    id: 'brief-one-coach-myth',
    title: 'The One Coach Myth',
    series: 'The Builders',
    status: 'ready',
    slideCount: 6,
    dueDate: '2026-04-06',
    notes: 'Split-screen Hogan/Trevino on slide 1 cover. Dark background, P6 freeze frame. Minimal text — let the visuals carry it.',
    slides: [
      'Cover: "There is no one golf swing." — Split-screen Hogan vs. Trevino at impact',
      'Two totally different backswings — show P4 comparison side by side',
      'But look at P6 — freeze frame both at impact (identical shaft lean)',
      'Many roads to impact — typographic slide with green accent',
      'The Genome Framework gives you YOUR swing — value prop',
      'CTA + follow @rypgolf — simple, clean close',
    ],
  },
  {
    id: 'brief-transition-window',
    title: 'The 0.3-Second Window',
    series: 'Swing Study',
    status: 'briefed',
    slideCount: 5,
    dueDate: '2026-04-10',
    notes: 'Heavy use of slow-motion freeze frames. P4→P5 transition is the visual hero. Use kinematic sequence diagram on slide 3.',
    slides: [
      'Cover: "The 0.3-second window that separates tour pros from amateurs"',
      'Transition defined — P4 to P5, clock graphic showing 0.3s',
      'The sequence: Hips → Torso → Arms → Club (kinematic diagram)',
      'What goes wrong: amateur sequence vs. tour sequence comparison',
      'How to train it — CTA to RYP coaching + follow',
    ],
  },
  {
    id: 'brief-korda-hips',
    title: "Nelly Korda's Hip Lead",
    series: 'Tour Average',
    status: 'in-progress',
    slideCount: 6,
    dueDate: '2026-04-08',
    notes: 'Use actual stat: 42 degrees hip lead. Data visualization on slide 2. Portrait orientation clips of Korda.',
    slides: [
      'Cover: "The stat that changed how we coach women players"',
      'Data slide: 42° hip lead at P6 — Korda vs. tour average chart',
      'Frame-by-frame: Korda P5 position',
      'Frame-by-frame: Korda P6 position',
      'The takeaway: rotation-driven power is not gender-specific',
      'CTA — follow + link in bio',
    ],
  },
  {
    id: 'brief-snead-tempo',
    title: 'Why Snead Had the Best Tempo',
    series: 'Swing Study',
    status: 'briefed',
    slideCount: 4,
    notes: 'Vintage film aesthetic for Snead clips. 3:1 ratio visualization is the hero graphic.',
    slides: [
      'Cover: "Sam Snead had the best tempo ever filmed"',
      '3:1 backswing-to-downswing ratio — animated graphic concept',
      'Snead at P4 vs. P8 — full swing sequence',
      'What you can learn — CTA',
    ],
  },
];

const STATUS_COLORS: Record<BriefStatus, string> = {
  briefed:     '#f4ee19',
  'in-progress': '#3b82f6',
  ready:       '#00af51',
  posted:      '#22d3ee',
};

const STATUS_LABELS: Record<BriefStatus, string> = {
  briefed:     'Briefed',
  'in-progress': 'In Progress',
  ready:       'Ready',
  posted:      'Posted',
};

export default function TeddyQueue() {
  const [expanded, setExpanded] = useState<string | null>(BRIEFS[0]?.id ?? null);

  const pendingCount  = BRIEFS.filter(b => b.status === 'briefed' || b.status === 'in-progress').length;
  const readyCount    = BRIEFS.filter(b => b.status === 'ready').length;

  return (
    <div className="page">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="mb-4 pb-3 border-b border-white/8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/content" className="font-mono text-[10px] text-white/30 hover:text-white/60 transition-colors">← content</Link>
          <span className="text-white/20 font-mono text-[10px]">/</span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/35" style={{ fontFamily: 'Raleway, sans-serif' }}>Teddy's Queue</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-[#f4ee19]">{pendingCount} pending</span>
          <span className="font-mono text-[10px] text-[#00af51]">{readyCount} ready</span>
        </div>
      </div>

      {/* ── Stats strip ────────────────────────────────────────────────── */}
      <div className="mb-4 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] text-white/35">
        <span>BRIEFS&nbsp;<span className="text-white/60">{BRIEFS.length}</span></span>
        <span>BRIEFED&nbsp;<span className="text-[#f4ee19]">{BRIEFS.filter(b=>b.status==='briefed').length}</span></span>
        <span>IN PROGRESS&nbsp;<span className="text-[#3b82f6]">{BRIEFS.filter(b=>b.status==='in-progress').length}</span></span>
        <span>READY&nbsp;<span className="text-[#00af51]">{readyCount}</span></span>
        <span>POSTED&nbsp;<span className="text-[#22d3ee]">{BRIEFS.filter(b=>b.status==='posted').length}</span></span>
      </div>

      {/* ── Brief cards ────────────────────────────────────────────────── */}
      <div className="space-y-2 stagger">
        {BRIEFS.map(brief => {
          const isOpen = expanded === brief.id;
          const statusColor = STATUS_COLORS[brief.status];

          return (
            <div
              key={brief.id}
              className="glass rounded-xl overflow-hidden"
            >
              {/* Summary row */}
              <button
                className="w-full px-3 py-3 text-left flex items-center gap-3"
                onClick={() => setExpanded(isOpen ? null : brief.id)}
              >
                {/* Status indicator */}
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: statusColor, boxShadow: `0 0 8px ${statusColor}66` }}
                />

                {/* Title + series */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[13px] text-white/80 leading-tight" style={{ fontFamily: 'Raleway, sans-serif' }}>
                      {brief.title}
                    </span>
                    {brief.series && (
                      <span className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-[#f4ee19]/10 text-[#f4ee19]/60 border border-[#f4ee19]/20">
                        {brief.series}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="font-mono text-[9px] text-white/30">
                      {brief.slideCount} slides
                    </span>
                    {brief.dueDate && (
                      <span className="font-mono text-[9px] text-white/25">
                        due {new Date(brief.dueDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status badge */}
                <span
                  className="shrink-0 font-mono text-[9px] px-2 py-1 rounded"
                  style={{
                    background: `${statusColor}22`,
                    color: statusColor,
                    border: `1px solid ${statusColor}44`,
                  }}
                >
                  {STATUS_LABELS[brief.status]}
                </span>

                <span className="font-mono text-[10px] text-white/20 shrink-0">{isOpen ? '▲' : '▼'}</span>
              </button>

              {/* Expanded brief */}
              {isOpen && (
                <div className="border-t border-white/6 px-3 pb-4 pt-3 space-y-3">

                  {/* Slide list */}
                  <div>
                    <span className="font-mono text-[9px] text-white/25 uppercase tracking-widest block mb-2">
                      Slides
                    </span>
                    <div className="space-y-1.5">
                      {brief.slides.map((slide, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <span
                            className="shrink-0 w-5 h-5 rounded flex items-center justify-center font-mono text-[9px] font-bold"
                            style={{ background: '#00af5115', color: '#00af5199', border: '1px solid #00af5130' }}
                          >
                            {i + 1}
                          </span>
                          <p className="font-mono text-[10px] text-white/55 leading-relaxed pt-0.5">{slide}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  {brief.notes && (
                    <div className="bg-white/3 rounded-lg px-3 py-2.5">
                      <span className="font-mono text-[9px] text-white/25 block mb-1">Design Notes</span>
                      <p className="font-mono text-[10px] text-white/50 leading-relaxed">{brief.notes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    {brief.status === 'briefed' && (
                      <button
                        className="px-3 py-1.5 rounded-lg font-mono text-[10px] border border-[#3b82f6]/30 text-[#3b82f6] hover:bg-[#3b82f6]/10 transition-colors"
                      >
                        → Mark In Progress
                      </button>
                    )}
                    {brief.status === 'in-progress' && (
                      <button
                        className="px-3 py-1.5 rounded-lg font-mono text-[10px] font-semibold transition-all"
                        style={{ background: '#00af51', color: '#000' }}
                      >
                        → Mark Ready
                      </button>
                    )}
                    {brief.status === 'ready' && (
                      <button
                        className="px-3 py-1.5 rounded-lg font-mono text-[10px] border border-[#22d3ee]/30 text-[#22d3ee] hover:bg-[#22d3ee]/10 transition-colors"
                      >
                        → Mark Posted
                      </button>
                    )}
                    <Link
                      href="/content/library"
                      className="px-3 py-1.5 rounded-lg font-mono text-[10px] border border-white/10 text-white/35 hover:text-white/60 hover:border-white/20 transition-colors"
                    >
                      view in library →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
