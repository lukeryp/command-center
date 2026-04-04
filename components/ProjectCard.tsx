'use client';
import Link from 'next/link';
import { Project, ProjectStatus } from '@/lib/types';

const STATUS_CONFIG: Record<ProjectStatus, { label: string; class: string }> = {
  'on-track':        { label: 'On Track',        class: 'bg-[#00af51]/15 text-[#00af51] border-[#00af51]/30' },
  'needs-attention': { label: 'Needs Attention',  class: 'bg-[#f4ee19]/15 text-[#f4ee19] border-[#f4ee19]/30' },
  'blocked':         { label: 'Blocked',           class: 'bg-red-500/15 text-red-400 border-red-500/30' },
  'paused':          { label: 'Paused',            class: 'bg-white/8 text-white/50 border-white/15' },
  'complete':        { label: 'Complete',          class: 'bg-[#00af51]/15 text-[#00af51] border-[#00af51]/30' },
};

interface Props {
  project: Project;
  index?: number;
  taskCount?: number;
  doneCount?: number;
}

export default function ProjectCard({ project, index = 0, taskCount, doneCount }: Props) {
  const status = STATUS_CONFIG[project.status];
  // Prefer externally-passed counts (from store) over embedded project.tasks
  const total = taskCount ?? project.tasks.length;
  const done = doneCount ?? project.tasks.filter(t => t.status === 'done').length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <Link
      href={`/projects/${project.id}`}
      className="block group"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm transition-all duration-200 hover:bg-white/8 hover:border-white/20 active:scale-[0.98] overflow-hidden">
        {/* Accent glow */}
        <div
          className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 blur-2xl pointer-events-none"
          style={{ background: project.color }}
        />

        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{project.emoji}</span>
            <div>
              <h3 className="text-white font-semibold text-base leading-tight" style={{ fontFamily: 'Raleway, sans-serif' }}>
                {project.name}
              </h3>
              {project.dueDate && (
                <p className="text-white/30 text-xs mt-0.5">
                  Due {new Date(project.dueDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              )}
            </div>
          </div>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${status.class}`}>
            {status.label}
          </span>
        </div>

        {/* Next action */}
        <p className="text-white/50 text-sm leading-snug mb-3 line-clamp-2">
          → {project.nextAction}
        </p>

        {/* Task progress */}
        {total > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${pct}%`, background: project.color }}
              />
            </div>
            <span className="text-white/30 text-xs">{done}/{total}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
