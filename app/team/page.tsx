'use client';
import { useState, useEffect } from 'react';
import { Task, TeamMember } from '@/lib/types';
import { getTasks } from '@/lib/store';
import TeamMemberCard from '@/components/TeamMember';

const TEAM: TeamMember[] = ['Luke', 'Yannick', 'Mike', 'Max', 'Phil'];

export default function TeamPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  function load() { setTasks(getTasks()); }
  useEffect(() => { load(); }, []);

  const totalActive = tasks.filter(t => t.status !== 'done').length;
  const totalDone   = tasks.filter(t => t.status === 'done').length;

  return (
    <div className="page">
      <div className="animate-fade-up mb-5">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Raleway, sans-serif' }}>
          Team
        </h1>
        <p className="text-white/40 text-sm mt-1">
          {totalActive} active tasks · {totalDone} completed
        </p>
      </div>

      <div className="stagger flex flex-col gap-3">
        {TEAM.map(member => (
          <TeamMemberCard
            key={member}
            member={member}
            tasks={tasks.filter(t => t.assignee === member)}
            onUpdate={load}
          />
        ))}
      </div>
    </div>
  );
}
