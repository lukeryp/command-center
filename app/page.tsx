'use client';
import { useState, useEffect } from 'react';
import {
  getProjects, getTasks, getIdeas, getTodayPriorities,
  savePriority, deletePriority, newId, saveIdea,
} from '@/lib/store';
import { Project, Task, Idea, DailyPriority } from '@/lib/types';
import Link from 'next/link';

const STATUS_DOT: Record<string, string> = {
  'on-track':        '#00af51',
  'needs-attention': '#f4ee19',
  'blocked':         '#ef4444',
  'paused':          '#555',
  'complete':        '#00af51',
  'pending':         '#4b5563',
};

interface Deploy {
  project: string;
  status: 'success' | 'building' | 'failed';
  time: string;
  url: string;
  commit: string;
}

const RECENT_DEPLOYS: Deploy[] = [
  { project: 'Command Center', status: 'success', time: '2m ago', url: 'https://command-center-nine-kappa.vercel.app', commit: 'Add competitor watch + dependency map' },
  { project: 'Known', status: 'success', time: '1d ago', url: 'https://known.golf', commit: 'Multi-club security hardening' },
  { project: 'Certification', status: 'success', time: '2d ago', url: 'https://cert.rypgolf.com', commit: 'Quiz engine fix for chapter 12' },
];

const STATUS_TAG: Record<string, string> = {
  'on-track':        'OK',
  'needs-attention': 'ATTN',
  'blocked':         'BLKD',
  'paused':          'PAUS',
  'complete':        'DONE',
};

const QUICK_LINKS = [
  { name: 'known.golf',           url: 'https://known.golf' },
  { name: 'rypgolf.com',          url: 'https://rypgolf.com' },
  { name: 'cert.rypgolf.com',     url: 'https://cert.rypgolf.com' },
  { name: 'swingspeedgolflab.com',url: 'https://swingspeedgolflab.com' },
  { name: 'master-patent',        url: 'https://docs.google.com/document/d/1Z1VzFiuFLEuNfMqW_sw7OxIaBwatS0zkm1uaubHe_Ns/edit' },
  { name: 'alibaba-msgs',         url: 'https://message.alibaba.com/message/messenger.htm' },
  { name: 'upwork',               url: 'https://www.upwork.com/nx/wm/workroom/35119864/messages' },
  { name: 'command-center',       url: 'https://command-center-nine-kappa.vercel.app' },
];

// ── RYP Ecosystem Apps ───────────────────────────────────────────────────────

type AppStatus = 'live' | 'built' | 'planned';

interface RYPApp {
  name: string;
  description: string;
  emoji: string;
  status: AppStatus;
  liveUrl?: string;
  githubUrl?: string;
  note?: string;
  accent?: string;
}

const RYP_APPS: RYPApp[] = [
  {
    name: 'Known',
    description: 'Member Recognition Training',
    emoji: '⛳',
    status: 'live',
    liveUrl: 'https://known.golf',
    accent: '#00af51',
  },
  {
    name: 'Practice DNA',
    description: 'Practice Assessment Quiz',
    emoji: '🧬',
    status: 'live',
    liveUrl: 'https://practice-dna.vercel.app',
    accent: '#f97316',
  },
  {
    name: 'RYP Red',
    description: 'Coaching & Scorecard Platform',
    emoji: '🔴',
    status: 'built',
    githubUrl: 'https://github.com/lukeryp/ryp-red',
    accent: '#ef4444',
  },
  {
    name: 'FORGE',
    description: 'Drill Scoring & RYP Performance Index',
    emoji: '🔥',
    status: 'built',
    note: 'Module within Red',
    accent: '#f4ee19',
  },
  {
    name: 'Player Dashboard',
    description: 'Unified Performance View',
    emoji: '📊',
    status: 'built',
    githubUrl: 'https://github.com/lukeryp/ryp-player-dashboard',
    accent: '#818cf8',
  },
  {
    name: 'Kudo',
    description: 'Recognition & Testimonials',
    emoji: '⭐',
    status: 'built',
    githubUrl: 'https://github.com/lukeryp/kudo',
    accent: '#eab308',
  },
  {
    name: 'CHIP',
    description: 'Golf Fitness Tracking',
    emoji: '💪',
    status: 'built',
    githubUrl: 'https://github.com/lukeryp/chip',
    liveUrl: 'https://chip.rypgolf.com',
    accent: '#0ea5e9',
  },
  {
    name: 'Certification',
    description: 'Instructor Certification',
    emoji: '🏅',
    status: 'planned',
    liveUrl: 'https://cert.rypgolf.com',
    accent: '#f97316',
  },
  {
    name: 'Golf Textbook',
    description: 'Book Landing Page',
    emoji: '📖',
    status: 'planned',
    accent: '#6366f1',
  },
  {
    name: 'Command Center',
    description: 'Master Brain PWA',
    emoji: '🧠',
    status: 'live',
    liveUrl: 'https://command-center-nine-kappa.vercel.app',
    accent: '#8b5cf6',
  },
  {
    name: 'Shared UI Library',
    description: 'Component Library (@ryp/ui)',
    emoji: '🧩',
    status: 'built',
    note: '~/Desktop/RYP-Projects/ryp-ui/',
    accent: '#00af51',
  },
  {
    name: 'Shared Supabase',
    description: 'Database',
    emoji: '🗄️',
    status: 'live',
    note: 'ref: fcxyrebdegtjdsbasxfc',
    liveUrl: 'https://supabase.com/dashboard',
    accent: '#3ecf8e',
  },
];

const APP_STATUS_CONFIG: Record<AppStatus, { label: string; cls: string; dot: string }> = {
  live:    { label: 'LIVE',    cls: 'bg-[#00af51]/15 text-[#00af51] border-[#00af51]/30',  dot: 'bg-[#00af51]' },
  built:   { label: 'BUILT',   cls: 'bg-[#f4ee19]/10 text-[#f4ee19] border-[#f4ee19]/25', dot: 'bg-[#f4ee19]' },
  planned: { label: 'PLANNED', cls: 'bg-white/5 text-white/35 border-white/10',            dot: 'bg-white/25' },
};

function AppCard({ app }: { app: RYPApp }) {
  const sc = APP_STATUS_CONFIG[app.status];
  const primaryUrl = app.liveUrl || app.githubUrl;

  return (
    <div className="group relative bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.05] rounded-xl p-3 transition-all duration-200">
      {/* Accent bar */}
      <div
        className="absolute top-0 left-0 w-full h-[2px] rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: app.accent || '#00af51' }}
      />

      <div className="flex items-start gap-2.5">
        <span className="text-lg shrink-0 mt-0.5">{app.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-white/85 text-xs font-semibold truncate" style={{ fontFamily: 'Raleway, sans-serif' }}>
              {app.name}
            </span>
            <span className={`shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${sc.cls}`}>
              {sc.label}
            </span>
          </div>
          <p className="text-white/35 text-[11px] leading-snug truncate">{app.description}</p>
          {app.note && (
            <p className="text-white/20 text-[10px] font-mono mt-0.5 truncate">{app.note}</p>
          )}
        </div>
      </div>

      {/* Links */}
      <div className="flex items-center gap-2 mt-2.5">
        {app.liveUrl && (
          <a
            href={app.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] font-mono text-[#00af51]/70 hover:text-[#00af51] transition-colors"
          >
            <span>↗</span>
            <span className="truncate max-w-[120px]">{app.liveUrl.replace('https://', '')}</span>
          </a>
        )}
        {app.githubUrl && (
          <a
            href={app.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] font-mono text-white/30 hover:text-white/60 transition-colors"
          >
            <span>⟨/⟩</span>
            <span>{app.githubUrl.replace('https://github.com/', '')}</span>
          </a>
        )}
        {!app.liveUrl && !app.githubUrl && app.status === 'planned' && (
          <span className="text-[10px] font-mono text-white/15">not yet deployed</span>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [projects, setProjects]   = useState<Project[]>([]);
  const [tasks, setTasks]         = useState<Task[]>([]);
  const [ideas, setIdeas]         = useState<Idea[]>([]);
  const [priorities, setPriorities] = useState<DailyPriority[]>([]);
  const [time, setTime]           = useState('--:--');
  const [date, setDate]           = useState('');
  const [addingPriority, setAddingPriority] = useState(false);
  const [newPriorityText, setNewPriorityText] = useState('');
  const [captureText, setCaptureText] = useState('');
  const [captureSaved, setCaptureSaved] = useState(false);

  useEffect(() => {
    setProjects(getProjects());
    setTasks(getTasks());
    setIdeas(getIdeas());
    setPriorities(getTodayPriorities());

    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
      setDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    tick();
    const t = setInterval(tick, 30000);
    return () => clearInterval(t);
  }, []);

  function refreshPriorities() { setPriorities(getTodayPriorities()); }

  function togglePriority(p: DailyPriority) {
    savePriority({ ...p, done: !p.done });
    refreshPriorities();
  }

  function removePriority(id: string) {
    deletePriority(id);
    refreshPriorities();
  }

  function addPriority() {
    if (!newPriorityText.trim()) { setAddingPriority(false); return; }
    const today = new Date().toISOString().slice(0, 10);
    savePriority({
      id: newId(),
      title: newPriorityText.trim(),
      done: false,
      order: priorities.length,
      date: today,
    });
    setNewPriorityText('');
    setAddingPriority(false);
    refreshPriorities();
  }

  function captureIdea() {
    if (!captureText.trim()) return;
    saveIdea({
      id: newId(),
      title: captureText.trim(),
      body: '',
      status: 'raw',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setCaptureSaved(true);
    setCaptureText('');
    setIdeas(getIdeas());
    setTimeout(() => setCaptureSaved(false), 1500);
  }

  // ── Derived stats ────────────────────────────────────────────────────────
  const today = new Date().toISOString().slice(0, 10);
  const tasksDone    = tasks.filter(t => t.status === 'done').length;
  const tasksDueToday = tasks.filter(t => t.dueDate === today && t.status !== 'done').length;
  const blocked      = projects.filter(p => p.status === 'blocked');
  const attn         = projects.filter(p => p.status === 'needs-attention');
  const canAddPriority = priorities.filter(p => !p.done).length < 3;

  const liveCount    = RYP_APPS.filter(a => a.status === 'live').length;
  const builtCount   = RYP_APPS.filter(a => a.status === 'built').length;
  const plannedCount = RYP_APPS.filter(a => a.status === 'planned').length;

  return (
    <div className="page">

      {/* ── Status Bar ─────────────────────────────────────────────────── */}
      <div className="mb-4 pb-3 border-b border-white/8 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-xs">
        <span className="text-[#00af51] font-bold tabular-nums">{time}</span>
        <span className="text-white/40">{date}</span>
        <span className="text-white/40">{projects.length} projects</span>
        {tasksDueToday > 0 && (
          <span className="text-[#f4ee19]">{tasksDueToday} due today</span>
        )}
        {blocked.length > 0 && (
          <span className="text-red-400">{blocked.length} blocked</span>
        )}
        {attn.length > 0 && (
          <span className="text-[#f4ee19]">{attn.length} need attention</span>
        )}
        <Link href="/session" className="ml-auto text-[#00af51] hover:underline">
          session →
        </Link>
      </div>

      {/* ── Metrics Strip ──────────────────────────────────────────────── */}
      <div className="mb-5 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] text-white/35">
        <span>TASKS&nbsp;<span className="text-white/60">{tasks.length}</span></span>
        <span>DONE&nbsp;<span className="text-[#00af51]">{tasksDone}</span></span>
        <span>IDEAS&nbsp;<span className="text-white/60">{ideas.length}</span></span>
        <span>BLOCKED&nbsp;<span className={blocked.length > 0 ? 'text-red-400' : 'text-white/30'}>{blocked.length}</span></span>
        <span>PRIORITIES&nbsp;<span className="text-white/60">{priorities.filter(p => !p.done).length}/3</span></span>
      </div>

      {/* ── RYP Ecosystem ──────────────────────────────────────────────── */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2
              className="text-sm font-bold text-white"
              style={{ fontFamily: 'Raleway, sans-serif' }}
            >
              RYP Ecosystem
            </h2>
            <p className="font-mono text-[10px] text-white/25 mt-0.5">
              {liveCount} live · {builtCount} built · {plannedCount} planned
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00af51] inline-block" />
              <span className="text-white/30">live</span>
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f4ee19] inline-block" />
              <span className="text-white/30">built</span>
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-white/25 inline-block" />
              <span className="text-white/30">planned</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {RYP_APPS.map(app => (
            <AppCard key={app.name} app={app} />
          ))}
        </div>
      </div>

      {/* ── Main 2-col Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">

        {/* LEFT — Today's Priorities */}
        <div className="glass rounded-xl p-3">
          <div className="flex items-center justify-between mb-2.5">
            <span
              className="text-[10px] font-semibold uppercase tracking-widest text-white/35"
              style={{ fontFamily: 'Raleway, sans-serif' }}
            >
              Top 3 Today
            </span>
            {canAddPriority && (
              <button
                onClick={() => setAddingPriority(true)}
                className="font-mono text-[10px] text-[#00af51] hover:underline"
              >
                + add
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            {priorities.length === 0 && !addingPriority && (
              <button
                onClick={() => setAddingPriority(true)}
                className="font-mono text-[11px] text-white/25 w-full text-left py-0.5"
              >
                &gt; no priorities — set your top 3
              </button>
            )}

            {priorities.map((p, i) => (
              <div key={p.id} className="flex items-center gap-2 group">
                <span className="font-mono text-[10px] text-white/20 w-3 shrink-0 tabular-nums">{i + 1}</span>
                <button
                  onClick={() => togglePriority(p)}
                  className={`w-3.5 h-3.5 rounded-sm border shrink-0 flex items-center justify-center transition-all ${
                    p.done ? 'bg-[#00af51] border-[#00af51]' : 'border-white/25 hover:border-[#00af51]'
                  }`}
                >
                  {p.done && <span className="text-black text-[8px] font-bold leading-none">✓</span>}
                </button>
                <span className={`flex-1 font-mono text-[11px] leading-tight ${p.done ? 'line-through text-white/20' : 'text-white/75'}`}>
                  {p.title}
                </span>
                <button
                  onClick={() => removePriority(p.id)}
                  className="text-white/10 hover:text-red-400 text-base leading-none opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                >
                  ×
                </button>
              </div>
            ))}

            {addingPriority && (
              <div className="flex items-center gap-2 pt-0.5">
                <span className="font-mono text-[10px] text-[#00af51] shrink-0">&gt;</span>
                <input
                  autoFocus
                  value={newPriorityText}
                  onChange={e => setNewPriorityText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') addPriority();
                    if (e.key === 'Escape') { setAddingPriority(false); setNewPriorityText(''); }
                  }}
                  placeholder="priority..."
                  className="flex-1 bg-transparent font-mono text-[11px] text-white outline-none placeholder:text-white/20"
                />
                <button onClick={addPriority} className="font-mono text-[10px] text-[#00af51] shrink-0">↵</button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Project Status */}
        <div className="glass rounded-xl p-3">
          <div className="flex items-center justify-between mb-2.5">
            <span
              className="text-[10px] font-semibold uppercase tracking-widest text-white/35"
              style={{ fontFamily: 'Raleway, sans-serif' }}
            >
              Projects
            </span>
            <Link href="/projects" className="font-mono text-[10px] text-[#00af51] hover:underline">
              all →
            </Link>
          </div>

          <div className="space-y-2">
            {projects.map(p => {
              const total = p.tasks.length;
              const done  = p.tasks.filter(t => t.status === 'done').length;
              const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
              const dot   = STATUS_DOT[p.status];
              const tag   = STATUS_TAG[p.status];

              return (
                <Link key={p.id} href={`/projects/${p.id}`} className="block group">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dot }} />
                    <span className="flex-1 text-xs font-semibold text-white/70 group-hover:text-white transition-colors truncate">
                      {p.name}
                    </span>
                    <span className="font-mono text-[9px] shrink-0" style={{ color: dot }}>{tag}</span>
                    {p.dueDate && (
                      <span className="font-mono text-[9px] text-white/25 shrink-0">
                        {new Date(p.dueDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                  {total > 0 ? (
                    <div className="ml-3.5 flex items-center gap-1.5">
                      <div className="flex-1 h-px bg-white/8 overflow-hidden">
                        <div className="h-full" style={{ width: `${pct}%`, background: p.color }} />
                      </div>
                      <span className="font-mono text-[9px] text-white/20 tabular-nums">{done}/{total}</span>
                    </div>
                  ) : (
                    <p className="ml-3.5 font-mono text-[10px] text-white/25 truncate">
                      {p.nextAction}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Quick Capture ──────────────────────────────────────────────── */}
      <div className="mb-3 glass rounded-xl px-3 py-2 flex items-center gap-2">
        <span className="font-mono text-[10px] text-[#00af51] shrink-0 select-none">
          {captureSaved ? '✓ saved' : '> idea'}
        </span>
        <input
          value={captureText}
          onChange={e => setCaptureText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') captureIdea(); }}
          placeholder="capture before it disappears..."
          className="flex-1 bg-transparent font-mono text-[11px] text-white/65 outline-none placeholder:text-white/20"
        />
        {captureText && (
          <button
            onClick={captureIdea}
            className="font-mono text-[10px] text-[#00af51] shrink-0"
          >
            ↵ save
          </button>
        )}
      </div>

      {/* ── Deploy Feed ───────────────────────────────────────────────── */}
      <div className="mb-3 glass rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30" style={{ fontFamily: 'Raleway, sans-serif' }}>
            Recent Deploys
          </span>
          <span className="font-mono text-[9px] text-white/20">live from Vercel</span>
        </div>
        <div className="space-y-1.5">
          {RECENT_DEPLOYS.map((d, i) => {
            const statusIcon = d.status === 'success' ? '●' : d.status === 'building' ? '◌' : '✕';
            const statusColor = d.status === 'success' ? '#00af51' : d.status === 'building' ? '#f4ee19' : '#ef4444';
            return (
              <a key={i} href={d.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
                <span className="font-mono text-[10px] shrink-0" style={{ color: statusColor }}>{statusIcon}</span>
                <span className="font-mono text-[10px] text-white/50 shrink-0 w-24 truncate group-hover:text-white/70 transition-colors">{d.project}</span>
                <span className="font-mono text-[10px] text-white/25 truncate flex-1">{d.commit}</span>
                <span className="font-mono text-[9px] text-white/15 shrink-0">{d.time}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* ── Quick Links ────────────────────────────────────────────────── */}
      <div className="mb-3">
        <div
          className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-2"
          style={{ fontFamily: 'Raleway, sans-serif' }}
        >
          Links
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
          {QUICK_LINKS.map(({ name, url }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] text-white/45 hover:text-[#00af51] border border-white/6 hover:border-[#00af51]/20 rounded px-2 py-1.5 truncate transition-colors"
            >
              {name}
            </a>
          ))}
        </div>
      </div>

      {/* ── Activity Feed ──────────────────────────────────────────────── */}
      <div className="glass rounded-xl p-3">
        <div
          className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-2.5"
          style={{ fontFamily: 'Raleway, sans-serif' }}
        >
          Next Actions
        </div>
        <div className="space-y-1.5">
          {projects
            .filter(p => p.nextAction)
            .map(p => (
              <Link key={p.id} href={`/projects/${p.id}`} className="flex items-start gap-2 group">
                <span className="font-mono text-[10px] mt-0.5 shrink-0" style={{ color: STATUS_DOT[p.status] }}>▶</span>
                <span className="font-mono text-[10px] text-white/45 shrink-0 group-hover:text-white/70 transition-colors w-20 truncate">
                  {p.name}
                </span>
                <span className="font-mono text-[10px] text-white/30 truncate group-hover:text-white/50 transition-colors">
                  {p.nextAction}
                </span>
              </Link>
            ))}
          <div className="flex items-center gap-2 pt-1">
            <span className="font-mono text-[10px] text-[#00af51]">$</span>
            <span className="font-mono text-[10px] text-[#00af51] animate-blink">_</span>
          </div>
        </div>
      </div>

    </div>
  );
}
