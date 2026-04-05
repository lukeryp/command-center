'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { getProject, saveProject, getTasks } from '@/lib/store';
import { Project, ProjectStatus, Task } from '@/lib/types';
import TaskList from '@/components/TaskList';

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'on-track',        label: 'On Track' },
  { value: 'needs-attention', label: 'Needs Attention' },
  { value: 'blocked',         label: 'Blocked' },
  { value: 'paused',          label: 'Paused' },
  { value: 'complete',        label: 'Complete' },
];

const STATUS_COLOR: Record<ProjectStatus, string> = {
  'on-track':        '#00af51',
  'needs-attention': '#f4ee19',
  'blocked':         '#ef4444',
  'paused':          '#6b7280',
  'complete':        '#00af51',
  'pending':         '#4b5563',
};

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingAction, setEditingAction] = useState(false);
  const [nextAction, setNextAction] = useState('');
  const [notes, setNotes] = useState('');
  const [groupByStatus, setGroupByStatus] = useState(true);

  function loadData() {
    const p = getProject(id);
    if (!p) { router.push('/projects'); return; }
    setProject(p);
    setNextAction(p.nextAction);
    setNotes(p.notes || '');
    setTasks(getTasks(id));
  }

  useEffect(() => { loadData(); }, [id]);

  if (!project) return (
    <div className="page flex items-center justify-center">
      <div className="text-white/30">Loading…</div>
    </div>
  );

  function updateStatus(status: ProjectStatus) {
    if (!project) return;
    const updated = { ...project, status };
    saveProject(updated);
    setProject(updated);
  }

  function saveNextAction() {
    if (!project) return;
    const updated = { ...project, nextAction: nextAction.trim() || project.nextAction };
    saveProject(updated);
    setProject(updated);
    setEditingAction(false);
  }

  function saveNotes() {
    if (!project) return;
    const updated = { ...project, notes };
    saveProject(updated);
  }

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const color = STATUS_COLOR[project.status];

  const today = new Date().toISOString().slice(0, 10);
  const overdueTasks = tasks.filter(t => t.dueDate && t.dueDate < today && t.status !== 'done');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');

  return (
    <div className="page">
      {/* Back */}
      <button onClick={() => router.back()} className="text-white/40 text-sm mb-4 flex items-center gap-1 hover:text-white transition-colors">
        ← Back
      </button>

      {/* Hero */}
      <div className="mb-5 animate-fade-up">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-4xl">{project.emoji}</span>
          <div className="flex-1 min-w-0">
            <h1
              className="text-2xl font-bold text-white leading-tight"
              style={{ fontFamily: 'Raleway, sans-serif' }}
            >
              {project.name}
            </h1>
            {project.description && (
              <p className="text-white/40 text-sm mt-0.5">{project.description}</p>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {totalTasks > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-white/40">{doneTasks} of {totalTasks} tasks complete</span>
              <span className="text-xs font-semibold" style={{ color: project.color }}>{pct}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: project.color }}
              />
            </div>
          </div>
        )}

        {/* Status pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {STATUS_OPTIONS.map(s => (
            <button
              key={s.value}
              onClick={() => updateStatus(s.value)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                project.status === s.value
                  ? 'text-black'
                  : 'bg-transparent text-white/40 border-white/10 hover:text-white'
              }`}
              style={project.status === s.value ? { background: color, borderColor: color } : {}}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts */}
      {overdueTasks.length > 0 && (
        <div className="mb-4 flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 animate-fade-up">
          <span className="text-red-400 text-sm">⚠</span>
          <p className="text-red-400 text-sm font-medium">
            {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* In-progress snapshot */}
      {inProgressTasks.length > 0 && (
        <div className="mb-4 bg-[#f4ee19]/5 border border-[#f4ee19]/15 rounded-xl px-4 py-3 animate-fade-up">
          <p className="text-[#f4ee19]/70 text-xs uppercase tracking-wider mb-2">In Progress</p>
          <div className="space-y-1.5">
            {inProgressTasks.map(t => (
              <div key={t.id} className="flex items-center gap-2">
                <span className="text-[#f4ee19] text-sm">◑</span>
                <span className="text-white/80 text-sm truncate">{t.title}</span>
                {t.assignee && <span className="text-white/30 text-xs shrink-0">{t.assignee}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next action */}
      <div className="glass rounded-2xl p-4 mb-4 animate-fade-up" style={{ animationDelay: '60ms' }}>
        <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Next Action</p>
        {editingAction ? (
          <div className="flex gap-2">
            <input
              autoFocus
              value={nextAction}
              onChange={e => setNextAction(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') saveNextAction(); if (e.key === 'Escape') setEditingAction(false); }}
              className="flex-1 bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-white text-sm outline-none"
            />
            <button onClick={saveNextAction} className="text-[#00af51] font-semibold text-sm px-2">Save</button>
          </div>
        ) : (
          <button
            onClick={() => setEditingAction(true)}
            className="text-white text-sm font-medium text-left w-full hover:text-white/80 transition-colors"
          >
            → {project.nextAction}
            <span className="text-white/25 ml-2 text-xs">tap to edit</span>
          </button>
        )}
      </div>

      {/* Tasks */}
      <div className="mb-4 animate-fade-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white/50 text-xs uppercase tracking-wider">Tasks</h2>
          <div className="flex gap-1 bg-white/5 rounded-lg p-0.5">
            <button
              onClick={() => setGroupByStatus(true)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                groupByStatus ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'
              }`}
            >
              Grouped
            </button>
            <button
              onClick={() => setGroupByStatus(false)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                !groupByStatus ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'
              }`}
            >
              List
            </button>
          </div>
        </div>
        <TaskList
          tasks={tasks}
          projectId={id}
          onUpdate={loadData}
          showAssignee={true}
          groupByStatus={groupByStatus}
        />
      </div>

      {/* Notes */}
      <div className="animate-fade-up" style={{ animationDelay: '140ms' }}>
        <h2 className="text-white/50 text-xs uppercase tracking-wider mb-2">Notes</h2>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          onBlur={saveNotes}
          placeholder="Project notes, context, links…"
          rows={5}
          className="w-full bg-white/5 border border-white/8 rounded-2xl px-4 py-3 text-white/80 text-sm outline-none resize-none placeholder:text-white/25 focus:border-[#00af51]/40 transition-colors"
        />
      </div>
    </div>
  );
}
