'use client';
import { useState, useMemo } from 'react';
import { SOURCING_PROJECTS, SourcingCategory, SourcingStatus } from '@/lib/sourcing-data';
import SourcingCard from '@/components/SourcingCard';

type FilterValue = 'all' | 'key-strategic' | 'active' | 'stalled' | 'completed';

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: 'All', value: 'all' },
  { label: 'Key Strategic', value: 'key-strategic' },
  { label: 'Active', value: 'active' },
  { label: 'Stalled', value: 'stalled' },
  { label: 'Completed', value: 'completed' },
];

const ACTIVE_STATUSES = new Set<SourcingStatus>([
  'active', 'nda-stage', 'offer-received', 'quote-received', 'reorder-ready',
]);
const STALLED_STATUSES = new Set<SourcingStatus>([
  'stalled', 'no-order', 'no-engagement',
]);

function matchesFilter(status: SourcingStatus, category: SourcingCategory, filter: FilterValue): boolean {
  switch (filter) {
    case 'all':            return true;
    case 'key-strategic':  return category === 'key-strategic';
    case 'active':         return ACTIVE_STATUSES.has(status);
    case 'stalled':        return STALLED_STATUSES.has(status);
    case 'completed':      return status === 'completed';
  }
}

export default function SourcingPage() {
  const [filter, setFilter] = useState<FilterValue>('all');

  const filtered = useMemo(
    () => SOURCING_PROJECTS.filter(p => matchesFilter(p.status, p.category, filter)),
    [filter],
  );

  const activeCount = SOURCING_PROJECTS.filter(p => ACTIVE_STATUSES.has(p.status)).length;
  const highCount = SOURCING_PROJECTS.filter(p => p.priority === 'high').length;

  return (
    <div className="page">
      {/* Page header */}
      <div className="animate-fade-up mb-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Raleway, sans-serif' }}>
              Sourcing
            </h1>
            <div className="flex gap-3 mt-1">
              <span className="text-[#00af51] text-sm font-medium">{activeCount} active</span>
              <span className="text-white/40 text-sm">{highCount} high priority</span>
              <span className="text-white/30 text-sm">{SOURCING_PROJECTS.length} total</span>
            </div>
          </div>

          {/* Global Alibaba messenger button */}
          <a
            href="https://message.alibaba.com/message/messenger.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-500/12 border border-orange-500/30 text-orange-400 text-xs font-semibold hover:bg-orange-500/20 transition-all active:scale-95"
          >
            <span>▲</span>
            <span>Alibaba</span>
          </a>
        </div>
      </div>

      {/* Filter tabs */}
      <div
        className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-1 animate-fade-up"
        style={{ animationDelay: '40ms' }}
      >
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

      {/* Section labels within "All" view */}
      {filter === 'all' && (
        <div className="flex flex-col gap-6">
          {/* Key Strategic */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00af51]" />
              <span className="text-white/40 text-xs font-semibold uppercase tracking-widest">Key Strategic</span>
            </div>
            <div className="flex flex-col gap-3">
              {SOURCING_PROJECTS.filter(p => p.category === 'key-strategic').map((p, i) => (
                <SourcingCard key={p.id} project={p} index={i} />
              ))}
            </div>
          </section>

          {/* Alibaba Projects */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              <span className="text-white/40 text-xs font-semibold uppercase tracking-widest">Alibaba Projects</span>
            </div>
            <div className="flex flex-col gap-3">
              {SOURCING_PROJECTS.filter(p => p.category === 'alibaba').map((p, i) => (
                <SourcingCard key={p.id} project={p} index={i + 4} />
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Filtered view */}
      {filter !== 'all' && (
        <div className="flex flex-col gap-3">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-white/30 text-sm">
              No {filter} projects
            </div>
          )}
          {filtered.map((p, i) => (
            <SourcingCard key={p.id} project={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
