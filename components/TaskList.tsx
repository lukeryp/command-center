'use client';
import { useState } from 'react';
import { Task, TaskStatus, TeamMember } from '@/lib/types';
import { saveTask, deleteTask, newId } from '@/lib/store';

const TEAM: TeamMember[] = ['Luke', 'Yannick', 'Mike', 'Max', 'Phil'];
const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

interface Props {
  tasks: Task[];
  projectId?: string;
  assignee?: TeamMember;
  onUpdate: () => void;
  showAssignee?: boolean;
}

export default function TaskList({ tasks, projectId, assignee, onUpdate, showAssignee = false }: Props) {
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);
  const active = filtered.filter(t => t.status !== 'done');
  const done = filtered.filter(t => t.status === 'done');

  function add() {
    if (!newTitle.trim()) { setAdding(false); return; }
    saveTask({
      id: newId(),
      title: newTitle.trim(),
      status: 'todo',
      projectId,
      assignee: assignee,
      priority: 3,
      createdAt: new Date().toISOString(),
      notes: '',
    });
    setNewTitle('');
    setAdding(false);
    onUpdate();
  }

  function cycleStatus(task: Task) {
    const order: TaskStatus[] = ['todo', 'in-progress', 'done'];
    const next = order[(order.indexOf(task.status) + 1) % order.length];
    saveTask({ ...task, status: next, completedAt: next === 'done' ? new Date().toISOString() : undefined });
    onUpdate();
  }

  function remove(id: string) {
    deleteTask(id);
    onUpdate();
  }

  const statusIcon: Record<TaskStatus, string> = {
    todo: '○',
    'in-progress': '◑',
    done: '●',
  };
  const statusColor: Record<TaskStatus, string> = {
    todo: 'text-white/30',
    'in-progress': 'text-[#f4ee19]',
    done: 'text-[#00af51]',
  };

  function renderTask(task: Task) {
    return (
      <div key={task.id} className={`flex items-start gap-3 py-3 border-b border-white/5 last:border-0 group ${task.status === 'done' ? 'opacity-40' : ''}`}>
        <button
          onClick={() => cycleStatus(task)}
          className={`text-xl leading-none mt-0.5 shrink-0 transition-all ${statusColor[task.status]}`}
          title={`Status: ${STATUS_LABELS[task.status]} — tap to advance`}
        >
          {statusIcon[task.status]}
        </button>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium leading-snug ${task.status === 'done' ? 'line-through text-white/40' : 'text-white'}`}>
            {task.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            {showAssignee && task.assignee && (
              <span className="text-xs text-white/30">{task.assignee}</span>
            )}
            {task.dueDate && (
              <span className="text-xs text-white/30">
                {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => remove(task.id)}
          className="text-white/0 group-hover:text-white/30 hover:text-red-400 text-lg leading-none shrink-0 transition-all"
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-1 mb-4 bg-white/5 rounded-xl p-1">
        {(['all', 'todo', 'in-progress', 'done'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
              filter === s ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
            }`}
          >
            {s === 'all' ? 'All' : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Active tasks */}
      <div className="bg-white/5 border border-white/8 rounded-xl px-4 mb-3">
        {active.length === 0 && !adding && (
          <div className="py-4 text-center text-white/30 text-sm">No tasks yet</div>
        )}
        {active.map(renderTask)}
        {adding && (
          <div className="flex items-center gap-3 py-3 border-t border-white/5">
            <span className="text-white/20 text-xl">○</span>
            <input
              autoFocus
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') add(); if (e.key === 'Escape') setAdding(false); }}
              placeholder="New task…"
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/30"
            />
            <button onClick={add} className="text-[#00af51] text-sm font-semibold">Add</button>
          </div>
        )}
      </div>

      <button
        onClick={() => setAdding(true)}
        className="text-[#00af51] text-sm font-medium mb-4"
      >
        + Add task
      </button>

      {/* Done tasks (collapsed by default) */}
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
    </div>
  );
}
