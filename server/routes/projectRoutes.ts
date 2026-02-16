import express, { Request, Response } from 'express';
import { requireUser } from './middlewares/auth';
import { ALL_ROLES } from 'shared';
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

// Get all projects for the authenticated user
router.get('/', requireUser(ALL_ROLES), async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const projects = await ProjectService.list(userId);
    
    // Transform to match client expected format
    const transformedProjects = projects.map(project => ({
      _id: project._id.toString(),
      name: project.name,
      description: project.description,
      status: project.status,
      createdAt: project.createdAt,
      lastModified: project.lastModified,
      filesCount: project.filesCount,
      linesOfCode: project.linesOfCode,
      technologies: project.technologies,
      type: project.type
    }));

    return res.json({ projects: transformedProjects });
  } catch (error: unknown) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

// Get a single project by ID
router.get('/:id', requireUser(ALL_ROLES), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const project = await ProjectService.get(id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Verify ownership
    if (project.owner.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    return res.json({ 
      project: {
        _id: project._id.toString(),
        name: project.name,
        description: project.description,
        status: project.status,
        createdAt: project.createdAt,
        lastModified: project.lastModified,
        filesCount: project.filesCount,
        linesOfCode: project.linesOfCode,
        technologies: project.technologies,
        type: project.type
      }
    });
  } catch (error: unknown) {
    console.error('Error fetching project:', error);
    return res.status(500).json({ message: 'Failed to fetch project' });
  }
});

// Create a new project
router.post('/', requireUser(ALL_ROLES), async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, type, technologies } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    const project = await ProjectService.create({
      name,
      description,
      owner: new Types.ObjectId(userId),
      type: type || 'new',
      technologies: technologies || []
    });

    return res.status(201).json({ 
      success: true, 
      projectId: project._id.toString() 
    });
  } catch (error: unknown) {
    console.error('Error creating project:', error);
    return res.status(500).json({ message: 'Failed to create project' });
  }
});

// Update a project
router.put('/:id', requireUser(ALL_ROLES), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    const updates = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Verify ownership
    const existingProject = await ProjectService.get(id);
    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (existingProject.owner.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const project = await ProjectService.update(id, updates);
    
    return res.json({ 
      success: true, 
      project 
    });
  } catch (error: unknown) {
    console.error('Error updating project:', error);
    return res.status(500).json({ message: 'Failed to update project' });
  }
});

// Delete a project
router.delete('/:id', requireUser(ALL_ROLES), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Verify ownership
    const existingProject = await ProjectService.get(id);
    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (existingProject.owner.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await ProjectService.delete(id);
    
    return res.json({ success: true });
  } catch (error: unknown) {
    console.error('Error deleting project:', error);
    return res.status(500).json({ message: 'Failed to delete project' });
  }
});

// Duplicate a project
router.post('/:id/duplicate', requireUser(ALL_ROLES), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Verify ownership
    const existingProject = await ProjectService.get(id);
    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (existingProject.owner.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const duplicate = await ProjectService.duplicate(id, userId);
    
    if (!duplicate) {
      return res.status(404).json({ message: 'Failed to duplicate project' });
    }

    return res.json({ 
      success: true, 
      projectId: duplicate._id.toString() 
    });
  } catch (error: unknown) {
    console.error('Error duplicating project:', error);
    return res.status(500).json({ message: 'Failed to duplicate project' });
  }
});

export default router;
