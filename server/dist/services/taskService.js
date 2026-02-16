import Task from '../models/Task';
import Epic from '../models/Epic';
class TaskService {
    async create(taskData) {
        const task = new Task(taskData);
        const savedTask = await task.save();
        // Update epic task count
        await this.updateEpicCounts(taskData.epic);
        return savedTask;
    }
    async listByProject(projectId) {
        return await Task.find({ project: projectId }).sort({ createdAt: -1 });
    }
    async listByEpic(epicId) {
        return await Task.find({ epic: epicId }).sort({ createdAt: -1 });
    }
    async get(taskId) {
        return await Task.findById(taskId);
    }
    async update(taskId, updates) {
        const task = await Task.findByIdAndUpdate(taskId, updates, { new: true, runValidators: true });
        if (task) {
            // Update epic counts if status or epic changed
            await this.updateEpicCounts(task.epic);
        }
        return task;
    }
    async delete(taskId) {
        const task = await Task.findByIdAndDelete(taskId);
        if (task) {
            await this.updateEpicCounts(task.epic);
        }
        return task;
    }
    async updateEpicCounts(epicId) {
        const tasks = await Task.find({ epic: epicId });
        const completedTasks = tasks.filter(t => t.status === 'completed');
        const taskCount = tasks.length;
        const completedTaskCount = completedTasks.length;
        const progress = taskCount > 0 ? Math.round((completedTaskCount / taskCount) * 100) : 0;
        let status = 'not-started';
        if (completedTaskCount === taskCount && taskCount > 0) {
            status = 'completed';
        }
        else if (completedTaskCount > 0) {
            status = 'in-progress';
        }
        await Epic.findByIdAndUpdate(epicId, {
            taskCount,
            completedTaskCount,
            progress,
            status
        });
    }
}
export default new TaskService();
//# sourceMappingURL=taskService.js.map