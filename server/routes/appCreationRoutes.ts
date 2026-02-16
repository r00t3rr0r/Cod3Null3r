import express, { Request, Response } from 'express';
import { requireUser } from './middlewares/auth';
import { ALL_ROLES } from 'shared';

const router = express.Router();

interface AuthRequest extends Request {
  user?: {
    _id: string;
    email: string;
    role: string;
  };
}

// Get clarification questions for app creation
router.post('/questions', requireUser(ALL_ROLES), async (req: AuthRequest, res: Response) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ message: 'Description is required' });
    }

    // Return predefined questions (in production, this could be LLM-generated)
    const questions = [
      {
        id: 'q1',
        question: 'Should users be able to collaborate on tasks in real-time?',
        type: 'multiple-choice',
        options: ['Yes, with live updates', 'No, just individual tasks', 'Optional feature', 'Not sure']
      },
      {
        id: 'q2',
        question: 'Do you need real-time notifications?',
        type: 'yes-no'
      },
      {
        id: 'q3',
        question: "What's your target audience?",
        type: 'text'
      },
      {
        id: 'q4',
        question: 'Any specific design preferences?',
        type: 'multiple-choice',
        options: ['Modern & Minimalist', 'Colorful & Vibrant', 'Professional & Corporate', 'No preference']
      },
      {
        id: 'q5',
        question: 'Do you need user authentication?',
        type: 'yes-no'
      }
    ];

    return res.json({ questions });
  } catch (error: unknown) {
    console.error('Error generating questions:', error);
    return res.status(500).json({ message: 'Failed to generate questions' });
  }
});

// Get technology stack recommendation
router.post('/tech-stack', requireUser(ALL_ROLES), async (req: AuthRequest, res: Response) => {
  try {
    const { requirements } = req.body;

    if (!requirements) {
      return res.status(400).json({ message: 'Requirements are required' });
    }

    // Return predefined tech stack (in production, this could be LLM-recommended)
    const techStack = {
      frontend: ['React 18', 'TypeScript', 'Tailwind CSS', 'React Router'],
      backend: ['Node.js', 'Express.js', 'TypeScript'],
      database: ['MongoDB', 'Mongoose'],
      tools: ['Vite', 'ESLint', 'Prettier', 'Jest']
    };

    const explanation = 'This stack provides a modern, scalable foundation for your application with excellent developer experience and performance.';

    return res.json({ techStack, explanation });
  } catch (error: unknown) {
    console.error('Error generating tech stack:', error);
    return res.status(500).json({ message: 'Failed to generate tech stack' });
  }
});

// Get development roadmap
router.post('/roadmap', requireUser(ALL_ROLES), async (req: AuthRequest, res: Response) => {
  try {
    const { requirements, techStack } = req.body;

    if (!requirements || !techStack) {
      return res.status(400).json({ message: 'Requirements and tech stack are required' });
    }

    // Return predefined roadmap (in production, this could be LLM-generated)
    const roadmap = [
      {
        phase: 'Phase 1: Project Setup',
        tasks: ['Initialize project structure', 'Configure build tools', 'Set up database connection', 'Create base components'],
        estimatedDays: 2
      },
      {
        phase: 'Phase 2: Authentication',
        tasks: ['Implement user registration', 'Implement user login', 'Set up JWT tokens', 'Create protected routes'],
        estimatedDays: 3
      },
      {
        phase: 'Phase 3: Core Features',
        tasks: ['Build main features', 'Implement business logic', 'Create API endpoints', 'Add data validation'],
        estimatedDays: 5
      },
      {
        phase: 'Phase 4: UI/UX',
        tasks: ['Design responsive layouts', 'Implement dark mode', 'Add animations', 'Optimize performance'],
        estimatedDays: 3
      },
      {
        phase: 'Phase 5: Testing & Deployment',
        tasks: ['Write unit tests', 'Integration testing', 'Deploy to production', 'Monitor and optimize'],
        estimatedDays: 2
      }
    ];

    return res.json({ roadmap });
  } catch (error: unknown) {
    console.error('Error generating roadmap:', error);
    return res.status(500).json({ message: 'Failed to generate roadmap' });
  }
});

// Start code generation
router.post('/start', requireUser(ALL_ROLES), async (req: AuthRequest, res: Response) => {
  try {
    const { projectName, requirements, techStack } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!projectName || !requirements || !techStack) {
      return res.status(400).json({ message: 'Project name, requirements, and tech stack are required' });
    }

    // In production, this would trigger actual code generation
    // For now, just return success with a placeholder ID
    const projectId = new Date().getTime().toString(36);

    return res.json({ 
      success: true, 
      projectId 
    });
  } catch (error: unknown) {
    console.error('Error starting code generation:', error);
    return res.status(500).json({ message: 'Failed to start code generation' });
  }
});

export default router;
