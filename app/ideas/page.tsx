'use client';
import { useState, useEffect } from 'react';
import { Idea, IdeaStatus } from '@/lib/types';
import { getIdeas, saveIdea, newId } from '@/lib/store';
import IdeaCard from '@/components/IdeaCard';

const FILTERS: { label: string; value: IdeaStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Raw', value: 'raw' },
  { label: 'Developing', value: 'developing' },
  { label: 'Ready', value: 'ready' },
  { label: 'Archived', value: 'archived' },
];

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [filter, setFilter] = useState<IdeaStatus | 'all'>('all');
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  function load() { setIdeas(getIdeas()); }
  useEffect(() => { load(); }, []);

  const filtered = filter === 'all'
    ? ideas.filter(i => i.status !== 'archived')
    : ideas.filter(i => i.status === filter);

  function quickAdd() {
    if (!newTitle.trim()) { setAdding(false); return; }
    saveIdea({
      id: newId(),
      title: newTitle.trim(),
      body: '',
      status: 'raw',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setNewTitle('');
    setAdding(false);
    load();
  }

  const rawCount = ideas.filter(i => i.status === 'raw').length;
  const readyCount = ideas.filter(i => i.status === 'ready').length;

  return (
    <div className="page">
      <div className="animate-fade-up mb-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Raleway, sans-serif' }}>
            Ideas Inbox
          </h1>
          <button
            onClick={() => setAdding(true)}
            className="w-9 h-9 rounded-xl bg-[#00af51] flex items-center justify-center text-black text-xl font-bold"
          >
            +
          </button>
        </div>
        <div className="flex gap-3 mt-1">
          {rawCount > 0 && (
            <span className="text-white/40 text-sm">{rawCount} raw</span>
          )}
          {readyCount > 0 && (
            <span className="text-[#00af51] text-sm font-medium">{readyCount} ready to act</span>
          )}
        </div>
      </div>

      {/* Quick add */}
      {adding && (
        <div className="mb-4 animate-fade-up">
          <div className="flex items-center gap-2 bg-white/8 border border-[#00af51]/40 rounded-2xl px-4 py-3">
            <input
              autoFocus
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') quickAdd(); if (e.key === 'Escape') setAdding(false); }}
              placeholder="What's the idea?"
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/30"
            />
            <button onClick={quickAdd} className="text-[#00af51] font-semibold text-sm">Save</button>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1 animate-fade-up" style={{ animationDelay: '40ms' }}>
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`shrink-0 px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
              filter === f.value
                ? 'bg-[#00af51] text-black'
                : 'bg-white/8 text-white/60 border border-white/10 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Ideas list */}
      <div className="stagger flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-white/30">
            {filter === 'all' ? 'No ideas yet. Capture something!' : `No ${filter} ideas`}
          </div>
        )}
        {filtered.map(idea => (
          <IdeaCard key={idea.id} idea={idea} onUpdate={load} />
        ))}
      </div>
    </div>
  );
}
