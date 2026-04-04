'use client';
import { useState } from 'react';
import { Idea, IdeaStatus } from '@/lib/types';
import { saveIdea, deleteIdea } from '@/lib/store';

const STATUS_CONFIG: Record<IdeaStatus, { label: string; class: string }> = {
  raw:        { label: 'Raw',        class: 'bg-white/8 text-white/50 border-white/15' },
  developing: { label: 'Developing', class: 'bg-[#f4ee19]/15 text-[#f4ee19] border-[#f4ee19]/30' },
  ready:      { label: 'Ready',      class: 'bg-[#00af51]/15 text-[#00af51] border-[#00af51]/30' },
  archived:   { label: 'Archived',   class: 'bg-white/5 text-white/25 border-white/8' },
};

const STATUS_ORDER: IdeaStatus[] = ['raw', 'developing', 'ready', 'archived'];

interface Props {
  idea: Idea;
  onUpdate: () => void;
}

export default function IdeaCard({ idea, onUpdate }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [body, setBody] = useState(idea.body);
  const status = STATUS_CONFIG[idea.status];

  function advanceStatus() {
    const next = STATUS_ORDER[(STATUS_ORDER.indexOf(idea.status) + 1) % STATUS_ORDER.length];
    saveIdea({ ...idea, status: next });
    onUpdate();
  }

  function saveBody() {
    saveIdea({ ...idea, body: body.trim() });
    onUpdate();
  }

  function remove() {
    if (confirm('Delete this idea?')) { deleteIdea(idea.id); onUpdate(); }
  }

  return (
    <div className={`bg-white/5 border border-white/8 rounded-2xl overflow-hidden transition-all ${idea.status === 'archived' ? 'opacity-40' : ''}`}>
      {/* Header */}
      <button
        className="w-full flex items-start gap-3 px-4 py-3 text-left"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm leading-snug">{idea.title}</p>
          <p className="text-white/30 text-xs mt-0.5">
            {new Date(idea.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${status.class}`}>
            {status.label}
          </span>
          <span className="text-white/30 text-sm">{expanded ? '↑' : '↓'}</span>
        </div>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-white/5 pt-3 flex flex-col gap-3">
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            onBlur={saveBody}
            placeholder="Add notes, context, next steps…"
            rows={4}
            className="w-full bg-white/5 border border-white/8 rounded-xl px-3 py-2.5 text-white/80 text-sm outline-none resize-none placeholder:text-white/25 focus:border-[#00af51]/40"
          />
          <div className="flex gap-2">
            <button
              onClick={advanceStatus}
              className="flex-1 py-2 rounded-xl bg-white/8 border border-white/10 text-white/60 text-xs font-medium hover:text-white transition-colors"
            >
              Move to: {STATUS_CONFIG[STATUS_ORDER[(STATUS_ORDER.indexOf(idea.status) + 1) % STATUS_ORDER.length]].label} →
            </button>
            <button
              onClick={remove}
              className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
