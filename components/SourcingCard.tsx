'use client';
import { useState } from 'react';
import { SourcingProject, SourcingStatus, SourcingPriority } from '@/lib/sourcing-data';

const STATUS_CONFIG: Record<SourcingStatus, { label: string; class: string }> = {
  'active':         { label: 'ACTIVE',          class: 'bg-[#00af51]/15 text-[#00af51] border-[#00af51]/30' },
  'reorder-ready':  { label: 'REORDER READY',   class: 'bg-[#00af51]/20 text-[#00af51] border-[#00af51]/50' },
  'nda-stage':      { label: 'NDA STAGE',        class: 'bg-violet-500/15 text-violet-300 border-violet-500/30' },
  'offer-received': { label: 'OFFER RECEIVED',  class: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' },
  'quote-received': { label: 'QUOTE RECEIVED',  class: 'bg-[#f4ee19]/15 text-[#f4ee19] border-[#f4ee19]/30' },
  'stalled':        { label: 'STALLED',          class: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
  'completed':      { label: 'COMPLETED',        class: 'bg-white/8 text-white/50 border-white/15' },
  'no-order':       { label: 'NO ORDER',         class: 'bg-white/8 text-white/40 border-white/12' },
  'no-engagement':  { label: 'NO ENGAGEMENT',    class: 'bg-white/5 text-white/30 border-white/10' },
};

const PRIORITY_CONFIG: Record<SourcingPriority, { dot: string; label: string }> = {
  high:   { dot: 'bg-red-400',    label: 'HIGH' },
  medium: { dot: 'bg-[#f4ee19]',  label: 'MED' },
  low:    { dot: 'bg-white/30',   label: 'LOW' },
};

interface Props {
  project: SourcingProject;
  index?: number;
}

export default function SourcingCard({ project, index = 0 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[project.status];
  const priority = PRIORITY_CONFIG[project.priority];
  const isKeyStrategic = project.category === 'key-strategic';

  return (
    <div
      className="animate-fade-up"
      style={{ animationDelay: `${index * 55}ms` }}
    >
      <div
        className={`relative bg-white/5 border rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-200 hover:bg-white/8 ${
          isKeyStrategic
            ? 'border-[#00af51]/25 hover:border-[#00af51]/40'
            : 'border-white/10 hover:border-white/20'
        }`}
      >
        {/* Key strategic accent glow */}
        {isKeyStrategic && (
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-8 blur-2xl pointer-events-none bg-[#00af51]" />
        )}

        {/* Priority strip */}
        <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${priority.dot}`} />

        <div className="p-4 pl-5">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 mt-0.5 ${priority.dot}`} />
              <h3 className="text-white font-semibold text-base leading-tight truncate" style={{ fontFamily: 'Raleway, sans-serif' }}>
                {project.name}
              </h3>
            </div>
            <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border tracking-wide ${status.class}`}>
              {status.label}
            </span>
          </div>

          {/* Supplier info */}
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mb-2">
            {project.contact && (
              <span className="text-white/50 text-xs">
                <span className="text-white/25">Contact</span> {project.contact}
              </span>
            )}
            {project.factory && (
              <span className="text-white/40 text-xs truncate">
                <span className="text-white/20">Factory</span> {project.factory}
              </span>
            )}
          </div>

          {/* Product */}
          <p className="text-white/35 text-xs mb-2.5">{project.product}</p>

          {/* Pricing + last contact row */}
          {(project.pricing || project.lastContact) && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2.5">
              {project.pricing && (
                <span className="text-[#00af51] text-xs font-medium">
                  {project.pricing}
                </span>
              )}
              {project.lastContact && (
                <span className="text-white/30 text-xs">
                  Last contact: {project.lastContact}
                </span>
              )}
            </div>
          )}

          {/* Next steps */}
          {project.nextSteps && (
            <p className="text-white/55 text-sm leading-snug mb-3">
              <span className="text-[#00af51] font-medium">→</span> {project.nextSteps}
            </p>
          )}

          {/* Notes warning */}
          {project.notes && (
            <div className="flex items-start gap-1.5 bg-orange-500/8 border border-orange-500/20 rounded-xl px-3 py-2 mb-3">
              <span className="text-orange-400 text-xs leading-relaxed">⚠ {project.notes}</span>
            </div>
          )}

          {/* Actions row */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              {project.isAlibaba && (
                <a
                  href="https://message.alibaba.com/message/messenger.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/12 border border-orange-500/25 text-orange-400 text-xs font-medium hover:bg-orange-500/20 transition-all active:scale-95"
                  onClick={e => e.stopPropagation()}
                >
                  <span className="text-[10px]">▲</span>
                  Alibaba
                </a>
              )}
              {project.ndaDocUrl && (
                <a
                  href={project.ndaDocUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-violet-500/12 border border-violet-500/25 text-violet-300 text-xs font-medium hover:bg-violet-500/20 transition-all active:scale-95"
                  onClick={e => e.stopPropagation()}
                >
                  NDA Doc ↗
                </a>
              )}
            </div>

            {project.conversationSummary && (
              <button
                onClick={() => setExpanded(v => !v)}
                className="flex items-center gap-1 text-white/40 hover:text-white/70 text-xs transition-all"
              >
                {expanded ? 'Hide' : 'Details'}
                <span className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>▾</span>
              </button>
            )}
          </div>
        </div>

        {/* Expanded detail */}
        {expanded && project.conversationSummary && (
          <div className="border-t border-white/8 px-5 py-4 bg-white/3">
            <p className="text-white/25 text-[10px] font-semibold uppercase tracking-widest mb-2">Conversation History</p>
            <p className="text-white/55 text-sm leading-relaxed">{project.conversationSummary}</p>
          </div>
        )}
      </div>
    </div>
  );
}
