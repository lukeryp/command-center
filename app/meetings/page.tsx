'use client';
import { useState, useEffect } from 'react';

interface ActionItem {
  text: string;
  assignee: string;
  done: boolean;
}

interface Meeting {
  id: string;
  date: string;
  title: string;
  attendees: string[];
  type: 'team' | 'coaching' | 'vendor' | 'investor' | 'planning' | 'other';
  keyTakeaways: string[];
  actionItems: ActionItem[];
  decisions: string[];
  notes: string;
  followUpDate?: string;
}

const STORAGE_KEY = 'ryp_cc_meetings';

const TYPE_CONFIG: Record<Meeting['type'], { label: string; icon: string; cls: string }> = {
  team:     { label: 'Team',     icon: '👥', cls: 'bg-[#00af51]/15 text-[#00af51] border-[#00af51]/30' },
  coaching: { label: 'Coaching', icon: '⛳', cls: 'bg-[#f4ee19]/15 text-[#f4ee19] border-[#f4ee19]/30' },
  vendor:   { label: 'Vendor',   icon: '🏭', cls: 'bg-[#8b5cf6]/15 text-[#8b5cf6] border-[#8b5cf6]/30' },
  investor: { label: 'Investor', icon: '💰', cls: 'bg-[#f97316]/15 text-[#f97316] border-[#f97316]/30' },
  planning: { label: 'Planning', icon: '📋', cls: 'bg-[#0ea5e9]/15 text-[#0ea5e9] border-[#0ea5e9]/30' },
  other:    { label: 'Other',    icon: '📌', cls: 'bg-white/8 text-white/50 border-white/15' },
};

const SEED_MEETINGS: Meeting[] = [
  {
    id: 'm1',
    date: '2026-04-04',
    title: 'RYP Red Strategy Session',
    attendees: ['Luke', 'Claude'],
    type: 'planning',
    keyTakeaways: [
      'RYP Red is a long-term competitor to 18 Birdies and DECADE',
      '32 patent claims give us a defensive moat',
      'Card scan → SSL/ESL → dashboard is the core loop for Phase 1',
      'Comprehensive data audit revealed bias, dispersion, wind models all need dashboard representation',
    ],
    actionItems: [
      { text: 'Finalize Phase 1 build spec with comprehensive data audit', assignee: 'Claude', done: true },
      { text: 'Refine physical scorecard design', assignee: 'Luke', done: false },
      { text: 'Begin Phase 1 Supabase + Vercel setup', assignee: 'Max', done: false },
    ],
    decisions: [
      'Phased approach over fast MVP',
      'Senior dev standards non-negotiable',
      'Start with 5 Interlachen players for beta',
    ],
    notes: 'Full data audit in RYP_RED_COMPREHENSIVE_DATA_AUDIT.md. Strategic build plan in RYP_RED_Strategic_Build_Plan.md.',
  },
  {
    id: 'm2',
    date: '2026-04-04',
    title: 'Content Machine & Social Strategy',
    attendees: ['Luke', 'Claude'],
    type: 'planning',
    keyTakeaways: [
      'Template #1 chosen as default for Instagram carousels',
      'Caleb VanArragon carousel approved — real statistics, not estimates',
      'Content Machine needs end-to-end automation: video → 8 platform briefs',
      'Teddy executes from generated briefs — Claude generates, Teddy designs',
    ],
    actionItems: [
      { text: 'Copy carousels to Command Center for Teddy', assignee: 'Claude', done: true },
      { text: 'Build content machine Python pipeline', assignee: 'Claude', done: false },
      { text: 'Start posting Caleb carousel on Instagram', assignee: 'Teddy', done: false },
    ],
    decisions: [
      'Python pipeline first, Command Center integration second',
      'Run content machine parallel to RYP Red development',
    ],
    notes: 'Sprint spec saved to RYP_Content_Machine_Sprint_Spec.md. ~$0.30/video, 7-day sprint.',
  },
];

function load(): Meeting[] {
  if (typeof window === 'undefined') return SEED_MEETINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_MEETINGS;
    return JSON.parse(raw);
  } catch { return SEED_MEETINGS; }
}

function save(meetings: Meeting[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<Meeting['type']>('team');
  const [newAttendees, setNewAttendees] = useState('');
  const [newTakeaways, setNewTakeaways] = useState('');
  const [newActions, setNewActions] = useState('');
  const [newDecisions, setNewDecisions] = useState('');
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => { setMeetings(load()); }, []);

  const toggle = (id: string) => {
    setExpanded(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  const toggleAction = (meetingId: string, actionIdx: number) => {
    const updated = meetings.map(m => {
      if (m.id !== meetingId) return m;
      const items = [...m.actionItems];
      items[actionIdx] = { ...items[actionIdx], done: !items[actionIdx].done };
      return { ...m, actionItems: items };
    });
    setMeetings(updated);
    save(updated);
  };

  const addMeeting = () => {
    if (!newTitle) return;
    const m: Meeting = {
      id: Date.now().toString(36),
      date: new Date().toISOString().slice(0, 10),
      title: newTitle,
      type: newType,
      attendees: newAttendees.split(',').map(s => s.trim()).filter(Boolean),
      keyTakeaways: newTakeaways.split('\n').filter(Boolean),
      actionItems: newActions.split('\n').filter(Boolean).map(t => ({ text: t, assignee: '', done: false })),
      decisions: newDecisions.split('\n').filter(Boolean),
      notes: newNotes,
    };
    const updated = [m, ...meetings];
    setMeetings(updated);
    save(updated);
    setShowForm(false);
    setNewTitle(''); setNewAttendees(''); setNewTakeaways(''); setNewActions(''); setNewDecisions(''); setNewNotes('');
  };

  const openActions = meetings.flatMap(m => m.actionItems.filter(a => !a.done).map(a => ({ ...a, meetingTitle: m.title, meetingDate: m.date })));

  return (
    <div className="page">
      <div className="animate-fade-up mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Raleway, sans-serif' }}>
              Meeting Debriefs
            </h1>
            <p className="text-white/40 text-sm mt-0.5">{meetings.length} meetings · {openActions.length} open action items</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 rounded-xl text-sm font-medium bg-[#00af51] text-black hover:bg-[#00af51]/80 transition-all">
            + Debrief
          </button>
        </div>
      </div>

      {/* Open action items strip */}
      {openActions.length > 0 && (
        <div className="mb-5 bg-[#f4ee19]/5 border border-[#f4ee19]/15 rounded-2xl p-4 animate-fade-up">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#f4ee19]/50 mb-2">Open Action Items</div>
          <div className="space-y-1.5">
            {openActions.slice(0, 8).map((a, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f4ee19]/40 shrink-0" />
                <span className="text-white/60 flex-1">{a.text}</span>
                {a.assignee && <span className="text-white/25 text-xs">{a.assignee}</span>}
                <span className="text-white/15 text-[10px]">{a.meetingDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New meeting form */}
      {showForm && (
        <div className="animate-fade-up mb-5 bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 space-y-3">
          <div className="flex gap-3">
            <input type="text" placeholder="Meeting title" value={newTitle} onChange={e => setNewTitle(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-[#00af51]/50 focus:outline-none" />
            <select value={newType} onChange={e => setNewType(e.target.value as Meeting['type'])}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none">
              {Object.entries(TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
            </select>
          </div>
          <input type="text" placeholder="Attendees (comma-separated)" value={newAttendees} onChange={e => setNewAttendees(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-[#00af51]/50 focus:outline-none" />
          <textarea placeholder="Key takeaways (one per line)" value={newTakeaways} onChange={e => setNewTakeaways(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-[#00af51]/50 focus:outline-none resize-none h-20" />
          <textarea placeholder="Action items (one per line)" value={newActions} onChange={e => setNewActions(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-[#00af51]/50 focus:outline-none resize-none h-20" />
          <textarea placeholder="Decisions made (one per line)" value={newDecisions} onChange={e => setNewDecisions(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-[#00af51]/50 focus:outline-none resize-none h-16" />
          <textarea placeholder="Additional notes" value={newNotes} onChange={e => setNewNotes(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-[#00af51]/50 focus:outline-none resize-none h-16" />
          <div className="flex gap-2 pt-1">
            <button onClick={addMeeting} className="px-4 py-2 rounded-xl text-sm font-medium bg-[#00af51] text-black">Save Debrief</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm font-medium bg-white/5 text-white/50 border border-white/10">Cancel</button>
          </div>
        </div>
      )}

      {/* Meetings list */}
      <div className="space-y-2">
        {meetings.map((m, i) => {
          const tc = TYPE_CONFIG[m.type];
          return (
            <div key={m.id} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
              <button onClick={() => toggle(m.id)}
                className="w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all">
                <span className={`text-white/25 text-[10px] transition-transform duration-200 ${expanded.has(m.id) ? 'rotate-90' : ''}`}>▶</span>
                <span className="text-lg">{tc.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-medium text-sm">{m.title}</h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tc.cls}`}>{tc.label}</span>
                  </div>
                  <p className="text-white/30 text-xs mt-0.5">{m.attendees.join(', ')} · {m.actionItems.filter(a => !a.done).length} open items</p>
                </div>
                <span className="text-white/20 text-[11px] shrink-0">{m.date}</span>
              </button>

              {expanded.has(m.id) && (
                <div className="ml-8 mr-2 mt-1 mb-2 bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 space-y-4 animate-fade-up">
                  {m.keyTakeaways.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1.5">Key Takeaways</div>
                      {m.keyTakeaways.map((t, j) => (
                        <p key={j} className="text-white/50 text-sm mb-1">• {t}</p>
                      ))}
                    </div>
                  )}
                  {m.actionItems.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1.5">Action Items</div>
                      {m.actionItems.map((a, j) => (
                        <button key={j} onClick={() => toggleAction(m.id, j)} className="flex items-center gap-2 text-sm mb-1 w-full text-left group/ai">
                          <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${a.done ? 'bg-[#00af51] border-[#00af51] text-black' : 'border-white/20 group-hover/ai:border-white/40'}`}>
                            {a.done && <span className="text-[10px]">✓</span>}
                          </span>
                          <span className={`flex-1 ${a.done ? 'text-white/25 line-through' : 'text-white/60'}`}>{a.text}</span>
                          {a.assignee && <span className="text-white/20 text-xs">{a.assignee}</span>}
                        </button>
                      ))}
                    </div>
                  )}
                  {m.decisions.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1.5">Decisions</div>
                      {m.decisions.map((d, j) => (
                        <p key={j} className="text-[#00af51]/70 text-sm mb-1">✓ {d}</p>
                      ))}
                    </div>
                  )}
                  {m.notes && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Notes</div>
                      <p className="text-white/40 text-sm">{m.notes}</p>
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
