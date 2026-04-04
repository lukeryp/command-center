'use client';
import { useState, useEffect } from 'react';
import { DailyPriority } from '@/lib/types';
import { getTodayPriorities, savePriority, deletePriority, newId } from '@/lib/store';

export default function PriorityStack() {
  const [priorities, setPriorities] = useState<DailyPriority[]>([]);
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState('');

  useEffect(() => { setPriorities(getTodayPriorities()); }, []);

  function refresh() { setPriorities(getTodayPriorities()); }

  function toggle(p: DailyPriority) {
    savePriority({ ...p, done: !p.done });
    refresh();
  }

  function remove(id: string) {
    deletePriority(id);
    refresh();
  }

  function add() {
    if (!newText.trim()) { setAdding(false); return; }
    const today = new Date().toISOString().slice(0, 10);
    savePriority({
      id: newId(),
      title: newText.trim(),
      done: false,
      order: priorities.length,
      date: today,
    });
    setNewText('');
    setAdding(false);
    refresh();
  }

  const canAdd = priorities.filter(p => !p.done).length < 3;

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-semibold text-sm uppercase tracking-widest opacity-50">
          Today&apos;s Top 3
        </h2>
        {canAdd && (
          <button
            onClick={() => setAdding(true)}
            className="text-[#00af51] text-sm font-medium"
          >
            + Add
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {priorities.length === 0 && !adding && (
          <div className="text-center py-6 text-white/30 text-sm">
            No priorities set for today.<br />
            <button onClick={() => setAdding(true)} className="text-[#00af51] mt-1">
              Set your top 3 →
            </button>
          </div>
        )}

        {priorities.map((p, i) => (
          <div
            key={p.id}
            className={`flex items-center gap-3 bg-white/5 border rounded-xl px-4 py-3 transition-all ${
              p.done ? 'border-white/5 opacity-40' : 'border-white/10'
            }`}
          >
            <span className="text-white/30 text-xs font-bold w-4 shrink-0">{i + 1}</span>
            <button
              onClick={() => toggle(p)}
              className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                p.done
                  ? 'bg-[#00af51] border-[#00af51]'
                  : 'border-white/30 hover:border-[#00af51]'
              }`}
            >
              {p.done && <span className="text-black text-xs font-bold">✓</span>}
            </button>
            <span className={`flex-1 text-sm font-medium ${p.done ? 'line-through text-white/30' : 'text-white'}`}>
              {p.title}
            </span>
            <button
              onClick={() => remove(p.id)}
              className="text-white/20 hover:text-red-400 text-lg leading-none transition-colors"
            >
              ×
            </button>
          </div>
        ))}

        {adding && (
          <div className="flex items-center gap-2 bg-white/8 border border-[#00af51]/40 rounded-xl px-4 py-3">
            <input
              autoFocus
              value={newText}
              onChange={e => setNewText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') add(); if (e.key === 'Escape') setAdding(false); }}
              placeholder="What's the priority?"
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/30"
            />
            <button onClick={add} className="text-[#00af51] font-semibold text-sm">Done</button>
          </div>
        )}
      </div>
    </section>
  );
}
