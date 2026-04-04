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

      {/* Quick Links */}
      <div className="mb-6 animate-fade-up" style={{ animationDelay: '160ms' }}>
        <h2
          className="text-white font-semibold text-sm uppercase tracking-widest opacity-50 mb-3"
          style={{ fontFamily: 'Raleway, sans-serif' }}
        >
          Quick Links
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { emoji: '⛳', name: 'Known', url: 'https://known.golf' },
            { emoji: '🏌️', name: 'RYP Golf', url: 'https://rypgolf.com' },
            { emoji: '🖥️', name: 'Command Center', url: 'https://command-center-nine-kappa.vercel.app' },
            { emoji: '🏅', name: 'Certification', url: 'https://cert.rypgolf.com' },
            { emoji: '🛍️', name: 'Rypstick Shop', url: 'https://swingspeedgolflab.com' },
            { emoji: '📄', name: 'Master Patent', url: 'https://docs.google.com/document/d/1Z1VzFiuFLEuNfMqW_sw7OxIaBwatS0zkm1uaubHe_Ns/edit' },
            { emoji: '💬', name: 'Alibaba', url: 'https://message.alibaba.com/message/messenger.htm' },
            { emoji: '💼', name: 'Upwork', url: 'https://www.upwork.com/nx/wm/workroom/35119864/messages' },
          ].map(({ emoji, name, url }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-1.5 bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl px-4 py-3.5 active:scale-95 transition-transform duration-100"
            >
              <span className="text-xl leading-none">{emoji}</span>
              <span className="text-white font-semibold text-sm leading-tight">{name}</span>
              <span className="text-white/30 text-xs truncate">{url.replace(/^https?:\/\//, '')}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
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
