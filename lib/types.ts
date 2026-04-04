export type ProjectStatus = 'on-track' | 'needs-attention' | 'blocked' | 'paused' | 'complete';
export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'blocked';
export type IdeaStatus = 'raw' | 'developing' | 'ready' | 'archived';
export type TeamMember = 'Luke' | 'Yannick' | 'Mike' | 'Max' | 'Phil';
export type PriorityLevel = 'high' | 'medium' | 'low';
export type AppContext = 'interlachen' | 'ryp' | 'personal';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  projectId?: string;
  assignee?: TeamMember;
  dueDate?: string;
  priority: 1 | 2 | 3 | 4 | 5;
  priorityLevel?: PriorityLevel;
  createdAt: string;
  completedAt?: string;
  notes?: string;
}

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  nextAction: string;
  dueDate?: string;
  description?: string;
  color: string;
  emoji: string;
  tasks: Task[];
  notes: string;
  updatedAt: string;
  context?: AppContext;
}

export interface Idea {
  id: string;
  title: string;
  body: string;
  status: IdeaStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DailyPriority {
  id: string;
  title: string;
  done: boolean;
  order: number;
  date: string;
}

export interface SessionLog {
  id: string;
  type: 'morning' | 'evening';
  date: string;
  completions: string[];
  priorities: string[];
  notes: string;
  createdAt: string;
}

export interface AppState {
  projects: Project[];
  tasks: Task[];
  ideas: Idea[];
  priorities: DailyPriority[];
  sessions: SessionLog[];
}
