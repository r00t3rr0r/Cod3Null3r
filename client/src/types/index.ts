export interface Project {
  _id: string;
  name: string;
  description: string;
  status: 'in-progress' | 'completed' | 'imported';
  createdAt: string;
  lastModified: string;
  filesCount: number;
  linesOfCode: number;
  technologies: string[];
  type: 'new' | 'imported';
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'working' | 'completed' | 'error' | 'waiting';
  currentTask?: string;
  progress?: number;
  timeSpent?: number;
  tasksCompleted?: number;
}

export interface ActivityItem {
  id: string;
  agentId: string;
  agentName: string;
  task: string;
  status: 'completed' | 'working' | 'error';
  filesModified: string[];
  timeSpent: number;
  timestamp: string;
  details?: string;
}

export interface CodeFile {
  path: string;
  name: string;
  content: string;
  language: string;
  size: number;
}

export interface Requirement {
  id: string;
  category: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface TechStack {
  frontend: string[];
  backend: string[];
  database: string[];
  tools: string[];
}

export interface GitProject {
  name: string;
  url: string;
  description: string;
  filesCount: number;
  linesOfCode: number;
  technologies: string[];
  issues: Array<{
    severity: 'error' | 'warning' | 'info';
    description: string;
    location: string;
  }>;
}