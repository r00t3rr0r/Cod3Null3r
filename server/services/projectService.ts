import Project, { IProject } from '../models/Project';
import mongoose from 'mongoose';

class ProjectService {
  async create(projectData: {
    name: string;
    description: string;
    owner: mongoose.Types.ObjectId | string;
    type?: 'new' | 'imported';
    technologies?: string[];
  }): Promise<IProject> {
    const project = new Project(projectData);
    return await project.save();
  }

  async list(userId: mongoose.Types.ObjectId | string): Promise<IProject[]> {
    return await Project.find({ owner: userId }).sort({ lastModified: -1 });
  }

  async get(projectId: string): Promise<IProject | null> {
    return await Project.findById(projectId);
  }

  async update(projectId: string, updates: Partial<IProject>): Promise<IProject | null> {
    return await Project.findByIdAndUpdate(
      projectId,
      { ...updates, lastModified: new Date() },
      { new: true, runValidators: true }
    );
  }

  async delete(projectId: string): Promise<IProject | null> {
    return await Project.findByIdAndDelete(projectId);
  }

  async duplicate(projectId: string, userId: mongoose.Types.ObjectId | string): Promise<IProject | null> {
    const originalProject = await Project.findById(projectId);
    if (!originalProject) {
      return null;
    }

    const duplicateData = {
      name: `${originalProject.name} (Copy)`,
      description: originalProject.description,
      owner: userId,
      type: originalProject.type,
      technologies: originalProject.technologies,
      status: 'not-started' as const
    };

    const duplicate = new Project(duplicateData);
    return await duplicate.save();
  }
}

export default new ProjectService();
