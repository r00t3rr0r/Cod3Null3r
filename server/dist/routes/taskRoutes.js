import express from 'express';
import { requireUser } from './middlewares/auth';
import { ALL_ROLES } from 'shared';
import TaskService from '../services/taskService';
import EpicService from '../services/epicService';
import ProjectService from '../services/projectService';
const router = express.Router();
// Get all tasks for a project
router.get('/projects/:projectId/tasks', requireUser(ALL_ROLES), async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        // Verify project ownership
        const project = await ProjectService.get(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (project.owner.toString() !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const tasks = await TaskService.listByProject(projectId);
        const transformedTasks = tasks.map(task => ({
            id: task._id.toString(),
            title: task.title,
            description: task.description,
            status: task.status,
            epicId: task.epic.toString(),
            assignedAgent: task.assignedAgent,
            progress: task.progress,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
            estimatedTime: task.estimatedTime,
            actualTime: task.actualTime
        }));
        return res.json({ tasks: transformedTasks });
    }
    catch (error) {
        console.error('Error fetching tasks:', error);
        return res.status(500).json({ message: 'Failed to fetch tasks' });
    }
});
// Get all epics for a project
router.get('/projects/:projectId/epics', requireUser(ALL_ROLES), async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        // Verify project ownership
        const project = await ProjectService.get(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (project.owner.toString() !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const epics = await EpicService.listByProject(projectId);
        const transformedEpics = epics.map(epic => ({
            id: epic._id.toString(),
            title: epic.title,
            description: epic.description,
            status: epic.status,
            progress: epic.progress,
            taskCount: epic.taskCount,
            completedTaskCount: epic.completedTaskCount,
            createdAt: epic.createdAt,
            updatedAt: epic.updatedAt
        }));
        return res.json({ epics: transformedEpics });
    }
    catch (error) {
        console.error('Error fetching epics:', error);
        return res.status(500).json({ message: 'Failed to fetch epics' });
    }
});
// Update a task
router.put('/tasks/:taskId', requireUser(ALL_ROLES), async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user?._id;
        const updates = req.body;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const task = await TaskService.get(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        // Verify project ownership
        const project = await ProjectService.get(task.project.toString());
        if (!project || project.owner.toString() !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const updatedTask = await TaskService.update(taskId, updates);
        return res.json({
            success: true,
            task: updatedTask ? {
                id: updatedTask._id.toString(),
                title: updatedTask.title,
                description: updatedTask.description,
                status: updatedTask.status,
                epicId: updatedTask.epic.toString(),
                assignedAgent: updatedTask.assignedAgent,
                progress: updatedTask.progress,
                createdAt: updatedTask.createdAt,
                updatedAt: updatedTask.updatedAt,
                estimatedTime: updatedTask.estimatedTime,
                actualTime: updatedTask.actualTime
            } : null
        });
    }
    catch (error) {
        console.error('Error updating task:', error);
        return res.status(500).json({ message: 'Failed to update task' });
    }
});
export default router;
//# sourceMappingURL=taskRoutes.js.map