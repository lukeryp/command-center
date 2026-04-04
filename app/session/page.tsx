'use client';
import { useState, useEffect } from 'react';
import { getProjects, getTodayPriorities, getSessions, saveSession, newId } from '@/lib/store';
import { Project, SessionLog } from '@/lib/types';

function getSessionType(): 'morning' | 'evening' {
  const h = new Date().getHours();
  return h >= 6 && h < 15 ? 'morning' : 'evening';
}

export default function SessionPage() {
  const [sessionType, setSessionType] = useState<'morning' | 'evening'>('morning');
  const [projects, setProjects] = useState<Project[]>([]);
  const [priorities, setPriorities] = useState<string[]>(['', '', '']);
  const [notes, setNotes] = useState('');
  const [completions, setCompletions] = useState<string[]>([]);
  const [newCompletion, setNewCompletion] = useState('');
  const [saved, setSaved] = useState(false);
  const [pastSessions, setPastSessions] = useState<SessionLog[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setSessionType(getSessionType());
    setProjects(getProjects());
    const todayPs = getTodayPriorities().map(p => p.title);
    if (todayPs.length > 0) setPriorities([...todayPs, '', ''].slice(0, 3));
    setPastSessions(getSessions().slice(0, 10));
  }, []);

  function addCompletion() {
    if (!newCompletion.trim()) return;
    setCompletions(c => [...c, newCompletion.trim()]);
    setNewCompletion('');
  }

  function saveThisSession() {
    const session: SessionLog = {
      id: newId(),
      type: sessionType,
      date: new Date().toISOString().slice(0, 10),
      completions,
      priorities: priorities.filter(Boolean),
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };
    saveSession(session);
    setSaved(true);
    setPastSessions(getSessions().slice(0, 10));
  }

  const isMorning = sessionType === 'morning';

  return (
    <div className="page">
      {/* Header */}
      <div className="animate-fade-up mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#00af51] flex items-center justify-center text-xl">
            {isMorning ? '☀️' : '🌙'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Raleway, sans-serif' }}>
              {isMorning ? 'Morning Review' : 'Evening Wrap-up'}
            </h1>
            <p className="text-white/40 text-sm">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Toggle session type */}
        <div className="flex gap-2 mt-2">
          {(['morning', 'evening'] as const).map(t => (
            <button
              key={t}
              onClick={() => setSessionType(t)}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all capitalize ${
                sessionType === t ? 'bg-[#00af51] text-black' : 'bg-white/8 text-white/50 border border-white/10'
              }`}
            >
              {t === 'morning' ? '☀️ Morning' : '🌙 Evening'}
            </button>
          ))}
        </div>
      </div>

      {/* Morning: Set priorities */}
      {isMorning && (
        <div className="glass rounded-2xl p-5 mb-4 animate-fade-up" style={{ animationDelay: '60ms' }}>
          <h2 className="text-white font-semibold mb-3" style={{ fontFamily: 'Raleway, sans-serif' }}>
            Set Today&apos;s Top 3
          </h2>
          {[0, 1, 2].map(i => (
            <div key={i} className="flex items-center gap-3 mb-2">
              <span className="text-white/30 text-sm font-bold w-4">{i + 1}</span>
              <input
                value={priorities[i]}
                onChange={e => {
                  const next = [...priorities];
                  next[i] = e.target.value;
                  setPriorities(next);
                }}
                placeholder={`Priority ${i + 1}…`}
                className="flex-1 bg-white/6 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none placeholder:text-white/25 focus:border-[#00af51]/50"
              />
            </div>
          ))}
        </div>
      )}

      {/* Project check-in */}
      <div className="glass rounded-2xl p-5 mb-4 animate-fade-up" style={{ animationDelay: '100ms' }}>
        <h2 className="text-white font-semibold mb-3" style={{ fontFamily: 'Raleway, sans-serif' }}>
          {isMorning ? 'Project Pulse' : 'Project Review'}
        </h2>
        <div className="flex flex-col gap-2">
          {projects.map(p => (
            <div key={p.id} className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2">
                <span>{p.emoji}</span>
                <span className="text-white text-sm font-medium">{p.name}</span>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                p.status === 'on-track' ? 'text-[#00af51] bg-[#00af51]/10' :
                p.status === 'needs-attention' ? 'text-[#f4ee19] bg-[#f4ee19]/10' :
                p.status === 'blocked' ? 'text-red-400 bg-red-500/10' :
                'text-white/30 bg-white/5'
              }`}>
                {p.status.replace('-', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Evening: What got done */}
      {!isMorning && (
        <div className="glass rounded-2xl p-5 mb-4 animate-fade-up" style={{ animationDelay: '100ms' }}>
          <h2 className="text-white font-semibold mb-3" style={{ fontFamily: 'Raleway, sans-serif' }}>
            What Got Done Today
          </h2>
          {completions.map((c, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5">
              <span className="text-[#00af51] text-sm">✓</span>
              <span className="text-white/70 text-sm">{c}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 mt-2">
            <input
              value={newCompletion}
              onChange={e => setNewCompletion(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addCompletion(); }}
              placeholder="Add a completion…"
              className="flex-1 bg-white/6 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none placeholder:text-white/25 focus:border-[#00af51]/50"
            />
            <button onClick={addCompletion} className="text-[#00af51] font-semibold text-sm px-2">+</button>
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="glass rounded-2xl p-5 mb-5 animate-fade-up" style={{ animationDelay: '140ms' }}>
        <h2 className="text-white font-semibold mb-3" style={{ fontFamily: 'Raleway, sans-serif' }}>
          {isMorning ? 'Morning Notes' : 'Capture Loose Threads'}
        </h2>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder={isMorning ? 'Intentions, energy level, blockers to clear…' : 'Ideas, threads to pick up tomorrow, things to remember…'}
          rows={4}
          className="w-full bg-white/6 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none resize-none placeholder:text-white/25 focus:border-[#00af51]/50"
        />
      </div>

      {/* Save */}
      <button
        onClick={saveThisSession}
        disabled={saved}
        className={`w-full py-4 rounded-2xl font-bold text-base transition-all mb-6 animate-fade-up ${
          saved
            ? 'bg-[#00af51]/30 text-[#00af51] cursor-default'
            : 'bg-[#00af51] text-black hover:bg-[#00c45a] active:scale-[0.98]'
        }`}
        style={{ animationDelay: '160ms' }}
      >
        {saved ? '✓ Session Saved' : `Save ${isMorning ? 'Morning' : 'Evening'} Session`}
      </button>

      {/* History */}
      {pastSessions.length > 0 && (
        <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
          <button
            onClick={() => setShowHistory(h => !h)}
            className="text-white/30 text-sm w-full text-center mb-3"
          >
            {showHistory ? 'Hide' : 'Show'} past sessions ({pastSessions.length})
          </button>
          {showHistory && (
            <div className="flex flex-col gap-2">
              {pastSessions.map(s => (
                <div key={s.id} className="glass rounded-xl px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm font-medium capitalize">
                      {s.type === 'morning' ? '☀️' : '🌙'} {s.type} — {s.date}
                    </span>
                    <span className="text-white/30 text-xs">{s.priorities.length} priorities</span>
                  </div>
                  {s.notes && <p className="text-white/40 text-xs line-clamp-2">{s.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
