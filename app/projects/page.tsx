'use client';
import { useState, useEffect } from 'react';
import { getProjects, getTasks } from '@/lib/store';
import { Project, ProjectStatus, ProjectCategory, Task } from '@/lib/types';
import { useAppContext } from '@/lib/app-context';
import Link from 'next/link';

const STATUS_CONFIG: Record<ProjectStatus, { label: string; dot: string; cls: string }> = {
  'on-track':        { label: 'On Track',       dot: 'bg-[#00af51]', cls: 'bg-[#00af51]/15 text-[#00af51] border-[#00af51]/30' },
  'needs-attention': { label: 'Needs Attention', dot: 'bg-[#f4ee19]', cls: 'bg-[#f4ee19]/15 text-[#f4ee19] border-[#f4ee19]/30' },
  'blocked':         { label: 'Blocked',         dot: 'bg-red-500',   cls: 'bg-red-500/15 text-red-400 border-red-500/30' },
  'paused':          { label: 'Paused',          dot: 'bg-white/30',  cls: 'bg-white/8 text-white/50 border-white/15' },
  'complete':        { label: 'Complete',        dot: 'bg-[#00af51]', cls: 'bg-[#00af51]/15 text-[#00af51] border-[#00af51]/30' },
  'pending':         { label: 'Pending',         dot: 'bg-white/20',  cls: 'bg-white/5 text-white/40 border-white/10' },
};

const CATEGORIES: { key: ProjectCategory; label: string; icon: string }[] = [
  { key: 'digital-products',  label: 'Digital Products',   icon: '💻' },
  { key: 'physical-products', label: 'Physical Products',  icon: '🏭' },
  { key: 'marketing',         label: 'Marketing',          icon: '📣' },
  { key: 'operations',        label: 'Operations',         icon: '⚙️' },
  { key: 'infrastructure',    label: 'Infrastructure',     icon: '🔧' },
  { key: 'interlachen',       label: 'Interlachen (ICC)',  icon: '🏌️' },
];

function PhaseBar({ phases }: { phases: Project['phases'] }) {
  if (!phases || phases.length === 0) return null;
  const total = phases.length;
  const complete = phases.filter(p => p.status === 'complete').length;
  const active = phases.filter(p => p.status === 'on-track' || p.status === 'needs-attention').length;

  return (
    <div className="flex gap-1 items-center">
      {phases.map((phase, i) => {
        const colors: Record<string, string> = {
          'complete': 'bg-[#00af51]',
          'on-track': 'bg-[#00af51]/50',
          'needs-attention': 'bg-[#f4ee19]/50',
          'blocked': 'bg-red-500/50',
          'pending': 'bg-white/10',
          'paused': 'bg-white/10',
        };
        return (
          <div
            key={phase.id}
            className={`h-1.5 rounded-full flex-1 ${colors[phase.status] || 'bg-white/10'}`}
            title={`${phase.name}: ${phase.status}`}
          />
        );
      })}
      <span className="text-[10px] text-white/30 ml-1.5 shrink-0">{complete}/{total}</span>
    </div>
  );
}

function ProjectRow({ project, tasks, defaultExpanded }: { project: Project; tasks: Task[]; defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded || false);
  const status = STATUS_CONFIG[project.status];
  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const doneCount = projectTasks.filter(t => t.status === 'done').length;

  return (
    <div className="group">
      {/* Project header row — clickable */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-200 active:scale-[0.995]"
      >
        {/* Expand chevron */}
        <span className={`text-white/30 text-xs transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}>
          ▶
        </span>

        {/* Emoji */}
        <span className="text-xl shrink-0">{project.emoji}</span>

        {/* Name + next action */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-semibold text-sm truncate" style={{ fontFamily: 'Raleway, sans-serif' }}>
              {project.name}
            </h3>
            <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${status.cls}`}>
              {status.label}
            </span>
          </div>
          <p className="text-white/35 text-xs mt-0.5 truncate">→ {project.nextAction}</p>
        </div>

        {/* Phase progress */}
        <div className="w-28 shrink-0 hidden sm:block">
          <PhaseBar phases={project.phases} />
        </div>

        {/* Due date */}
        {project.dueDate && (
          <span className="text-white/25 text-[11px] shrink-0 hidden sm:block">
            {new Date(project.dueDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </button>

      {/* Expanded detail panel */}
      {expanded && (
        <div className="mt-1 ml-10 mr-2 mb-3 animate-fade-up">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 space-y-5">
            {/* Description */}
            {project.longDescription && (
              <p className="text-white/50 text-sm leading-relaxed">{project.longDescription}</p>
            )}

            {/* Local Path */}
            {project.localPath && (
              <div className="flex items-center gap-2">
                <span className="text-white/25 text-[10px] uppercase tracking-wider shrink-0">Local</span>
                <code className="text-[11px] text-[#00af51]/70 bg-[#00af51]/5 border border-[#00af51]/10 rounded-md px-2.5 py-1 font-mono truncate">
                  {project.localPath}
                </code>
              </div>
            )}

            {/* Key Metrics */}
            {project.keyMetrics && project.keyMetrics.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {project.keyMetrics.map((m, i) => (
                  <div key={i} className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2">
                    <div className="text-white/30 text-[10px] uppercase tracking-wider">{m.label}</div>
                    <div className="text-white font-semibold text-sm mt-0.5">{m.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Team + Stack */}
            <div className="flex flex-wrap gap-4 text-xs">
              {project.owner && (
                <div>
                  <span className="text-white/30">Owner:</span>
                  <span className="text-white/70 ml-1.5">{project.owner}</span>
                </div>
              )}
              {project.developer && (
                <div>
                  <span className="text-white/30">Developer:</span>
                  <span className="text-white/70 ml-1.5">{project.developer}</span>
                </div>
              )}
              {project.stack && project.stack.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-white/30">Stack:</span>
                  {project.stack.map(s => (
                    <span key={s} className="bg-white/[0.06] text-white/50 px-2 py-0.5 rounded-md text-[11px]">{s}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Phases */}
            {project.phases && project.phases.length > 0 && (
              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-2">Phases</div>
                {project.phases.map(phase => {
                  const ps = STATUS_CONFIG[phase.status];
                  return (
                    <PhaseDetail key={phase.id} phase={phase} statusConfig={ps} />
                  );
                })}
              </div>
            )}

            {/* Links */}
            {project.links && project.links.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.links.map((link, i) => {
                  const typeIcons: Record<string, string> = {
                    repo: '⟨/⟩', deploy: '↗', doc: '📄', figma: '🎨', spec: '📋', external: '🔗',
                  };
                  return (
                    <a
                      key={i}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white/50 hover:text-white hover:bg-white/[0.08] transition-all"
                    >
                      <span>{typeIcons[link.type] || '🔗'}</span>
                      <span>{link.label}</span>
                    </a>
                  );
                })}
              </div>
            )}

            {/* Task summary */}
            {projectTasks.length > 0 && (
              <div className="text-xs text-white/30">
                {doneCount}/{projectTasks.length} tasks complete
              </div>
            )}

            {/* Deep link */}
            <Link
              href={`/projects/${project.id}`}
              className="inline-flex items-center gap-1.5 text-[#00af51] text-xs font-medium hover:underline"
            >
              Open full project page →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function PhaseDetail({ phase, statusConfig }: { phase: NonNullable<Project['phases']>[0]; statusConfig: { label: string; dot: string; cls: string } }) {
  const [open, setOpen] = useState(phase.status === 'on-track' || phase.status === 'needs-attention');

  return (
    <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-white/[0.03] transition-all"
      >
        <span className={`text-white/25 text-[10px] transition-transform duration-150 ${open ? 'rotate-90' : ''}`}>▶</span>
        <span className={`w-2 h-2 rounded-full shrink-0 ${statusConfig.dot}`} />
        <span className="text-white/70 text-sm font-medium flex-1">{phase.name}</span>
        <span className="text-white/25 text-[11px]">{phase.items.length} items</span>
      </button>
      {open && (
        <div className="px-3.5 pb-3 pt-0.5">
          <p className="text-white/30 text-xs mb-2">{phase.description}</p>
          <div className="space-y-1">
            {phase.items.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-white/45">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  phase.status === 'complete' ? 'bg-[#00af51]' : 'bg-white/15'
                }`} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [collapsedCats, setCollapsedCats] = useState<Set<string>>(new Set());
  const { activeContext } = useAppContext();

  useEffect(() => {
    setProjects(getProjects());
    setTasks(getTasks());
  }, []);

  // Check URL params for auto-expand
  const [autoExpandProject, setAutoExpandProject] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setAutoExpandProject(params.get('p'));
    }
  }, []);

  const toggleCategory = (cat: string) => {
    setCollapsedCats(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  // Group projects by category
  const grouped = CATEGORIES.map(cat => ({
    ...cat,
    projects: projects.filter(p => p.category === cat.key),
  }));

  // Count stats
  const totalProjects = projects.length;
  const onTrack = projects.filter(p => p.status === 'on-track' || p.status === 'complete').length;
  const attention = projects.filter(p => p.status === 'needs-attention').length;
  const blocked = projects.filter(p => p.status === 'blocked').length;

  return (
    <div className="page">
      {/* Header */}
      <div className="animate-fade-up mb-6">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Raleway, sans-serif' }}>
          Projects
        </h1>
        <p className="text-white/40 text-sm mt-1">
          {totalProjects} projects across {CATEGORIES.length} categories
        </p>
        {/* Status summary pills */}
        <div className="flex gap-2 mt-3">
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[#00af51]/10 text-[#00af51] border border-[#00af51]/20">
            {onTrack} on track
          </span>
          {attention > 0 && (
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[#f4ee19]/10 text-[#f4ee19] border border-[#f4ee19]/20">
              {attention} needs attention
            </span>
          )}
          {blocked > 0 && (
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
              {blocked} blocked
            </span>
          )}
        </div>
      </div>

      {/* Category sections */}
      <div className="space-y-6">
        {grouped.map((group, gi) => {
          if (group.projects.length === 0) return null;
          const collapsed = collapsedCats.has(group.key);

          return (
            <div key={group.key} className="animate-fade-up" style={{ animationDelay: `${gi * 80}ms` }}>
              {/* Category header */}
              <button
                onClick={() => toggleCategory(group.key)}
                className="w-full text-left flex items-center gap-2.5 mb-3 group/cat"
              >
                <span className={`text-white/20 text-[10px] transition-transform duration-200 ${collapsed ? '' : 'rotate-90'}`}>
                  ▶
                </span>
                <span className="text-base">{group.icon}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-white/30 group-hover/cat:text-white/50 transition-colors">
                  {group.label}
                </span>
                <span className="text-[10px] text-white/20 ml-1">{group.projects.length}</span>
                <div className="flex-1 h-px bg-white/[0.06] ml-2" />
              </button>

              {/* Projects in category */}
              {!collapsed && (
                <div className="space-y-2 ml-1">
                  {group.projects.map(project => (
                    <ProjectRow
                      key={project.id}
                      project={project}
                      tasks={tasks}
                      defaultExpanded={autoExpandProject === project.id}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
