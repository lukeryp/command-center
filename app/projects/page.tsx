'use client';
import { useState, useEffect } from 'react';
import { getProjects, getTasks } from '@/lib/store';
import { Project, ProjectStatus, Task } from '@/lib/types';
import { useAppContext } from '@/lib/app-context';
import ProjectCard from '@/components/ProjectCard';

const STATUS_FILTERS: { label: string; value: ProjectStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'On Track', value: 'on-track' },
  { label: 'Attention', value: 'needs-attention' },
  { label: 'Blocked', value: 'blocked' },
];

const CONTEXT_LABEL: Record<string, string> = {
  interlachen: 'Interlachen',
  ryp: 'RYP',
  personal: 'Personal',
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const { activeContext } = useAppContext();

  useEffect(() => {
    setProjects(getProjects());
    setTasks(getTasks());
  }, []);

  const contextFiltered = projects.filter(p => !p.context || p.context === activeContext);
  const filtered = statusFilter === 'all'
    ? contextFiltered
    : contextFiltered.filter(p => p.status === statusFilter);

  const scopedTasks = tasks.filter(t => filtered.some(p => p.id === t.projectId));
  const totalTasks = scopedTasks.length;
  const doneTasks = scopedTasks.filter(t => t.status === 'done').length;
  const overallPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="page">
      <div className="animate-fade-up mb-5">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Raleway, sans-serif' }}>
          Projects
        </h1>
        <p className="text-white/40 text-sm mt-0.5">
          {CONTEXT_LABEL[activeContext]} · {filtered.length} project{filtered.length !== 1 ? 's' : ''} · {doneTasks}/{totalTasks} tasks done
        </p>
        {totalTasks > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00af51] rounded-full transition-all duration-500"
                style={{ width: `${overallPct}%` }}
              />
            </div>
            <span className="text-xs text-white/30">{overallPct}%</span>
          </div>
        )}
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar animate-fade-up pb-1">
        {STATUS_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === f.value
                ? 'bg-[#00af51] text-black'
                : 'bg-white/8 text-white/60 hover:text-white border border-white/10'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="stagger flex flex-col gap-3">
        {filtered.map((p, i) => {
          const projectTasks = tasks.filter(t => t.projectId === p.id);
          return (
            <ProjectCard
              key={p.id}
              project={p}
              index={i}
              taskCount={projectTasks.length}
              doneCount={projectTasks.filter(t => t.status === 'done').length}
            />
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-white/30">No projects in this context</div>
        )}
      </div>
    </div>
  );
}
