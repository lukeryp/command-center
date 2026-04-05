'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { CONTENT_PIECES } from '@/lib/content-data';
import {
  PLATFORMS, SERIES_LIST, STATUS_COLORS,
  ContentPlatform, ContentStatus,
} from '@/lib/content-types';

const ALL = 'all';

const PLATFORM_SHORT: Record<string, string> = {
  'instagram-carousel': 'IG Car',
  'instagram-reel':     'IG Reel',
  'linkedin':           'LinkedIn',
  'youtube':            'YouTube',
  'email':              'Email',
  'twitter':            'Twitter',
  'blog':               'Blog',
};

const STATUSES: { value: ContentStatus | 'all'; label: string }[] = [
  { value: 'all',       label: 'All' },
  { value: 'draft',     label: 'Draft' },
  { value: 'review',    label: 'Review' },
  { value: 'ready',     label: 'Ready' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'posted',    label: 'Posted' },
];

export default function ContentLibrary() {
  const [query,    setQuery]    = useState('');
  const [platform, setPlatform] = useState<ContentPlatform | 'all'>(ALL);
  const [series,   setSeries]   = useState<string>(ALL);
  const [status,   setStatus]   = useState<ContentStatus | 'all'>(ALL);
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return CONTENT_PIECES.filter(p => {
      if (platform !== ALL && p.platform !== platform) return false;
      if (series   !== ALL && p.series   !== series)   return false;
      if (status   !== ALL && p.status   !== status)   return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (
          !p.title.toLowerCase().includes(q) &&
          !p.body.toLowerCase().includes(q) &&
          !(p.series?.toLowerCase().includes(q)) &&
          !(p.hashtags?.some(h => h.toLowerCase().includes(q)))
        ) return false;
      }
      return true;
    });
  }, [query, platform, series, status]);

  return (
    <div className="page">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="mb-4 pb-3 border-b border-white/8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/content" className="font-mono text-[10px] text-white/30 hover:text-white/60 transition-colors">← content</Link>
          <span className="text-white/20 font-mono text-[10px]">/</span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/35" style={{ fontFamily: 'Raleway, sans-serif' }}>Library</span>
        </div>
        <span className="font-mono text-[10px] text-white/25">{filtered.length} of {CONTENT_PIECES.length}</span>
      </div>

      {/* ── Search ─────────────────────────────────────────────────────── */}
      <div className="mb-3 flex items-center gap-2 glass rounded-xl px-3 py-2">
        <span className="font-mono text-[10px] text-[#00af51]/70 shrink-0">⌕</span>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search title, body, series, hashtags..."
          className="flex-1 bg-transparent font-mono text-[11px] text-white/65 outline-none placeholder:text-white/20"
        />
        {query && (
          <button onClick={() => setQuery('')} className="font-mono text-[10px] text-white/25 hover:text-white/60 shrink-0">✕</button>
        )}
      </div>

      {/* ── Filters ────────────────────────────────────────────────────── */}
      <div className="mb-4 space-y-2">
        {/* Platform */}
        <div className="no-scrollbar flex items-center gap-1 overflow-x-auto pb-0.5">
          <span className="font-mono text-[9px] text-white/25 shrink-0 w-14">Platform</span>
          <button
            onClick={() => setPlatform(ALL)}
            className={`shrink-0 px-2 py-1 rounded-md font-mono text-[9px] border transition-all ${
              platform === ALL
                ? 'bg-[#00af51]/20 border-[#00af51]/50 text-[#00af51]'
                : 'border-white/10 text-white/35 hover:text-white/60'
            }`}
          >All</button>
          {PLATFORMS.map(p => (
            <button
              key={p.value}
              onClick={() => setPlatform(p.value)}
              className={`shrink-0 px-2 py-1 rounded-md font-mono text-[9px] border transition-all ${
                platform === p.value
                  ? 'bg-[#00af51]/20 border-[#00af51]/50 text-[#00af51]'
                  : 'border-white/10 text-white/35 hover:text-white/60'
              }`}
            >
              {p.short}
            </button>
          ))}
        </div>

        {/* Series */}
        <div className="no-scrollbar flex items-center gap-1 overflow-x-auto pb-0.5">
          <span className="font-mono text-[9px] text-white/25 shrink-0 w-14">Series</span>
          <button
            onClick={() => setSeries(ALL)}
            className={`shrink-0 px-2 py-1 rounded-md font-mono text-[9px] border transition-all ${
              series === ALL
                ? 'bg-[#00af51]/20 border-[#00af51]/50 text-[#00af51]'
                : 'border-white/10 text-white/35 hover:text-white/60'
            }`}
          >All</button>
          {SERIES_LIST.map(s => (
            <button
              key={s}
              onClick={() => setSeries(s)}
              className={`shrink-0 px-2 py-1 rounded-md font-mono text-[9px] border transition-all whitespace-nowrap ${
                series === s
                  ? 'bg-[#f4ee19]/20 border-[#f4ee19]/50 text-[#f4ee19]'
                  : 'border-white/10 text-white/35 hover:text-white/60'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Status */}
        <div className="no-scrollbar flex items-center gap-1 overflow-x-auto pb-0.5">
          <span className="font-mono text-[9px] text-white/25 shrink-0 w-14">Status</span>
          {STATUSES.map(s => (
            <button
              key={s.value}
              onClick={() => setStatus(s.value)}
              className={`shrink-0 px-2 py-1 rounded-md font-mono text-[9px] border transition-all ${
                status === s.value
                  ? 'border-white/30 text-white'
                  : 'border-white/10 text-white/35 hover:text-white/60'
              }`}
              style={status === s.value && s.value !== 'all' ? {
                background: `${STATUS_COLORS[s.value as ContentStatus]}22`,
                borderColor: `${STATUS_COLORS[s.value as ContentStatus]}55`,
                color: STATUS_COLORS[s.value as ContentStatus],
              } : {}}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content list ───────────────────────────────────────────────── */}
      <div className="space-y-2 stagger">
        {filtered.length === 0 && (
          <div className="glass rounded-xl p-6 text-center">
            <p className="font-mono text-[11px] text-white/25">No content matches these filters.</p>
          </div>
        )}
        {filtered.map(piece => {
          const isOpen = expanded === piece.id;
          const statusColor = STATUS_COLORS[piece.status];
          return (
            <div key={piece.id} className="glass rounded-xl overflow-hidden">
              <button
                className="w-full px-3 py-2.5 text-left flex items-start gap-2"
                onClick={() => setExpanded(isOpen ? null : piece.id)}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                  style={{ background: statusColor }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] text-white/75 font-semibold leading-tight">
                      {piece.title}
                    </span>
                    {piece.series && (
                      <span className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-[#f4ee19]/10 text-[#f4ee19]/70 border border-[#f4ee19]/20">
                        {piece.series}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-[9px] text-white/30">{PLATFORM_SHORT[piece.platform]}</span>
                    {piece.scheduledDate && (
                      <span className="font-mono text-[9px] text-white/25">
                        {new Date(piece.scheduledDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className="font-mono text-[9px] px-1.5 py-0.5 rounded"
                    style={{
                      background: `${statusColor}22`,
                      color: statusColor,
                      border: `1px solid ${statusColor}44`,
                    }}
                  >
                    {piece.status}
                  </span>
                  <span className="font-mono text-[10px] text-white/20">{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>

              {isOpen && (
                <div className="px-3 pb-3 border-t border-white/6 pt-2.5 space-y-2.5">
                  <p className="font-mono text-[10px] text-white/50 leading-relaxed whitespace-pre-line">
                    {piece.body}
                  </p>

                  {piece.hashtags && piece.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {piece.hashtags.map(h => (
                        <span key={h} className="font-mono text-[9px] text-[#3b82f6]/60">{h}</span>
                      ))}
                    </div>
                  )}

                  {piece.shotList && piece.shotList.length > 0 && (
                    <div>
                      <p className="font-mono text-[9px] text-white/25 uppercase tracking-widest mb-1.5">Shot List</p>
                      <div className="space-y-1.5">
                        {piece.shotList.map((shot, i) => (
                          <div key={i} className="flex items-start gap-2 bg-white/3 rounded-lg px-2 py-1.5">
                            <span className="font-mono text-[9px] text-white/25 shrink-0 tabular-nums w-8">{shot.transcriptTimestamp}s</span>
                            <span
                              className="font-mono text-[9px] font-bold shrink-0 px-1 py-0.5 rounded"
                              style={{ background: '#00af5122', color: '#00af51', border: '1px solid #00af5144' }}
                            >
                              {shot.positionReference}
                            </span>
                            <span className="font-mono text-[9px] text-white/30 shrink-0">{shot.clipType}</span>
                            <span className="font-mono text-[9px] text-white/45 leading-tight">{shot.notes}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
