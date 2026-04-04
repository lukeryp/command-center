import { Task } from './types';

const now = new Date().toISOString();

function t(overrides: Partial<Task> & { id: string; title: string; projectId: string }): Task {
  return {
    status: 'todo',
    priority: 3,
    createdAt: now,
    ...overrides,
  };
}

export const SEED_TASKS: Task[] = [
  // ── Known ────────────────────────────────────────────────────────────────
  t({ id: 'known-1', title: 'Deploy manager dashboard to production', projectId: 'known', priorityLevel: 'high', status: 'in-progress', assignee: 'Luke', dueDate: '2026-04-15', description: 'Final production push with auth flow and member photo upload enabled.' }),
  t({ id: 'known-2', title: 'Build onboarding walkthrough for club staff', projectId: 'known', priorityLevel: 'high', status: 'todo', assignee: 'Yannick', dueDate: '2026-04-20', description: 'Step-by-step in-app guide for first-time managers.' }),
  t({ id: 'known-3', title: 'Set up analytics dashboard (Vercel/PostHog)', projectId: 'known', priorityLevel: 'medium', status: 'todo', assignee: 'Mike', dueDate: '2026-04-25' }),
  t({ id: 'known-4', title: 'Pilot with 3 country clubs (Interlachen + 2)', projectId: 'known', priorityLevel: 'high', status: 'todo', assignee: 'Luke', dueDate: '2026-04-30' }),
  t({ id: 'known-5', title: 'Document member import CSV format', projectId: 'known', priorityLevel: 'low', status: 'todo', assignee: 'Phil' }),
  t({ id: 'known-6', title: 'Create demo video for sales decks', projectId: 'known', priorityLevel: 'medium', status: 'todo', assignee: 'Max', dueDate: '2026-04-28' }),

  // ── FORGE ────────────────────────────────────────────────────────────────
  t({ id: 'forge-1', title: 'Finalize curriculum outline (all 8 modules)', projectId: 'forge', priorityLevel: 'high', status: 'in-progress', assignee: 'Luke', dueDate: '2026-04-18', description: 'Complete module map with learning objectives and content types.' }),
  t({ id: 'forge-2', title: 'Design module slide templates', projectId: 'forge', priorityLevel: 'medium', status: 'todo', assignee: 'Max', dueDate: '2026-04-25' }),
  t({ id: 'forge-3', title: 'Record intro video (welcome + overview)', projectId: 'forge', priorityLevel: 'medium', status: 'todo', assignee: 'Luke', dueDate: '2026-05-01' }),
  t({ id: 'forge-4', title: 'Build LMS integration (Kajabi or Teachable)', projectId: 'forge', priorityLevel: 'high', status: 'todo', assignee: 'Phil', dueDate: '2026-05-10', description: 'Evaluate platforms and set up course hosting.' }),
  t({ id: 'forge-5', title: 'Write Module 1 content: Leadership Foundations', projectId: 'forge', priorityLevel: 'medium', status: 'todo', assignee: 'Luke' }),
  t({ id: 'forge-6', title: 'Recruit 5 beta participants for pilot cohort', projectId: 'forge', priorityLevel: 'medium', status: 'todo', assignee: 'Yannick', dueDate: '2026-05-12' }),

  // ── Textbook (Book Launch) ────────────────────────────────────────────────
  t({ id: 'textbook-1', title: 'Write Chapter 3 draft: Club Operations Systems', projectId: 'textbook', priorityLevel: 'high', status: 'in-progress', assignee: 'Luke', dueDate: '2026-04-12', description: 'Focus on scheduling, staffing models, and KPI dashboards.' }),
  t({ id: 'textbook-2', title: 'Review and edit Chapter 2', projectId: 'textbook', priorityLevel: 'medium', status: 'todo', assignee: 'Luke', dueDate: '2026-04-20' }),
  t({ id: 'textbook-3', title: 'Source 3 industry case studies', projectId: 'textbook', priorityLevel: 'low', status: 'todo', assignee: 'Yannick', dueDate: '2026-05-01' }),
  t({ id: 'textbook-4', title: 'Find academic peer reviewer', projectId: 'textbook', priorityLevel: 'medium', status: 'blocked', assignee: 'Luke', description: 'Need intro from Dr. Morrison — following up.' }),
  t({ id: 'textbook-5', title: 'Submit proposal to publisher', projectId: 'textbook', priorityLevel: 'high', status: 'todo', assignee: 'Luke', dueDate: '2026-06-01' }),

  // ── Certification ─────────────────────────────────────────────────────────
  t({ id: 'cert-1', title: 'Review Module 4 content: Advanced Coaching', projectId: 'certification', priorityLevel: 'medium', status: 'in-progress', assignee: 'Luke', dueDate: '2026-04-14' }),
  t({ id: 'cert-2', title: 'Design certificate and badge assets', projectId: 'certification', priorityLevel: 'low', status: 'todo', assignee: 'Max', dueDate: '2026-04-28' }),
  t({ id: 'cert-3', title: 'Build assessment quiz for Modules 1-3', projectId: 'certification', priorityLevel: 'high', status: 'todo', assignee: 'Phil', dueDate: '2026-05-05' }),
  t({ id: 'cert-4', title: 'Pilot program with 5 coaches', projectId: 'certification', priorityLevel: 'medium', status: 'todo', assignee: 'Yannick', dueDate: '2026-05-20' }),
  t({ id: 'cert-5', title: 'Price and packaging finalization', projectId: 'certification', priorityLevel: 'medium', status: 'todo', assignee: 'Luke', dueDate: '2026-05-10' }),
  t({ id: 'cert-6', title: 'Set up payment and enrollment flow', projectId: 'certification', priorityLevel: 'high', status: 'todo', assignee: 'Phil', dueDate: '2026-05-25' }),

  // ── Foundation ────────────────────────────────────────────────────────────
  t({ id: 'foundation-1', title: 'Begin 501(c)(3) application', projectId: 'foundation', priorityLevel: 'high', status: 'todo', assignee: 'Luke', dueDate: '2026-05-01', description: 'Articles of incorporation + IRS Form 1023.' }),
  t({ id: 'foundation-2', title: 'Find nonprofit legal counsel', projectId: 'foundation', priorityLevel: 'high', status: 'todo', assignee: 'Luke', dueDate: '2026-04-25' }),
  t({ id: 'foundation-3', title: 'Draft mission and vision statement', projectId: 'foundation', priorityLevel: 'medium', status: 'done', assignee: 'Luke', completedAt: new Date('2026-03-20').toISOString() }),
  t({ id: 'foundation-4', title: 'Research golf-youth grant opportunities', projectId: 'foundation', priorityLevel: 'low', status: 'todo', assignee: 'Yannick', dueDate: '2026-05-15' }),
  t({ id: 'foundation-5', title: 'Identify 5 inaugural board members', projectId: 'foundation', priorityLevel: 'medium', status: 'todo', assignee: 'Luke', dueDate: '2026-06-01' }),

  // ── CHIP ──────────────────────────────────────────────────────────────────
  t({ id: 'chip-1', title: 'Finalize Q2 marketing plan', projectId: 'chip', priorityLevel: 'high', status: 'in-progress', assignee: 'Luke', dueDate: '2026-04-08' }),
  t({ id: 'chip-2', title: 'Update pricing sheet for 2026 season', projectId: 'chip', priorityLevel: 'medium', status: 'todo', assignee: 'Mike', dueDate: '2026-04-12' }),
  t({ id: 'chip-3', title: 'Create program overview video', projectId: 'chip', priorityLevel: 'medium', status: 'todo', assignee: 'Max', dueDate: '2026-04-20' }),
  t({ id: 'chip-4', title: 'Confirm summer camp schedule with Interlachen', projectId: 'chip', priorityLevel: 'high', status: 'todo', assignee: 'Luke', dueDate: '2026-04-15' }),
];
