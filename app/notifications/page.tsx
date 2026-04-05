'use client';
import { useState, useEffect } from 'react';
import { getProjects, getTasks } from '@/lib/store';
import { Project, Task } from '@/lib/types';
import Link from 'next/link';

interface Notification {
  id: string;
  type: 'overdue' | 'deadline' | 'stale' | 'blocked' | 'action' | 'milestone';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  project?: string;
  projectId?: string;
  date: string;
  actionHref?: string;
  actionLabel?: string;
  dismissed: boolean;
}

function generateNotifications(projects: Project[], tasks: Task[]): Notification[] {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const notifications: Notification[] = [];

  // Check projects for issues
  projects.forEach(p => {
    // Overdue projects
    if (p.dueDate && p.dueDate < today && p.status !== 'complete' && p.status !== 'paused') {
      notifications.push({
        id: `overdue-${p.id}`,
        type: 'overdue',
        severity: 'critical',
        title: `${p.name} is past due`,
        description: `Due ${p.dueDate}. Status: ${p.status}. Next action: ${p.nextAction}`,
        project: p.name,
        projectId: p.id,
        date: today,
        actionHref: `/projects?p=${p.id}`,
        actionLabel: 'View Project',
        dismissed: false,
      });
    }

    // Deadlines within 7 days
    if (p.dueDate && p.status !== 'complete' && p.status !== 'paused') {
      const due = new Date(p.dueDate + 'T12:00:00');
      const daysUntil = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntil > 0 && daysUntil <= 7) {
        notifications.push({
          id: `deadline-${p.id}`,
          type: 'deadline',
          severity: daysUntil <= 3 ? 'warning' : 'info',
          title: `${p.name} due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`,
          description: `Due ${p.dueDate}. Next action: ${p.nextAction}`,
          project: p.name,
          projectId: p.id,
          date: today,
          actionHref: `/projects?p=${p.id}`,
          actionLabel: 'View Project',
          dismissed: false,
        });
      }
    }

    // Blocked projects
    if (p.status === 'blocked') {
      notifications.push({
        id: `blocked-${p.id}`,
        type: 'blocked',
        severity: 'critical',
        title: `${p.name} is blocked`,
        description: `Next action needed: ${p.nextAction}`,
        project: p.name,
        projectId: p.id,
        date: today,
        actionHref: `/projects?p=${p.id}`,
        actionLabel: 'Unblock',
        dismissed: false,
      });
    }

    // Needs attention
    if (p.status === 'needs-attention') {
      notifications.push({
        id: `attention-${p.id}`,
        type: 'action',
        severity: 'warning',
        title: `${p.name} needs attention`,
        description: p.nextAction,
        project: p.name,
        projectId: p.id,
        date: today,
        actionHref: `/projects?p=${p.id}`,
        actionLabel: 'Review',
        dismissed: false,
      });
    }

    // Stale projects (no update in 14+ days)
    if (p.updatedAt && p.status !== 'complete' && p.status !== 'paused') {
      const updated = new Date(p.updatedAt);
      const daysSinceUpdate = Math.ceil((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceUpdate >= 14) {
        notifications.push({
          id: `stale-${p.id}`,
          type: 'stale',
          severity: 'info',
          title: `${p.name} hasn't been updated in ${daysSinceUpdate} days`,
          description: 'Consider reviewing or pausing this project.',
          project: p.name,
          projectId: p.id,
          date: today,
          actionHref: `/projects?p=${p.id}`,
          actionLabel: 'Review',
          dismissed: false,
        });
      }
    }
  });

  // Overdue tasks
  tasks.forEach(t => {
    if (t.dueDate && t.dueDate < today && t.status !== 'done') {
      const project = projects.find(p => p.id === t.projectId);
      notifications.push({
        id: `task-overdue-${t.id}`,
        type: 'overdue',
        severity: 'warning',
        title: `Task overdue: ${t.title}`,
        description: `Due ${t.dueDate}${t.assignee ? ` · Assigned to ${t.assignee}` : ''}${project ? ` · ${project.name}` : ''}`,
        project: project?.name,
        projectId: project?.id,
        date: today,
        dismissed: false,
      });
    }
  });

  // Sort: critical first, then warning, then info
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  return notifications.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}

const SEVERITY_STYLE = {
  critical: { bg: 'bg-red-500/10 border-red-500/20', icon: '🔴', label: 'Critical', text: 'text-red-400' },
  warning:  { bg: 'bg-[#f4ee19]/10 border-[#f4ee19]/20', icon: '🟡', label: 'Warning', text: 'text-[#f4ee19]' },
  info:     { bg: 'bg-white/5 border-white/10', icon: '🔵', label: 'Info', text: 'text-white/50' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  useEffect(() => {
    const projects = getProjects();
    const tasks = getTasks();
    setNotifications(generateNotifications(projects, tasks));
  }, []);

  const dismiss = (id: string) => {
    setDismissed(prev => new Set([...prev, id]));
  };

  const visible = notifications
    .filter(n => !dismissed.has(n.id))
    .filter(n => filter === 'all' || n.severity === filter);

  const critical = notifications.filter(n => n.severity === 'critical' && !dismissed.has(n.id)).length;
  const warning = notifications.filter(n => n.severity === 'warning' && !dismissed.has(n.id)).length;
  const info = notifications.filter(n => n.severity === 'info' && !dismissed.has(n.id)).length;

  return (
    <div className="page">
      <div className="animate-fade-up mb-5">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Raleway, sans-serif' }}>
          Notifications
        </h1>
        <p className="text-white/40 text-sm mt-0.5">Things that need your attention</p>

        {/* Severity counts */}
        <div className="flex gap-2 mt-3">
          {[
            { key: 'all' as const, label: `All (${notifications.length - dismissed.size})` },
            { key: 'critical' as const, label: `Critical (${critical})` },
            { key: 'warning' as const, label: `Warning (${warning})` },
            { key: 'info' as const, label: `Info (${info})` },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f.key ? 'bg-[#00af51] text-black' : 'bg-white/5 text-white/40 border border-white/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="text-center py-16 animate-fade-up">
          <div className="text-4xl mb-3">✅</div>
          <p className="text-white/40 text-sm">All clear — nothing needs your attention right now.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {visible.map((n, i) => {
            const s = SEVERITY_STYLE[n.severity];
            return (
              <div
                key={n.id}
                className={`flex items-start gap-3 px-4 py-3.5 rounded-2xl border ${s.bg} animate-fade-up transition-all`}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className="text-base mt-0.5 shrink-0">{s.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium text-sm ${s.text}`}>{n.title}</h3>
                  <p className="text-white/35 text-xs mt-0.5">{n.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {n.actionHref && (
                    <Link href={n.actionHref} className="text-[#00af51] text-xs font-medium hover:underline">
                      {n.actionLabel || 'View'}
                    </Link>
                  )}
                  <button
                    onClick={() => dismiss(n.id)}
                    className="text-white/20 hover:text-white/50 text-xs transition-colors"
                    title="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
