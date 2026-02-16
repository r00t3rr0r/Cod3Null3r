import api from './api';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  epicId: string;
  assignedAgent?: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  estimatedTime?: number;
  actualTime?: number;
}

export interface Epic {
  id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  taskCount: number;
  completedTaskCount: number;
  createdAt: string;
  updatedAt: string;
}

// Description: Get all tasks for a project
// Endpoint: GET /api/projects/:projectId/tasks
// Request: {}
// Response: { tasks: Array<Task> }
export const getProjectTasks = (projectId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        tasks: [
          {
            id: 'task-1',
            title: 'Setup project structure',
            description: 'Initialize project with proper folder structure and dependencies',
            status: 'completed',
            epicId: 'epic-1',
            assignedAgent: 'architect',
            progress: 100,
            createdAt: '2024-01-22T10:00:00Z',
            updatedAt: '2024-01-22T10:30:00Z',
            estimatedTime: 30,
            actualTime: 30,
          },
          {
            id: 'task-2',
            title: 'Configure database connection',
            description: 'Setup MongoDB connection with proper error handling',
            status: 'completed',
            epicId: 'epic-1',
            assignedAgent: 'code-monkey',
            progress: 100,
            createdAt: '2024-01-22T10:30:00Z',
            updatedAt: '2024-01-22T11:00:00Z',
            estimatedTime: 30,
            actualTime: 28,
          },
          {
            id: 'task-3',
            title: 'Implement user authentication',
            description: 'Create login and registration endpoints with JWT',
            status: 'in-progress',
            epicId: 'epic-2',
            assignedAgent: 'code-monkey',
            progress: 65,
            createdAt: '2024-01-22T11:00:00Z',
            updatedAt: '2024-01-22T13:15:00Z',
            estimatedTime: 180,
            actualTime: 135,
          },
          {
            id: 'task-4',
            title: 'Add password hashing',
            description: 'Implement bcrypt for secure password storage',
            status: 'in-progress',
            epicId: 'epic-2',
            assignedAgent: 'code-monkey',
            progress: 80,
            createdAt: '2024-01-22T12:00:00Z',
            updatedAt: '2024-01-22T13:00:00Z',
            estimatedTime: 60,
            actualTime: 48,
          },
          {
            id: 'task-5',
            title: 'Create protected routes',
            description: 'Setup middleware for route authentication',
            status: 'pending',
            epicId: 'epic-2',
            progress: 0,
            createdAt: '2024-01-22T13:00:00Z',
            updatedAt: '2024-01-22T13:00:00Z',
            estimatedTime: 45,
          },
          {
            id: 'task-6',
            title: 'Design database schema',
            description: 'Define MongoDB schemas for all entities',
            status: 'pending',
            epicId: 'epic-3',
            assignedAgent: 'architect',
            progress: 0,
            createdAt: '2024-01-22T13:00:00Z',
            updatedAt: '2024-01-22T13:00:00Z',
            estimatedTime: 120,
          },
          {
            id: 'task-7',
            title: 'Write API documentation',
            description: 'Document all API endpoints with examples',
            status: 'pending',
            epicId: 'epic-4',
            assignedAgent: 'tech-writer',
            progress: 0,
            createdAt: '2024-01-22T13:00:00Z',
            updatedAt: '2024-01-22T13:00:00Z',
            estimatedTime: 90,
          },
        ],
      });
    }, 500);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.get(`/api/projects/${projectId}/tasks`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Get all epics for a project
// Endpoint: GET /api/projects/:projectId/epics
// Request: {}
// Response: { epics: Array<Epic> }
export const getProjectEpics = (projectId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        epics: [
          {
            id: 'epic-1',
            title: 'Project Setup',
            description: 'Initial project configuration and setup',
            status: 'completed',
            progress: 100,
            taskCount: 2,
            completedTaskCount: 2,
            createdAt: '2024-01-22T10:00:00Z',
            updatedAt: '2024-01-22T11:00:00Z',
          },
          {
            id: 'epic-2',
            title: 'Authentication System',
            description: 'User authentication and authorization',
            status: 'in-progress',
            progress: 48,
            taskCount: 3,
            completedTaskCount: 0,
            createdAt: '2024-01-22T11:00:00Z',
            updatedAt: '2024-01-22T13:15:00Z',
          },
          {
            id: 'epic-3',
            title: 'Core Features',
            description: 'Main application features and functionality',
            status: 'not-started',
            progress: 0,
            taskCount: 1,
            completedTaskCount: 0,
            createdAt: '2024-01-22T13:00:00Z',
            updatedAt: '2024-01-22T13:00:00Z',
          },
          {
            id: 'epic-4',
            title: 'Documentation',
            description: 'Technical documentation and guides',
            status: 'not-started',
            progress: 0,
            taskCount: 1,
            completedTaskCount: 0,
            createdAt: '2024-01-22T13:00:00Z',
            updatedAt: '2024-01-22T13:00:00Z',
          },
        ],
      });
    }, 500);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.get(`/api/projects/${projectId}/epics`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Update task status
// Endpoint: PUT /api/tasks/:taskId
// Request: { status: string, progress: number }
// Response: { success: boolean, task: Task }
export const updateTask = (taskId: string, data: Partial<Task>) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        task: {
          id: taskId,
          ...data,
        },
      });
    }, 300);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.put(`/api/tasks/${taskId}`, data);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};
