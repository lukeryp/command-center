'use client';
import { useState } from 'react';
import { Task, TaskStatus, PriorityLevel, TeamMember } from '@/lib/types';
import { saveTask, deleteTask, newId } from '@/lib/store';

const TEAM: TeamMember[] = ['Luke', 'Yannick', 'Mike', 'Max', 'Phil'];

const STATUS_CYCLE: TaskStatus[] = ['todo', 'in-progress', 'done'];
const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
  blocked: 'Blocked',
};
const STATUS_ICON: Record<TaskStatus, string> = {
  todo: '○',
  'in-progress': '◑',
  done: '●',
  blocked: '⊘',
};
const STATUS_COLOR: Record<TaskStatus, string> = {
  todo: 'text-white/30',
  'in-progress': 'text-[#f4ee19]',
  done: 'text-[#00af51]',
  blocked: 'text-red-400',
};

const PRIORITY_DOT: Record<PriorityLevel, string> = {
  high: 'bg-red-500',
  medium: 'bg-[#f4ee19]',
  low: 'bg-white/25',
};

type SortKey = 'default' | 'dueDate' | 'priority' | 'assignee';

interface Props {
  tasks: Task[];
  projectId?: string;
  assignee?: TeamMember;
  onUpdate: () => void;
  showAssignee?: boolean;
  groupByStatus?: boolean;
}

export default function TaskList({
  tasks,
  projectId,
  assignee,
  onUpdate,
  showAssignee = false,
  groupByStatus = false,
}: Props) {
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<PriorityLevel>('medium');
  const [newAssignee, setNewAssignee] = useState<TeamMember | ''>('');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [filterAssignee, setFilterAssignee] = useState<TeamMember | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('default');
  const [showFilters, setShowFilters] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  function isOverdue(task: Task) {
    return task.dueDate && task.dueDate < today && task.status !== 'done';
  }

  function applyFiltersAndSort(list: Task[]): Task[] {
    let out = list;
    if (filterStatus !== 'all') out = out.filter(t => t.status === filterStatus);
    if (filterAssignee !== 'all') out = out.filter(t => t.assignee === filterAssignee);
    if (sortKey === 'dueDate') {
      out = [...out].sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
    } else if (sortKey === 'priority') {
      const pOrder: Record<PriorityLevel, number> = { high: 0, medium: 1, low: 2 };
      out = [...out].sort((a, b) => (pOrder[a.priorityLevel ?? 'low']) - (pOrder[b.priorityLevel ?? 'low']));
    } else if (sortKey === 'assignee') {
      out = [...out].sort((a, b) => (a.assignee ?? '').localeCompare(b.assignee ?? ''));
    }
    return out;
  }

  function add() {
    if (!newTitle.trim()) { setAdding(false); return; }
    saveTask({
      id: newId(),
      title: newTitle.trim(),
      status: 'todo',
      projectId,
      assignee: (newAssignee || assignee) as TeamMember | undefined,
      priority: newPriority === 'high' ? 1 : newPriority === 'medium' ? 3 : 5,
      priorityLevel: newPriority,
      createdAt: new Date().toISOString(),
      notes: '',
    });
    setNewTitle('');
    setNewPriority('medium');
    setNewAssignee('');
    setAdding(false);
    onUpdate();
  }

  function cycleStatus(task: Task) {
    if (task.status === 'blocked') {
      saveTask({ ...task, status: 'todo' });
    } else {
      const idx = STATUS_CYCLE.indexOf(task.status as typeof STATUS_CYCLE[number]);
      const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
      saveTask({ ...task, status: next, completedAt: next === 'done' ? new Date().toISOString() : undefined });
    }
    onUpdate();
  }

  function remove(id: string) {
    deleteTask(id);
    onUpdate();
  }

  function renderTask(task: Task) {
    const overdue = isOverdue(task);
    return (
      <div
        key={task.id}
        className={`flex items-start gap-3 py-3 border-b border-white/5 last:border-0 group transition-opacity ${
          task.status === 'done' ? 'opacity-40' : ''
        }`}
      >
        {/* Status toggle */}
        <button
          onClick={() => cycleStatus(task)}
          className={`text-xl leading-none mt-0.5 shrink-0 transition-all active:scale-90 ${STATUS_COLOR[task.status]}`}
          title={`${STATUS_LABELS[task.status]} — tap to advance`}
        >
          {STATUS_ICON[task.status]}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            {/* Priority dot */}
            {task.priorityLevel && task.status !== 'done' && (
              <span className={`shrink-0 w-1.5 h-1.5 rounded-full mt-1.5 ${PRIORITY_DOT[task.priorityLevel]}`} />
            )}
            <p className={`text-sm font-medium leading-snug flex-1 ${
              task.status === 'done' ? 'line-through text-white/40' : 'text-white'
            }`}>
              {task.title}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {showAssignee && task.assignee && (
              <span className="text-xs text-white/30">{task.assignee}</span>
            )}
            {task.dueDate && (
              <span className={`text-xs ${overdue ? 'text-red-400 font-semibold' : 'text-white/30'}`}>
                {overdue ? '⚠ ' : ''}{new Date(task.dueDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
            {task.status === 'blocked' && (
              <span className="text-xs text-red-400 font-semibold">Blocked</span>
            )}
          </div>
          {task.description && task.status !== 'done' && (
            <p className="text-xs text-white/30 mt-1 leading-relaxed">{task.description}</p>
          )}
        </div>

        {/* Delete */}
        <button
          onClick={() => remove(task.id)}
          className="text-white/0 group-hover:text-white/25 hover:!text-red-400 text-lg leading-none shrink-0 transition-all"
        >
          ×
        </button>
      </div>
    );
  }

  const allFiltered = applyFiltersAndSort(tasks);
  const active = allFiltered.filter(t => t.status !== 'done');
  const done = allFiltered.filter(t => t.status === 'done');

  // Grouped view for project detail
  const groups: { key: TaskStatus; label: string }[] = [
    { key: 'todo', label: 'To Do' },
    { key: 'in-progress', label: 'In Progress' },
    { key: 'blocked', label: 'Blocked' },
  ];

  const assigneesInProject = Array.from(new Set(tasks.map(t => t.assignee).filter(Boolean))) as TeamMember[];

  return (
    <div>
      {/* Filter / sort bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {(['all', 'todo', 'in-progress', 'blocked', 'done'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                filterStatus === s ? 'bg-white/10 text-white' : 'text-white/35 hover:text-white/60'
              }`}
            >
              {s === 'all' ? 'All' : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowFilters(f => !f)}
          className={`shrink-0 text-xs px-2.5 py-1 rounded-lg transition-all ml-1 ${
            showFilters ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'
          }`}
        >
          ⊞
        </button>
      </div>

      {/* Extended filters */}
      {showFilters && (
        <div className="flex gap-2 mb-3 flex-wrap">
          {assigneesInProject.length > 1 && (
            <div className="flex gap-1">
              {(['all', ...assigneesInProject] as const).map(a => (
                <button
                  key={a}
                  onClick={() => setFilterAssignee(a as TeamMember | 'all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                    filterAssignee === a
                      ? 'bg-[#00af51]/20 text-[#00af51] border-[#00af51]/30'
                      : 'bg-white/5 text-white/40 border-white/10 hover:text-white/60'
                  }`}
                >
                  {a === 'all' ? 'Everyone' : a}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-1">
            {(['default', 'dueDate', 'priority'] as SortKey[]).map(sk => (
              <button
                key={sk}
                onClick={() => setSortKey(sk)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                  sortKey === sk
                    ? 'bg-white/10 text-white border-white/20'
                    : 'bg-white/5 text-white/40 border-white/10 hover:text-white/60'
                }`}
              >
                {sk === 'default' ? 'Default' : sk === 'dueDate' ? 'Due Date' : 'Priority'}
              </button>
            ))}
          </div>
        </div>
      )}

      {groupByStatus ? (
        /* Grouped by status columns */
        <div className="space-y-4">
          {groups.map(({ key, label }) => {
            const groupTasks = applyFiltersAndSort(tasks.filter(t => t.status === key));
            return (
              <div key={key}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-sm ${STATUS_COLOR[key]}`}>{STATUS_ICON[key]}</span>
                  <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">{label}</h3>
                  <span className="text-xs text-white/25">{groupTasks.length}</span>
                </div>
                {groupTasks.length > 0 ? (
                  <div className="bg-white/5 border border-white/8 rounded-xl px-4">
                    {groupTasks.map(renderTask)}
                  </div>
                ) : (
                  <div className="text-white/20 text-xs pl-4">—</div>
                )}
              </div>
            );
          })}
          {/* Done group collapsed */}
          {done.length > 0 && (
            <details>
              <summary className="text-white/30 text-xs uppercase tracking-wider cursor-pointer mb-2 flex items-center gap-2">
                <span className={STATUS_COLOR['done']}>{STATUS_ICON['done']}</span>
                Completed ({done.length})
              </summary>
              <div className="bg-white/3 border border-white/5 rounded-xl px-4">
                {done.map(renderTask)}
              </div>
            </details>
          )}
        </div>
      ) : (
        /* Flat list */
        <>
          <div className="bg-white/5 border border-white/8 rounded-xl px-4 mb-3">
            {active.length === 0 && !adding && (
              <div className="py-4 text-center text-white/30 text-sm">No tasks yet</div>
            )}
            {active.map(renderTask)}
            {adding && (
              <div className="border-t border-white/5 pt-3 pb-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-white/20 text-xl">○</span>
                  <input
                    autoFocus
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') add(); if (e.key === 'Escape') setAdding(false); }}
                    placeholder="Task title…"
                    className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/30"
                  />
                  <button onClick={add} className="text-[#00af51] text-sm font-semibold shrink-0">Add</button>
                </div>
                <div className="flex items-center gap-2 pl-8 flex-wrap">
                  {/* Priority picker */}
                  <div className="flex gap-1">
                    {(['high', 'medium', 'low'] as PriorityLevel[]).map(p => (
                      <button
                        key={p}
                        onClick={() => setNewPriority(p)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-all ${
                          newPriority === p
                            ? 'border-white/30 text-white bg-white/10'
                            : 'border-white/10 text-white/30 hover:text-white/60'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[p]}`} />
                        {p}
                      </button>
                    ))}
                  </div>
                  {/* Assignee picker (shown when no fixed assignee) */}
                  {!assignee && (
                    <select
                      value={newAssignee}
                      onChange={e => setNewAssignee(e.target.value as TeamMember | '')}
                      className="bg-white/5 border border-white/10 rounded-lg text-xs text-white/60 px-2 py-0.5 outline-none"
                    >
                      <option value="">Unassigned</option>
                      {TEAM.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setAdding(true)}
            className="text-[#00af51] text-sm font-medium mb-4"
          >
            + Add task
          </button>

          {done.length > 0 && (
            <div className="mt-2">
              <details>
                <summary className="text-white/30 text-xs uppercase tracking-wider cursor-pointer mb-2">
                  Completed ({done.length})
                </summary>
                <div className="bg-white/3 border border-white/5 rounded-xl px-4">
                  {done.map(renderTask)}
                </div>
              </details>
            </div>
          )}
        </>
      )}

      {/* Add task button for grouped view */}
      {groupByStatus && (
        <>
          {adding ? (
            <div className="mt-4 bg-white/5 border border-white/8 rounded-xl px-4 py-3">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-white/20 text-xl">○</span>
                <input
                  autoFocus
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') add(); if (e.key === 'Escape') setAdding(false); }}
                  placeholder="Task title…"
                  className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/30"
                />
                <button onClick={add} className="text-[#00af51] text-sm font-semibold shrink-0">Add</button>
              </div>
              <div className="flex items-center gap-2 pl-8 flex-wrap">
                {(['high', 'medium', 'low'] as PriorityLevel[]).map(p => (
                  <button
                    key={p}
                    onClick={() => setNewPriority(p)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-all ${
                      newPriority === p ? 'border-white/30 text-white bg-white/10' : 'border-white/10 text-white/30'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[p]}`} />
                    {p}
                  </button>
                ))}
                <select
                  value={newAssignee}
                  onChange={e => setNewAssignee(e.target.value as TeamMember | '')}
                  className="bg-white/5 border border-white/10 rounded-lg text-xs text-white/60 px-2 py-0.5 outline-none"
                >
                  <option value="">Unassigned</option>
                  {TEAM.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="mt-4 text-[#00af51] text-sm font-medium"
            >
              + Add task
            </button>
          )}
        </>
      )}
    </div>
  );
}
