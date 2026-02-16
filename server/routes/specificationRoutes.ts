import express, { Request, Response } from 'express';
import { requireUser } from './middlewares/auth';
import { ALL_ROLES } from 'shared';
import SpecificationService from '../services/specificationService';
import { ISpecification } from '../models/Specification';
import ProjectService from '../services/projectService';
import { Types } from 'mongoose';

const router = express.Router();

interface AuthRequest extends Request {
  user?: {
    _id: string;
    email: string;
    role: string;
  };
}

// Generate a comprehensive app specification
router.post('/generate', requireUser(ALL_ROLES), async (req: AuthRequest, res: Response) => {
  try {
    const { projectName, description, requirements, projectId } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!projectName || !description) {
      return res.status(400).json({ message: 'Project name and description are required' });
    }

    // Create a comprehensive specification based on the input
    const specification = await SpecificationService.create({
      project: projectId ? new Types.ObjectId(projectId) : new Types.ObjectId(),
      projectName,
      projectDescription: description,
      targetAudience: 'General users',
      objectives: [
        'Deliver a scalable and maintainable full-stack application',
        'Implement robust authentication and authorization',
        'Provide excellent user experience',
        'Ensure high performance and reliability'
      ],
      functionalRequirements: [
        {
          id: 'fr-1',
          title: 'User Authentication',
          description: 'Users can register, login, and manage their profiles with secure JWT-based authentication',
          priority: 'high' as const,
          category: 'core' as const
        },
        {
          id: 'fr-2',
          title: 'Core Functionality',
          description: 'Main application features and functionality',
          priority: 'high' as const,
          category: 'feature' as const
        }
      ],
      technicalRequirements: [
        {
          layer: 'frontend' as const,
          technology: 'React 18',
          version: '18.x',
          rationale: 'Modern UI framework with excellent ecosystem and performance'
        },
        {
          layer: 'backend' as const,
          technology: 'Node.js',
          version: '20.x LTS',
          rationale: 'JavaScript runtime for unified full-stack development'
        },
        {
          layer: 'database' as const,
          technology: 'MongoDB',
          rationale: 'Flexible document database for rapid development'
        }
      ],
      apiEndpoints: [
        {
          id: 'api-auth-1',
          method: 'POST' as const,
          path: '/api/auth/register',
          description: 'Register a new user account',
          authentication: false
        },
        {
          id: 'api-auth-2',
          method: 'POST' as const,
          path: '/api/auth/login',
          description: 'Authenticate user and get JWT token',
          authentication: false
        }
      ],
      dataModels: [
        {
          id: 'model-user',
          name: 'User',
          description: 'Represents an application user',
          fields: [
            { name: '_id', type: 'ObjectId', required: true, description: 'Unique identifier' },
            { name: 'email', type: 'String', required: true, description: 'User email address' },
            { name: 'password', type: 'String', required: true, description: 'Hashed password' }
          ]
        }
      ],
      architecture: 'Microservices-inspired monolithic architecture with clear separation of concerns',
      securityConsiderations: [
        'Password hashing using bcrypt',
        'JWT tokens with appropriate expiration',
        'HTTPS/TLS for all communications',
        'Input validation and sanitization'
      ],
      performanceRequirements: [
        'Page load time < 2 seconds',
        'API response time < 500ms for 95% of requests'
      ],
      scalabilityPlan: 'Horizontal scaling through load balancing',
      deploymentStrategy: 'Docker containerization with Kubernetes orchestration',
      version: '1.0.0'
    } as Partial<ISpecification>);

    return res.json({ 
      specification: {
        id: specification._id.toString(),
        projectName: specification.projectName,
        projectDescription: specification.projectDescription,
        targetAudience: specification.targetAudience,
        objectives: specification.objectives,
        functionalRequirements: specification.functionalRequirements,
        technicalRequirements: specification.technicalRequirements,
        apiEndpoints: specification.apiEndpoints,
        dataModels: specification.dataModels,
        architecture: specification.architecture,
        securityConsiderations: specification.securityConsiderations,
        performanceRequirements: specification.performanceRequirements,
        scalabilityPlan: specification.scalabilityPlan,
        deploymentStrategy: specification.deploymentStrategy,
        generatedAt: specification.createdAt.toISOString(),
        version: specification.version
      }
    });
  } catch (error: unknown) {
    console.error('Error generating specification:', error);
    return res.status(500).json({ message: 'Failed to generate specification' });
  }
});

// Get specification by ID
router.get('/:specId', requireUser(ALL_ROLES), async (req: AuthRequest, res: Response) => {
  try {
    const { specId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const specification = await SpecificationService.get(specId);
    
    if (!specification) {
      return res.status(404).json({ message: 'Specification not found' });
    }

    // Verify project ownership if project exists
    if (specification.project) {
      const project = await ProjectService.get(specification.project.toString());
      if (project && project.owner.toString() !== userId) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    return res.json({ 
      specification: {
        id: specification._id.toString(),
        projectName: specification.projectName,
        projectDescription: specification.projectDescription,
        targetAudience: specification.targetAudience,
        objectives: specification.objectives,
        functionalRequirements: specification.functionalRequirements,
        technicalRequirements: specification.technicalRequirements,
        apiEndpoints: specification.apiEndpoints,
        dataModels: specification.dataModels,
        architecture: specification.architecture,
        securityConsiderations: specification.securityConsiderations,
        performanceRequirements: specification.performanceRequirements,
        scalabilityPlan: specification.scalabilityPlan,
        deploymentStrategy: specification.deploymentStrategy,
        generatedAt: specification.createdAt.toISOString(),
        version: specification.version
      }
    });
  } catch (error: unknown) {
    console.error('Error fetching specification:', error);
    return res.status(500).json({ message: 'Failed to fetch specification' });
  }
});

// Export specification
router.get('/:specId/export', requireUser(ALL_ROLES), async (req: AuthRequest, res: Response) => {
  try {
    const { specId } = req.params;
    const { format } = req.query;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const specification = await SpecificationService.get(specId);
    
    if (!specification) {
      return res.status(404).json({ message: 'Specification not found' });
    }

    // Verify project ownership if project exists
    if (specification.project) {
      const project = await ProjectService.get(specification.project.toString());
      if (project && project.owner.toString() !== userId) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    // For now, return a download URL (in production, this would generate actual files)
    const fileExtension = format === 'pdf' ? 'pdf' : 'md';
    return res.json({ 
      url: `/downloads/specification-${specId}.${fileExtension}` 
    });
  } catch (error: unknown) {
    console.error('Error exporting specification:', error);
    return res.status(500).json({ message: 'Failed to export specification' });
  }
});

export default router;
