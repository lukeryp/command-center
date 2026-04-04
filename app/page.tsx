'use client';
import { useState, useEffect } from 'react';
import { getProjects } from '@/lib/store';
import { Project } from '@/lib/types';
import ProjectCard from '@/components/ProjectCard';
import PriorityStack from '@/components/PriorityStack';
import QuickCapture from '@/components/QuickCapture';
import Link from 'next/link';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getSessionPrompt(): { show: boolean; type: 'morning' | 'evening'; label: string } {
  const h = new Date().getHours();
  if (h >= 6 && h < 8) return { show: true, type: 'morning', label: 'Morning Review ready →' };
  if (h >= 21 || h < 1) return { show: true, type: 'evening', label: 'Evening Wrap-up →' };
  return { show: false, type: 'morning', label: '' };
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [time, setTime] = useState('');

  useEffect(() => {
    setProjects(getProjects());
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
    tick();
    const t = setInterval(tick, 30000);
    return () => clearInterval(t);
  }, []);

  const session = getSessionPrompt();
  const needsAttention = projects.filter(p => p.status === 'needs-attention' || p.status === 'blocked');

  return (
    <div className="page">
      {/* Greeting */}
      <div className="mb-6 animate-fade-up">
        <p className="text-white/40 text-sm font-medium mb-0.5">{time}</p>
        <h1
          className="text-3xl font-bold text-white leading-tight"
          style={{ fontFamily: 'Raleway, sans-serif' }}
        >
          {getGreeting()}, Luke.
        </h1>
        {needsAttention.length > 0 && (
          <p className="text-[#f4ee19] text-sm mt-1 font-medium">
            ⚠ {needsAttention.length} project{needsAttention.length > 1 ? 's' : ''} need attention
          </p>
        )}
      </div>

      {/* Session prompt */}
      {session.show && (
        <Link
          href="/session"
          className="block mb-5 animate-fade-up"
          style={{ animationDelay: '60ms' }}
        >
          <div className="flex items-center gap-3 bg-[#00af51]/10 border border-[#00af51]/30 rounded-2xl px-5 py-3.5">
            <div className="w-8 h-8 rounded-xl bg-[#00af51] flex items-center justify-center shrink-0">
              <span className="text-black text-base">
                {session.type === 'morning' ? '☀️' : '🌙'}
              </span>
            </div>
            <span className="text-[#00af51] font-semibold text-sm">{session.label}</span>
          </div>
        </Link>
      )}

      {/* Priority Stack */}
      <div className="animate-fade-up" style={{ animationDelay: '80ms' }}>
        <PriorityStack />
      </div>

      {/* Quick Capture */}
      <div className="mb-6 animate-fade-up" style={{ animationDelay: '120ms' }}>
        <QuickCapture />
      </div>

      {/* Projects */}
      <div className="animate-fade-up" style={{ animationDelay: '160ms' }}>
        <div className="flex items-center justify-between mb-3">
          <h2
            className="text-white font-semibold text-sm uppercase tracking-widest opacity-50"
            style={{ fontFamily: 'Raleway, sans-serif' }}
          >
            Projects
          </h2>
          <Link href="/projects" className="text-[#00af51] text-sm font-medium">
            All →
          </Link>
        </div>
        <div className="stagger grid grid-cols-1 gap-3">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
