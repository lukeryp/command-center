'use client';
import { useState, useMemo } from 'react';
import { IP_ITEMS, IPCategory, MASTER_PATENT_DOC_URL } from '@/lib/ip-data';
import IPCard from '@/components/IPCard';

type FilterValue = 'all' | 'patent' | 'trademark' | 'trade-secret' | 'nda' | 'document' | 'idea';

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: 'All',           value: 'all' },
  { label: 'Ideas',         value: 'idea' },
  { label: 'Patents',       value: 'patent' },
  { label: 'Trademarks',    value: 'trademark' },
  { label: 'Trade Secrets', value: 'trade-secret' },
  { label: 'NDAs',          value: 'nda' },
  { label: 'Documents',     value: 'document' },
];

const CATEGORY_LABELS: Record<IPCategory, { label: string; dot: string }> = {
  'patent':       { label: 'Patents',       dot: 'bg-violet-400' },
  'trademark':    { label: 'Trademarks',    dot: 'bg-cyan-400' },
  'trade-secret': { label: 'Trade Secrets', dot: 'bg-red-400' },
  'nda':          { label: 'NDAs',          dot: 'bg-[#f4ee19]' },
  'document':     { label: 'Documents',     dot: 'bg-white/40' },
  'idea':         { label: 'Ideas',         dot: 'bg-amber-400' },
};

export default function IPPage() {
  const [filter, setFilter] = useState<FilterValue>('all');

  const filtered = useMemo(
    () => filter === 'all' ? IP_ITEMS : IP_ITEMS.filter(item => item.category === filter),
    [filter],
  );

  const patentCount = IP_ITEMS.filter(i => i.category === 'patent').length;
  const ideaCount = IP_ITEMS.filter(i => i.category === 'idea').length;
  const draftCompleteCount = IP_ITEMS.filter(i => i.status === 'draft-complete').length;
  const highCount = IP_ITEMS.filter(i => i.priority === 'high').length;

  return (
    <div className="page">
      {/* Page header */}
      <div className="animate-fade-up mb-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Raleway, sans-serif' }}>
              Intellectual Property
            </h1>
            <div className="flex gap-3 mt-1 flex-wrap">
              <span className="text-violet-300 text-sm font-medium">{patentCount} patents</span>
              <span className="text-amber-400 text-sm">{ideaCount} ideas</span>
              <span className="text-[#00af51] text-sm">{draftCompleteCount} draft complete</span>
              <span className="text-white/40 text-sm">{highCount} high priority</span>
              <span className="text-white/30 text-sm">{IP_ITEMS.length} total</span>
            </div>
          </div>

          {/* Master patent doc button */}
          <a
            href={MASTER_PATENT_DOC_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-500/12 border border-violet-500/30 text-violet-300 text-xs font-semibold hover:bg-violet-500/20 transition-all active:scale-95"
          >
            <span>📄</span>
            <span>Patent Doc</span>
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

      {/* "All" view with sections */}
      {filter === 'all' && (
        <div className="flex flex-col gap-6">
          {(['idea', 'patent', 'trademark', 'trade-secret', 'nda', 'document'] as IPCategory[]).map(cat => {
            const items = IP_ITEMS.filter(i => i.category === cat);
            if (items.length === 0) return null;
            const config = CATEGORY_LABELS[cat];
            return (
              <section key={cat}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                  <span className="text-white/40 text-xs font-semibold uppercase tracking-widest">{config.label}</span>
                  <span className="text-white/20 text-[10px]">({items.length})</span>
                </div>
                <div className="flex flex-col gap-3">
                  {items.map((item, i) => (
                    <IPCard key={item.id} item={item} index={i} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Filtered view */}
      {filter !== 'all' && (
        <div className="flex flex-col gap-3">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-white/30 text-sm">
              No {filter.replace('-', ' ')} items
            </div>
          )}
          {filtered.map((item, i) => (
            <IPCard key={item.id} item={item} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
