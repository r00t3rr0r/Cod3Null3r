import api from './api';

// Description: Get all agents status
// Endpoint: GET /api/agents/status
// Request: {}
// Response: { agents: Array<Agent> }
export const getAgentsStatus = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        agents: [
          {
            id: 'spec-writer',
            name: 'Specification Writer',
            role: 'Requirements Gathering',
            status: 'completed',
            tasksCompleted: 1,
          },
          {
            id: 'architect',
            name: 'Architect',
            role: 'System Design',
            status: 'completed',
            tasksCompleted: 1,
          },
          {
            id: 'tech-lead',
            name: 'Tech Lead',
            role: 'Development Planning',
            status: 'completed',
            tasksCompleted: 1,
          },
          {
            id: 'code-monkey',
            name: 'Code Monkey',
            role: 'Implementation',
            status: 'working',
            currentTask: 'Writing authentication module',
            progress: 65,
            timeSpent: 135,
          },
          {
            id: 'reviewer',
            name: 'Reviewer',
            role: 'Code Quality',
            status: 'waiting',
          },
          {
            id: 'debugger',
            name: 'Debugger',
            role: 'Error Handling',
            status: 'waiting',
          },
          {
            id: 'tech-writer',
            name: 'Technical Writer',
            role: 'Documentation',
            status: 'waiting',
          },
        ],
      });
    }, 500);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.get('/api/agents/status');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get activity feed for a project
// Endpoint: GET /api/agents/activity/:projectId
// Request: {}
// Response: { activities: Array<ActivityItem> }
export const getActivityFeed = (projectId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        activities: [
          {
            id: 'act1',
            agentId: 'spec-writer',
            agentName: 'Specification Writer',
            task: 'Analyzed requirements and created specification',
            status: 'completed',
            filesModified: [],
            timeSpent: 180,
            timestamp: '2024-01-22T10:00:00Z',
          },
          {
            id: 'act2',
            agentId: 'architect',
            agentName: 'Architect',
            task: 'Designed system architecture and selected tech stack',
            status: 'completed',
            filesModified: [],
            timeSpent: 240,
            timestamp: '2024-01-22T10:15:00Z',
          },
          {
            id: 'act3',
            agentId: 'code-monkey',
            agentName: 'Code Monkey',
            task: 'Writing authentication module',
            status: 'working',
            filesModified: ['auth.ts', 'middleware.ts'],
            timeSpent: 135,
            timestamp: '2024-01-22T10:30:00Z',
          },
        ],
      });
    }, 500);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.get(`/api/agents/activity/${projectId}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Send feedback to an agent
// Endpoint: POST /api/agents/feedback
// Request: { projectId: string, agentId: string, feedback: string }
// Response: { success: boolean }
export const sendAgentFeedback = (data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.post('/api/agents/feedback', data);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};