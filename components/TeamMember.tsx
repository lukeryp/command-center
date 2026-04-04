'use client';
import { useState } from 'react';
import { Task, TeamMember as TM } from '@/lib/types';
import TaskList from './TaskList';

const AVATARS: Record<TM, string> = {
  Luke:    '👤',
  Yannick: '👤',
  Mike:    '👤',
  Max:     '👤',
  Phil:    '👤',
};

const COLORS: Record<TM, string> = {
  Luke:    '#00af51',
  Yannick: '#f4ee19',
  Mike:    '#6366f1',
  Max:     '#f97316',
  Phil:    '#0ea5e9',
};

interface Props {
  member: TM;
  tasks: Task[];
  onUpdate: () => void;
}

export default function TeamMemberCard({ member, tasks, onUpdate }: Props) {
  const [expanded, setExpanded] = useState(member === 'Luke');
  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const activeTasks = tasks.filter(t => t.status !== 'done').length;

  return (
    <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden">
      <button
        className="w-full flex items-center gap-3 px-4 py-4 text-left"
        onClick={() => setExpanded(e => !e)}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
          style={{ background: COLORS[member] + '25', border: `1px solid ${COLORS[member]}40` }}
        >
          <span style={{ filter: `drop-shadow(0 0 4px ${COLORS[member]})` }}>{AVATARS[member]}</span>
        </div>
        <div className="flex-1">
          <p className="text-white font-semibold text-sm" style={{ fontFamily: 'Raleway, sans-serif' }}>{member}</p>
          <p className="text-white/30 text-xs">
            {activeTasks} active · {doneTasks} done
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeTasks > 0 && (
            <span
              className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
              style={{ background: COLORS[member], color: '#0d0d0d' }}
            >
              {activeTasks}
            </span>
          )}
          <span className="text-white/30 text-sm">{expanded ? '↑' : '↓'}</span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-white/5 pt-3">
          <TaskList
            tasks={tasks}
            assignee={member}
            onUpdate={onUpdate}
            showAssignee={false}
          />
        </div>
      )}
    </div>
  );
}
