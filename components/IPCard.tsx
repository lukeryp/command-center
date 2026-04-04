'use client';
import { useState } from 'react';
import { IPItem, IPStatus, IPPriority, IPCategory } from '@/lib/ip-data';

const STATUS_CONFIG: Record<IPStatus, { label: string; class: string }> = {
  'draft':          { label: 'DRAFT',           class: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
  'draft-complete': { label: 'DRAFT COMPLETE',  class: 'bg-[#00af51]/15 text-[#00af51] border-[#00af51]/30' },
  'filed':          { label: 'FILED',           class: 'bg-violet-500/15 text-violet-300 border-violet-500/30' },
  'pending':        { label: 'PENDING',         class: 'bg-[#f4ee19]/15 text-[#f4ee19] border-[#f4ee19]/30' },
  'granted':        { label: 'GRANTED',         class: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' },
  'active':         { label: 'ACTIVE',          class: 'bg-[#00af51]/15 text-[#00af51] border-[#00af51]/30' },
  'registered':     { label: 'REGISTERED',      class: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' },
};

const PRIORITY_CONFIG: Record<IPPriority, { dot: string; label: string }> = {
  high:   { dot: 'bg-red-400',    label: 'HIGH' },
  medium: { dot: 'bg-[#f4ee19]',  label: 'MED' },
  low:    { dot: 'bg-white/30',   label: 'LOW' },
};

const CATEGORY_ICON: Record<IPCategory, string> = {
  'patent':       '\u{1F4DC}',
  'trademark':    '\u{2122}',
  'trade-secret': '\u{1F512}',
  'nda':          '\u{1F91D}',
  'document':     '\u{1F4C4}',
};

interface Props {
  item: IPItem;
  index?: number;
}

export default function IPCard({ item, index = 0 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[item.status];
  const priority = PRIORITY_CONFIG[item.priority];
  const isPatent = item.category === 'patent';

  return (
    <div
      className="animate-fade-up"
      style={{ animationDelay: `${index * 55}ms` }}
    >
      <div
        className={`relative bg-white/5 border rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-200 hover:bg-white/8 ${
          isPatent ? 'border-violet-500/20' : 'border-white/10'
        }`}
      >
        {/* Accent bar for patents */}
        {isPatent && (
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-500/60 via-[#00af51]/40 to-transparent" />
        )}

        {/* Main clickable area */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left px-4 py-3"
        >
          {/* Top row: icon + name + status */}
          <div className="flex items-start gap-3">
            <span className="text-lg mt-0.5 shrink-0">{CATEGORY_ICON[item.category]}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-white font-semibold text-sm truncate">{item.name}</h3>
                <span className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${status.class}`}>
                  {status.label}
                </span>
                <span className="flex items-center gap-1 shrink-0">
                  <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                  <span className="text-[10px] text-white/30 font-medium">{priority.label}</span>
                </span>
              </div>

              {/* Description */}
              <p className="text-white/40 text-xs mt-1 line-clamp-2">{item.description}</p>

              {/* Formal title if patent */}
              {item.formalTitle && (
                <p className="text-violet-300/50 text-[10px] mt-1 italic truncate">{item.formalTitle}</p>
              )}
            </div>

            {/* Expand chevron */}
            <span className={`text-white/30 text-xs transition-transform mt-1 ${expanded ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </div>
        </button>

        {/* Expanded details */}
        {expanded && (
          <div className="px-4 pb-3 border-t border-white/5 pt-3 space-y-2">
            {item.attorney && (
              <div className="flex items-center gap-2">
                <span className="text-white/25 text-[10px] uppercase tracking-wider w-16 shrink-0">Attorney</span>
                <span className="text-white/70 text-xs">{item.attorney}</span>
              </div>
            )}

            {item.docTab && (
              <div className="flex items-center gap-2">
                <span className="text-white/25 text-[10px] uppercase tracking-wider w-16 shrink-0">Doc Tab</span>
                <span className="text-white/70 text-xs">{item.docTab}</span>
              </div>
            )}

            {item.dateModified && (
              <div className="flex items-center gap-2">
                <span className="text-white/25 text-[10px] uppercase tracking-wider w-16 shrink-0">Modified</span>
                <span className="text-white/70 text-xs">{item.dateModified}</span>
              </div>
            )}

            {item.notes && (
              <div className="mt-2 p-2 bg-[#f4ee19]/5 border border-[#f4ee19]/15 rounded-lg">
                <p className="text-[#f4ee19]/70 text-[11px]">{item.notes}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 mt-3">
              {item.docUrl && (
                <a
                  href={item.docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/12 border border-violet-500/25 text-violet-300 text-[11px] font-medium hover:bg-violet-500/20 transition-all active:scale-95"
                >
                  <span>↗</span>
                  <span>Open in Drive</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
