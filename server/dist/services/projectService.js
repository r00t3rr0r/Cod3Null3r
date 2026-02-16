import Project from '../models/Project';
class ProjectService {
    async create(projectData) {
        const project = new Project(projectData);
        return await project.save();
    }
    async list(userId) {
        return await Project.find({ owner: userId }).sort({ lastModified: -1 });
    }
    async get(projectId) {
        return await Project.findById(projectId);
    }
    async update(projectId, updates) {
        return await Project.findByIdAndUpdate(projectId, { ...updates, lastModified: new Date() }, { new: true, runValidators: true });
    }
    async delete(projectId) {
        return await Project.findByIdAndDelete(projectId);
    }
    async duplicate(projectId, userId) {
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
            status: 'not-started'
        };
        const duplicate = new Project(duplicateData);
        return await duplicate.save();
    }
}
export default new ProjectService();
//# sourceMappingURL=projectService.js.map