import Task, { ITask } from '../models/Task';
import Epic from '../models/Epic';
import mongoose from 'mongoose';

class TaskService {
  async create(taskData: {
    title: string;
    description: string;
    project: mongoose.Types.ObjectId | string;
    epic: mongoose.Types.ObjectId | string;
    status?: 'pending' | 'in-progress' | 'completed' | 'blocked';
    assignedAgent?: string;
    estimatedTime?: number;
  }): Promise<ITask> {
    const task = new Task(taskData);
    const savedTask = await task.save();
    
    // Update epic task count
    await this.updateEpicCounts(taskData.epic as string);
    
    return savedTask;
  }

  async listByProject(projectId: string): Promise<ITask[]> {
    return await Task.find({ project: projectId }).sort({ createdAt: -1 });
  }

  async listByEpic(epicId: string): Promise<ITask[]> {
    return await Task.find({ epic: epicId }).sort({ createdAt: -1 });
  }

  async get(taskId: string): Promise<ITask | null> {
    return await Task.findById(taskId);
  }

  async update(taskId: string, updates: Partial<ITask>): Promise<ITask | null> {
    const task = await Task.findByIdAndUpdate(
      taskId,
      updates,
      { new: true, runValidators: true }
    );
    
    if (task) {
      // Update epic counts if status or epic changed
      await this.updateEpicCounts(task.epic as unknown as string);
    }
    
    return task;
  }

  async delete(taskId: string): Promise<ITask | null> {
    const task = await Task.findByIdAndDelete(taskId);
    
    if (task) {
      await this.updateEpicCounts(task.epic as unknown as string);
    }
    
    return task;
  }

  private async updateEpicCounts(epicId: string): Promise<void> {
    const tasks = await Task.find({ epic: epicId });
    const completedTasks = tasks.filter(t => t.status === 'completed');
    const taskCount = tasks.length;
    const completedTaskCount = completedTasks.length;
    const progress = taskCount > 0 ? Math.round((completedTaskCount / taskCount) * 100) : 0;
    
    let status: 'not-started' | 'in-progress' | 'completed' = 'not-started';
    if (completedTaskCount === taskCount && taskCount > 0) {
      status = 'completed';
    } else if (completedTaskCount > 0) {
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
