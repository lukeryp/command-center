'use client';
import { useState, useEffect } from 'react';
import { getProjects } from '@/lib/store';
import { Project, ProjectStatus } from '@/lib/types';
import ProjectCard from '@/components/ProjectCard';

const FILTERS: { label: string; value: ProjectStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'On Track', value: 'on-track' },
  { label: 'Attention', value: 'needs-attention' },
  { label: 'Blocked', value: 'blocked' },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<ProjectStatus | 'all'>('all');

  useEffect(() => { setProjects(getProjects()); }, []);

  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter);

  return (
    <div className="page">
      <h1
        className="text-2xl font-bold text-white mb-4 animate-fade-up"
        style={{ fontFamily: 'Raleway, sans-serif' }}
      >
        Projects
      </h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar animate-fade-up pb-1">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f.value
                ? 'bg-[#00af51] text-black'
                : 'bg-white/8 text-white/60 hover:text-white border border-white/10'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="stagger flex flex-col gap-3">
        {filtered.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-white/30">No projects in this category</div>
        )}
      </div>
    </div>
  );
}
