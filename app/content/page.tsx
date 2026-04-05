'use client';
import { useState } from 'react';
import Link from 'next/link';
import { detectPositions } from '@/lib/position-detector';
import { VIDEO_INTAKES, CONTENT_PIECES } from '@/lib/content-data';
import { POSITION_NAMES, SwingPosition } from '@/lib/content-types';

const PLATFORMS_SHORT: Record<string, string> = {
  'instagram-carousel': 'IG Car',
  'instagram-reel':     'IG Reel',
  'linkedin':           'LinkedIn',
  'youtube':            'YouTube',
  'email':              'Email',
  'twitter':            'Twitter',
  'blog':               'Blog',
};

const CASCADE_TARGETS = [
  'instagram-carousel',
  'linkedin',
  'twitter',
  'email',
  'youtube',
];

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getWeekDates() {
  const today = new Date();
  const day   = today.getDay(); // 0 = Sun
  const mon   = new Date(today);
  mon.setDate(today.getDate() - ((day + 6) % 7));
  return WEEK_DAYS.map((label, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return {
      label,
      dateStr: d.toISOString().slice(0, 10),
      isToday: d.toISOString().slice(0, 10) === today.toISOString().slice(0, 10),
    };
  });
}

const STATUS_COLOR: Record<string, string> = {
  pending:  '#555',
  draft:    '#f4ee19',
  complete: '#00af51',
};

const PIECE_STATUS_COLOR: Record<string, string> = {
  draft:     '#555',
  review:    '#f4ee19',
  ready:     '#00af51',
  scheduled: '#3b82f6',
  posted:    '#22d3ee',
};

export default function ContentDashboard() {
  const [transcript, setTranscript] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [detected, setDetected]     = useState<ReturnType<typeof detectPositions> | null>(null);
  const [processing, setProcessing] = useState(false);

  function analyze() {
    if (!transcript.trim()) return;
    setProcessing(true);
    setTimeout(() => {
      setDetected(detectPositions(transcript));
      setProcessing(false);
    }, 400);
  }

  const weekDates = getWeekDates();

  // Stats
  const totalVideos   = VIDEO_INTAKES.length;
  const totalPieces   = CONTENT_PIECES.length;
  const pendingReview = CONTENT_PIECES.filter(c => c.status === 'review').length;
  const readyToPost   = CONTENT_PIECES.filter(c => c.status === 'ready').length;

  // Calendar: map scheduled content to day
  const calMap: Record<string, typeof CONTENT_PIECES> = {};
  weekDates.forEach(d => { calMap[d.dateStr] = []; });
  CONTENT_PIECES.forEach(p => {
    if (p.scheduledDate && calMap[p.scheduledDate]) {
      calMap[p.scheduledDate].push(p);
    }
  });

  return (
    <div className="page">

      {/* ── Section label ──────────────────────────────────────────────── */}
      <div className="mb-4 pb-3 border-b border-white/8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/35" style={{ fontFamily: 'Raleway, sans-serif' }}>
            Content Machine
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/content/templates" className="font-mono text-[10px] text-white/40 hover:text-[#00af51] transition-colors">templates →</Link>
          <Link href="/content/library"   className="font-mono text-[10px] text-white/40 hover:text-[#00af51] transition-colors">library →</Link>
          <Link href="/content/swings"    className="font-mono text-[10px] text-white/40 hover:text-[#00af51] transition-colors">swings →</Link>
          <Link href="/content/teddy"     className="font-mono text-[10px] text-white/40 hover:text-[#00af51] transition-colors">teddy →</Link>
        </div>
      </div>

      {/* ── Stats strip ────────────────────────────────────────────────── */}
      <div className="mb-5 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] text-white/35">
        <span>VIDEOS&nbsp;<span className="text-white/60">{totalVideos}</span></span>
        <span>PIECES&nbsp;<span className="text-white/60">{totalPieces}</span></span>
        <span>REVIEW&nbsp;<span className="text-[#f4ee19]">{pendingReview}</span></span>
        <span>READY&nbsp;<span className="text-[#00af51]">{readyToPost}</span></span>
      </div>

      {/* ── Main grid ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">

        {/* LEFT — Video Intake */}
        <div className="glass rounded-xl p-3 flex flex-col gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/35" style={{ fontFamily: 'Raleway, sans-serif' }}>
            Video Intake
          </span>

          <input
            value={videoTitle}
            onChange={e => setVideoTitle(e.target.value)}
            placeholder="Video title..."
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-mono text-[11px] text-white placeholder:text-white/20 outline-none focus:border-[#00af51]/50 transition-colors"
          />

          <textarea
            value={transcript}
            onChange={e => setTranscript(e.target.value)}
            placeholder="Paste transcript or notes here... The analyzer will detect swing positions (P1-P8) and natural language references like 'impact', 'top of the backswing', 'transition', etc."
            rows={6}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-mono text-[11px] text-white/70 placeholder:text-white/20 outline-none focus:border-[#00af51]/50 transition-colors resize-none"
          />

          <div className="flex items-center gap-2">
            <button
              onClick={analyze}
              disabled={!transcript.trim() || processing}
              className="px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold transition-all disabled:opacity-30"
              style={{ background: '#00af51', color: '#000' }}
            >
              {processing ? 'Analyzing...' : '→ Analyze Transcript'}
            </button>
            {transcript.trim() && (
              <span className="font-mono text-[10px] text-white/30">
                {transcript.trim().split(/\s+/).length} words
              </span>
            )}
          </div>

          {/* Detected positions */}
          {detected !== null && (
            <div className="mt-1 border-t border-white/8 pt-2 space-y-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-white/35" style={{ fontFamily: 'Raleway, sans-serif' }}>
                Detected — {detected.length} references
              </span>
              {detected.length === 0 && (
                <p className="font-mono text-[10px] text-white/25">No position references found.</p>
              )}
              {detected.map((d, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span
                    className="shrink-0 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: '#00af5122', color: '#00af51', border: '1px solid #00af5144' }}
                  >
                    {d.position}
                  </span>
                  <span className="font-mono text-[9px] text-white/25 shrink-0 tabular-nums w-8">{d.timestamp}s</span>
                  <span className="font-mono text-[9px] text-white/40 leading-tight truncate">{d.context}</span>
                  {d.matchType === 'natural-language' && (
                    <span className="shrink-0 font-mono text-[8px] text-[#f4ee19]/60">NL</span>
                  )}
                </div>
              ))}
              {detected.length > 0 && (
                <button
                  className="mt-1 w-full py-1.5 rounded-lg font-mono text-[10px] font-semibold border border-[#00af51]/30 text-[#00af51] hover:bg-[#00af51]/10 transition-colors"
                >
                  → Queue Cascade
                </button>
              )}
            </div>
          )}
        </div>

        {/* RIGHT — Active Cascade Queue */}
        <div className="glass rounded-xl p-3">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/35" style={{ fontFamily: 'Raleway, sans-serif' }}>
              Cascade Queue
            </span>
            <span className="font-mono text-[10px] text-white/25">{VIDEO_INTAKES.length} videos</span>
          </div>

          <div className="space-y-3">
            {VIDEO_INTAKES.map(intake => (
              <div key={intake.id} className="border-b border-white/6 pb-3 last:border-0 last:pb-0">
                <div className="flex items-start gap-2 mb-1.5">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[11px] text-white/70 truncate">{intake.title}</p>
                    <p className="font-mono text-[9px] text-white/25 mt-0.5">
                      {new Date(intake.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {' · '}{intake.detectedPositions.length} positions detected
                    </p>
                  </div>
                </div>
                {/* Cascade status pills */}
                <div className="flex flex-wrap gap-1">
                  {CASCADE_TARGETS.map(target => {
                    const status = intake.cascadeStatus[target] ?? 'pending';
                    return (
                      <span
                        key={target}
                        className="font-mono text-[8px] px-1.5 py-0.5 rounded"
                        style={{
                          background: `${STATUS_COLOR[status]}22`,
                          color: STATUS_COLOR[status],
                          border: `1px solid ${STATUS_COLOR[status]}44`,
                        }}
                      >
                        {PLATFORMS_SHORT[target]} · {status}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content Calendar ───────────────────────────────────────────── */}
      <div className="glass rounded-xl p-3 mb-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/35" style={{ fontFamily: 'Raleway, sans-serif' }}>
            This Week
          </span>
          <Link href="/content/library" className="font-mono text-[10px] text-[#00af51] hover:underline">
            full calendar →
          </Link>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weekDates.map(({ label, dateStr, isToday }) => {
            const pieces = calMap[dateStr] ?? [];
            return (
              <div
                key={dateStr}
                className={`rounded-lg p-1.5 min-h-[72px] border transition-colors ${
                  isToday ? 'border-[#00af51]/40 bg-[#00af51]/5' : 'border-white/6 bg-white/2'
                }`}
              >
                <p className={`font-mono text-[9px] mb-1.5 ${isToday ? 'text-[#00af51]' : 'text-white/30'}`}>
                  {label}
                </p>
                <div className="space-y-0.5">
                  {pieces.map(p => (
                    <div
                      key={p.id}
                      className="font-mono text-[8px] leading-tight rounded px-1 py-0.5 truncate"
                      style={{
                        background: `${PIECE_STATUS_COLOR[p.status]}22`,
                        color: PIECE_STATUS_COLOR[p.status],
                      }}
                      title={`${p.title} — ${PLATFORMS_SHORT[p.platform]}`}
                    >
                      {PLATFORMS_SHORT[p.platform]}
                    </div>
                  ))}
                  {pieces.length === 0 && (
                    <div className="font-mono text-[8px] text-white/10">—</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Recent content pieces ──────────────────────────────────────── */}
      <div className="glass rounded-xl p-3">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/35" style={{ fontFamily: 'Raleway, sans-serif' }}>
            Recent Pieces
          </span>
          <Link href="/content/library" className="font-mono text-[10px] text-[#00af51] hover:underline">all →</Link>
        </div>
        <div className="space-y-2">
          {CONTENT_PIECES.slice(0, 5).map(piece => (
            <div key={piece.id} className="flex items-center gap-2 group">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: PIECE_STATUS_COLOR[piece.status] }}
              />
              <span className="flex-1 font-mono text-[11px] text-white/70 truncate">{piece.title}</span>
              <span className="font-mono text-[9px] shrink-0 text-white/30">{PLATFORMS_SHORT[piece.platform]}</span>
              <span
                className="font-mono text-[9px] shrink-0 px-1.5 py-0.5 rounded"
                style={{
                  background: `${PIECE_STATUS_COLOR[piece.status]}22`,
                  color: PIECE_STATUS_COLOR[piece.status],
                }}
              >
                {piece.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
