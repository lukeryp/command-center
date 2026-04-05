'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { SWING_CLIPS } from '@/lib/content-data';
import { POSITION_NAMES, SwingPosition } from '@/lib/content-types';
import { SwingClip } from '@/lib/content-types';

const ALL = 'all';
const POSITIONS = ['P1','P2','P3','P4','P5','P6','P7','P8'] as SwingPosition[];

const ANGLE_LABELS: Record<SwingClip['angle'], string> = {
  'face-on':       'Face-on',
  'down-the-line': 'DTL',
  'overhead':      'Overhead',
  'behind':        'Behind',
};

const CLUB_LABELS: Record<SwingClip['club'], string> = {
  driver: 'Driver',
  iron:   'Iron',
  wedge:  'Wedge',
  putter: 'Putter',
};

const CLUB_ICONS: Record<SwingClip['club'], string> = {
  driver: '🏌',
  iron:   '⛳',
  wedge:  '◝',
  putter: '▬',
};

// All unique pros, concepts
const ALL_PROS    = Array.from(new Set(SWING_CLIPS.map(c => c.proName))).sort();
const ALL_CONCEPTS = Array.from(new Set(SWING_CLIPS.flatMap(c => c.concepts))).sort();

export default function SwingsDatabase() {
  const [filterPro,     setFilterPro]     = useState<string>(ALL);
  const [filterPos,     setFilterPos]     = useState<SwingPosition | 'all'>(ALL);
  const [filterAngle,   setFilterAngle]   = useState<SwingClip['angle'] | 'all'>(ALL);
  const [filterConcept, setFilterConcept] = useState<string>(ALL);
  const [selected,      setSelected]      = useState<SwingClip | null>(null);

  const filtered = useMemo(() => {
    return SWING_CLIPS.filter(c => {
      if (filterPro    !== ALL && c.proName !== filterPro)       return false;
      if (filterAngle  !== ALL && c.angle   !== filterAngle)     return false;
      if (filterConcept !== ALL && !c.concepts.includes(filterConcept)) return false;
      if (filterPos    !== ALL && !c.positions[filterPos].tagged) return false;
      return true;
    });
  }, [filterPro, filterPos, filterAngle, filterConcept]);

  if (selected) {
    return <ClipDetail clip={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="page">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="mb-4 pb-3 border-b border-white/8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/content" className="font-mono text-[10px] text-white/30 hover:text-white/60 transition-colors">← content</Link>
          <span className="text-white/20 font-mono text-[10px]">/</span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/35" style={{ fontFamily: 'Raleway, sans-serif' }}>Swing Clips</span>
        </div>
        <span className="font-mono text-[10px] text-white/25">{filtered.length} of {SWING_CLIPS.length}</span>
      </div>

      {/* ── Filters ────────────────────────────────────────────────────── */}
      <div className="mb-4 space-y-2">
        {/* Pro */}
        <div className="no-scrollbar flex items-center gap-1 overflow-x-auto pb-0.5">
          <span className="font-mono text-[9px] text-white/25 shrink-0 w-14">Pro</span>
          <FilterPill active={filterPro === ALL} onClick={() => setFilterPro(ALL)} label="All" color="green" />
          {ALL_PROS.map(p => (
            <FilterPill key={p} active={filterPro === p} onClick={() => setFilterPro(p)} label={p.split(' ').pop()!} color="green" />
          ))}
        </div>

        {/* Position */}
        <div className="no-scrollbar flex items-center gap-1 overflow-x-auto pb-0.5">
          <span className="font-mono text-[9px] text-white/25 shrink-0 w-14">Position</span>
          <FilterPill active={filterPos === ALL} onClick={() => setFilterPos(ALL)} label="All" color="green" />
          {POSITIONS.map(p => (
            <FilterPill key={p} active={filterPos === p} onClick={() => setFilterPos(p)} label={p} color="green" />
          ))}
        </div>

        {/* Angle */}
        <div className="no-scrollbar flex items-center gap-1 overflow-x-auto pb-0.5">
          <span className="font-mono text-[9px] text-white/25 shrink-0 w-14">Angle</span>
          <FilterPill active={filterAngle === ALL} onClick={() => setFilterAngle(ALL)} label="All" color="green" />
          {(['face-on','down-the-line','overhead','behind'] as SwingClip['angle'][]).map(a => (
            <FilterPill key={a} active={filterAngle === a} onClick={() => setFilterAngle(a)} label={ANGLE_LABELS[a]} color="green" />
          ))}
        </div>

        {/* Concept */}
        <div className="no-scrollbar flex items-center gap-1 overflow-x-auto pb-0.5">
          <span className="font-mono text-[9px] text-white/25 shrink-0 w-14">Concept</span>
          <FilterPill active={filterConcept === ALL} onClick={() => setFilterConcept(ALL)} label="All" color="yellow" />
          {ALL_CONCEPTS.map(c => (
            <FilterPill key={c} active={filterConcept === c} onClick={() => setFilterConcept(c)} label={c} color="yellow" />
          ))}
        </div>
      </div>

      {/* ── Clip grid ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 stagger">
        {filtered.length === 0 && (
          <div className="col-span-2 glass rounded-xl p-6 text-center">
            <p className="font-mono text-[11px] text-white/25">No clips match these filters.</p>
          </div>
        )}
        {filtered.map(clip => (
          <button
            key={clip.id}
            onClick={() => setSelected(clip)}
            className="glass rounded-xl p-3 text-left group hover:border-[#00af51]/30 transition-all"
          >
            {/* Clip thumbnail placeholder */}
            <div className="w-full aspect-video rounded-lg bg-white/4 border border-white/6 mb-2.5 flex items-center justify-center relative overflow-hidden">
              <span className="font-mono text-[10px] text-white/15">[ {clip.proName} ]</span>
              <span className="absolute top-2 right-2 font-mono text-[9px] text-white/30 bg-black/40 rounded px-1.5 py-0.5">
                {ANGLE_LABELS[clip.angle]}
              </span>
              <span className="absolute top-2 left-2 font-mono text-[9px] text-white/30 bg-black/40 rounded px-1.5 py-0.5">
                {CLUB_LABELS[clip.club]}
              </span>
            </div>

            {/* Pro name */}
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-[13px] text-white/80 leading-tight" style={{ fontFamily: 'Raleway, sans-serif' }}>
                {clip.proName}
              </span>
              {clip.textbookChapter && (
                <span className="font-mono text-[9px] text-white/25 border border-white/10 rounded px-1 py-0.5">
                  Ch.{clip.textbookChapter}
                </span>
              )}
            </div>

            {/* P1-P8 position badges */}
            <div className="flex flex-wrap gap-1 mb-2">
              {POSITIONS.map(p => {
                const tagged = clip.positions[p].tagged;
                return (
                  <span
                    key={p}
                    className="font-mono text-[8px] font-bold px-1.5 py-0.5 rounded"
                    style={tagged ? {
                      background: '#00af5122',
                      color: '#00af51',
                      border: '1px solid #00af5155',
                    } : {
                      background: 'transparent',
                      color: 'rgba(255,255,255,0.2)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                    title={POSITION_NAMES[p]}
                  >
                    {p}
                  </span>
                );
              })}
            </div>

            {/* Concepts */}
            <div className="flex flex-wrap gap-1">
              {clip.concepts.slice(0, 4).map(c => (
                <span key={c} className="font-mono text-[8px] text-[#f4ee19]/50 bg-[#f4ee19]/5 border border-[#f4ee19]/15 rounded px-1.5 py-0.5">
                  {c}
                </span>
              ))}
              {clip.concepts.length > 4 && (
                <span className="font-mono text-[8px] text-white/20">+{clip.concepts.length - 4}</span>
              )}
            </div>
          </button>
        ))}
      </div>

    </div>
  );
}

// ── Filter pill component ─────────────────────────────────────────────────────

function FilterPill({
  active, onClick, label, color,
}: {
  active: boolean; onClick: () => void; label: string; color: 'green' | 'yellow';
}) {
  const activeStyle = color === 'green'
    ? 'bg-[#00af51]/20 border-[#00af51]/50 text-[#00af51]'
    : 'bg-[#f4ee19]/20 border-[#f4ee19]/50 text-[#f4ee19]';

  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-2 py-1 rounded-md font-mono text-[9px] border transition-all whitespace-nowrap ${
        active ? activeStyle : 'border-white/10 text-white/35 hover:text-white/60'
      }`}
    >
      {label}
    </button>
  );
}

// ── Clip detail view ─────────────────────────────────────────────────────────

function ClipDetail({ clip, onBack }: { clip: SwingClip; onBack: () => void }) {
  return (
    <div className="page">
      <div className="mb-4 pb-3 border-b border-white/8 flex items-center gap-2">
        <button
          onClick={onBack}
          className="font-mono text-[10px] text-white/30 hover:text-white/60 transition-colors"
        >
          ← swings
        </button>
        <span className="text-white/20 font-mono text-[10px]">/</span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-white/35" style={{ fontFamily: 'Raleway, sans-serif' }}>
          {clip.proName}
        </span>
      </div>

      {/* Video placeholder */}
      <div className="glass rounded-xl w-full aspect-video flex items-center justify-center mb-4 relative overflow-hidden">
        <span className="font-mono text-[11px] text-white/15">[ {clip.proName} · {ANGLE_LABELS[clip.angle]} ]</span>
        <div className="absolute top-3 right-3 flex gap-1.5">
          <span className="font-mono text-[9px] text-white/40 bg-black/50 rounded px-2 py-1">{ANGLE_LABELS[clip.angle]}</span>
          <span className="font-mono text-[9px] text-white/40 bg-black/50 rounded px-2 py-1">{CLUB_LABELS[clip.club]}</span>
        </div>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div className="glass rounded-xl p-3">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/35 block mb-2.5" style={{ fontFamily: 'Raleway, sans-serif' }}>
            Positions
          </span>
          <div className="space-y-1.5">
            {POSITIONS.map(p => {
              const { timestamp, tagged } = clip.positions[p];
              return (
                <div key={p} className={`flex items-center gap-2 ${!tagged ? 'opacity-30' : ''}`}>
                  <span
                    className="font-mono text-[9px] font-bold w-7 text-center shrink-0 px-1 py-0.5 rounded"
                    style={tagged ? {
                      background: '#00af5122', color: '#00af51', border: '1px solid #00af5155',
                    } : {
                      background: 'transparent', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    {p}
                  </span>
                  <span className="font-mono text-[10px] text-white/55 flex-1">{POSITION_NAMES[p]}</span>
                  {tagged && (
                    <span className="font-mono text-[9px] text-white/30 tabular-nums">{timestamp}s</span>
                  )}
                  {tagged && (
                    <span className="font-mono text-[8px] text-[#00af51]/60">tagged</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass rounded-xl p-3">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/35 block mb-2.5" style={{ fontFamily: 'Raleway, sans-serif' }}>
            Concepts
          </span>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {clip.concepts.map(c => (
              <span key={c} className="font-mono text-[9px] text-[#f4ee19]/60 bg-[#f4ee19]/8 border border-[#f4ee19]/20 rounded px-2 py-1">
                {c}
              </span>
            ))}
          </div>

          {clip.textbookChapter && (
            <div className="border-t border-white/6 pt-2.5">
              <span className="font-mono text-[9px] text-white/25">Textbook Chapter</span>
              <p className="font-mono text-[12px] text-white/60 mt-0.5">Chapter {clip.textbookChapter}</p>
            </div>
          )}

          {clip.notes && (
            <div className="border-t border-white/6 pt-2.5 mt-2.5">
              <span className="font-mono text-[9px] text-white/25 block mb-1">Notes</span>
              <p className="font-mono text-[10px] text-white/50 leading-relaxed">{clip.notes}</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
