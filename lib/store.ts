'use client';
import { AppState, Project, Task, Idea, DailyPriority, SessionLog } from './types';

const KEY = 'ryp_cc_state';

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'known',
    name: 'Known',
    status: 'on-track',
    nextAction: 'Deploy manager dashboard to production',
    dueDate: '2026-04-30',
    description: 'Member recognition training app for country clubs',
    color: '#00af51',
    emoji: '⛳',
    tasks: [],
    notes: '',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'forge',
    name: 'FORGE',
    status: 'on-track',
    nextAction: 'Finalize curriculum outline',
    dueDate: '2026-05-15',
    description: 'Leadership development platform',
    color: '#f4ee19',
    emoji: '🔥',
    tasks: [],
    notes: '',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'textbook',
    name: 'Textbook',
    status: 'needs-attention',
    nextAction: 'Write Chapter 3 draft',
    dueDate: '2026-06-01',
    description: 'Golf operations management textbook',
    color: '#6366f1',
    emoji: '📖',
    tasks: [],
    notes: '',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'certification',
    name: 'Certification',
    status: 'on-track',
    nextAction: 'Review module 4 content',
    dueDate: '2026-05-30',
    description: 'RYP Golf certification program',
    color: '#f97316',
    emoji: '🏅',
    tasks: [],
    notes: '',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'foundation',
    name: 'Foundation',
    status: 'needs-attention',
    nextAction: 'Set up 501(c)(3) application',
    dueDate: '2026-07-01',
    description: 'RYP Golf Foundation nonprofit',
    color: '#ec4899',
    emoji: '🤝',
    tasks: [],
    notes: '',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'chip',
    name: 'CHIP',
    status: 'on-track',
    nextAction: 'Finalize Q2 marketing plan',
    dueDate: '2026-04-15',
    description: 'Golf coaching program',
    color: '#0ea5e9',
    emoji: '🎯',
    tasks: [],
    notes: '',
    updatedAt: new Date().toISOString(),
  },
];

function load(): AppState {
  if (typeof window === 'undefined') return defaultState();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as AppState;
    // Merge in any new default projects that don't exist yet
    const existingIds = new Set(parsed.projects.map(p => p.id));
    DEFAULT_PROJECTS.forEach(dp => {
      if (!existingIds.has(dp.id)) parsed.projects.push(dp);
    });
    return parsed;
  } catch {
    return defaultState();
  }
}

function defaultState(): AppState {
  return {
    projects: DEFAULT_PROJECTS,
    tasks: [],
    ideas: [],
    priorities: [],
    sessions: [],
  };
}

function save(state: AppState) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

// ── Projects ────────────────────────────────────────────────────────────────

export function getProjects(): Project[] {
  return load().projects;
}

export function getProject(id: string): Project | undefined {
  return load().projects.find(p => p.id === id);
}

export function saveProject(project: Project) {
  const state = load();
  const idx = state.projects.findIndex(p => p.id === project.id);
  if (idx >= 0) state.projects[idx] = { ...project, updatedAt: new Date().toISOString() };
  else state.projects.push({ ...project, updatedAt: new Date().toISOString() });
  save(state);
}

// ── Tasks ────────────────────────────────────────────────────────────────────

export function getTasks(projectId?: string): Task[] {
  const tasks = load().tasks;
  if (projectId) return tasks.filter(t => t.projectId === projectId);
  return tasks;
}

export function getTasksByAssignee(assignee: string): Task[] {
  return load().tasks.filter(t => t.assignee === assignee);
}

export function saveTask(task: Task) {
  const state = load();
  const idx = state.tasks.findIndex(t => t.id === task.id);
  if (idx >= 0) state.tasks[idx] = task;
  else state.tasks.push(task);
  save(state);
}

export function deleteTask(id: string) {
  const state = load();
  state.tasks = state.tasks.filter(t => t.id !== id);
  save(state);
}

export function completeTask(id: string) {
  const state = load();
  const task = state.tasks.find(t => t.id === id);
  if (task) {
    task.status = 'done';
    task.completedAt = new Date().toISOString();
  }
  save(state);
}

// ── Ideas ─────────────────────────────────────────────────────────────────────

export function getIdeas(): Idea[] {
  return load().ideas.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function saveIdea(idea: Idea) {
  const state = load();
  const idx = state.ideas.findIndex(i => i.id === idea.id);
  if (idx >= 0) state.ideas[idx] = { ...idea, updatedAt: new Date().toISOString() };
  else state.ideas.push({ ...idea, updatedAt: new Date().toISOString() });
  save(state);
}

export function deleteIdea(id: string) {
  const state = load();
  state.ideas = state.ideas.filter(i => i.id !== id);
  save(state);
}

// ── Daily Priorities ──────────────────────────────────────────────────────────

export function getTodayPriorities(): DailyPriority[] {
  const today = new Date().toISOString().slice(0, 10);
  return load().priorities.filter(p => p.date === today).sort((a, b) => a.order - b.order);
}

export function savePriority(priority: DailyPriority) {
  const state = load();
  const idx = state.priorities.findIndex(p => p.id === priority.id);
  if (idx >= 0) state.priorities[idx] = priority;
  else state.priorities.push(priority);
  save(state);
}

export function deletePriority(id: string) {
  const state = load();
  state.priorities = state.priorities.filter(p => p.id !== id);
  save(state);
}

// ── Sessions ──────────────────────────────────────────────────────────────────

export function getSessions(): SessionLog[] {
  return load().sessions.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function saveSession(session: SessionLog) {
  const state = load();
  const idx = state.sessions.findIndex(s => s.id === session.id);
  if (idx >= 0) state.sessions[idx] = session;
  else state.sessions.push(session);
  save(state);
}

// ── Utils ─────────────────────────────────────────────────────────────────────

export function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
