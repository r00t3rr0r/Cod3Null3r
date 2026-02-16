import api from './api';

export interface Requirement {
  id: string;
  category: string;
  description: string;
  priority: string;
}

export interface TechStack {
  frontend: string[];
  backend: string[];
  database: string[];
  tools: string[];
}

export interface RoadmapPhase {
  phase: string;
  tasks: string[];
  estimatedDays: number;
}

// Description: Get clarification questions for app creation
// Endpoint: GET /api/app-creation/questions
// Request: { description: string }
// Response: { questions: Array<{ id: string, question: string, type: string, options?: string[] }> }
export const getClarificationQuestions = (description: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        questions: [
          {
            id: 'q1',
            question: 'Should users be able to collaborate on tasks in real-time?',
            type: 'multiple-choice',
            options: ['Yes, with live updates', 'No, just individual tasks', 'Optional feature', 'Not sure'],
          },
          {
            id: 'q2',
            question: 'Do you need real-time notifications?',
            type: 'yes-no',
          },
          {
            id: 'q3',
            question: "What's your target audience?",
            type: 'text',
          },
          {
            id: 'q4',
            question: 'Any specific design preferences?',
            type: 'multiple-choice',
            options: ['Modern & Minimalist', 'Colorful & Vibrant', 'Professional & Corporate', 'No preference'],
          },
          {
            id: 'q5',
            question: 'Do you need user authentication?',
            type: 'yes-no',
          },
          {
            id: 'q6',
            question: 'Should the app support dark mode?',
            type: 'yes-no',
          },
          {
            id: 'q7',
            question: 'What is your expected user base size?',
            type: 'multiple-choice',
            options: ['< 100 users', '100 - 1000 users', '1000 - 10000 users', '> 10000 users'],
          },
        ],
      });
    }, 800);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.post('/api/app-creation/questions', { description });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get technology stack recommendation
// Endpoint: POST /api/app-creation/tech-stack
// Request: { requirements: Array<Requirement> }
// Response: { techStack: TechStack, explanation: string }
export const getTechStackRecommendation = (requirements: Requirement[]) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        techStack: {
          frontend: ['React 18', 'TypeScript', 'Tailwind CSS', 'React Router'],
          backend: ['Node.js', 'Express.js', 'TypeScript'],
          database: ['MongoDB', 'Mongoose'],
          tools: ['Vite', 'ESLint', 'Prettier', 'Jest'],
        },
        explanation: 'This stack provides a modern, scalable foundation for your application with excellent developer experience and performance.',
      });
    }, 1000);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.post('/api/app-creation/tech-stack', { requirements });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get development roadmap
// Endpoint: POST /api/app-creation/roadmap
// Request: { requirements: Array<Requirement>, techStack: TechStack }
// Response: { roadmap: Array<{ phase: string, tasks: string[], estimatedDays: number }> }
export const getDevelopmentRoadmap = (requirements: Requirement[], techStack: TechStack) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        roadmap: [
          {
            phase: 'Phase 1: Project Setup',
            tasks: ['Initialize project structure', 'Configure build tools', 'Set up database connection', 'Create base components'],
            estimatedDays: 2,
          },
          {
            phase: 'Phase 2: Authentication',
            tasks: ['Implement user registration', 'Implement user login', 'Set up JWT tokens', 'Create protected routes'],
            estimatedDays: 3,
          },
          {
            phase: 'Phase 3: Core Features',
            tasks: ['Build task management', 'Implement real-time updates', 'Create collaboration features', 'Add notifications'],
            estimatedDays: 5,
          },
          {
            phase: 'Phase 4: UI/UX',
            tasks: ['Design responsive layouts', 'Implement dark mode', 'Add animations', 'Optimize performance'],
            estimatedDays: 3,
          },
          {
            phase: 'Phase 5: Testing & Deployment',
            tasks: ['Write unit tests', 'Integration testing', 'Deploy to production', 'Monitor and optimize'],
            estimatedDays: 2,
          },
        ],
      });
    }, 1200);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.post('/api/app-creation/roadmap', { requirements, techStack });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Start code generation
// Endpoint: POST /api/app-creation/start
// Request: { projectName: string, requirements: Array<Requirement>, techStack: TechStack }
// Response: { success: boolean, projectId: string }
interface StartCodeGenerationRequest {
  projectName: string;
  requirements: Requirement[];
  techStack: TechStack;
}

export const startCodeGeneration = (data: StartCodeGenerationRequest) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        projectId: Math.random().toString(36).substr(2, 9),
      });
    }, 500);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.post('/api/app-creation/start', data);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};