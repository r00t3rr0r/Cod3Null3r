import { ITask } from '../models/Task';
import mongoose from 'mongoose';
declare class TaskService {
    create(taskData: {
        title: string;
        description: string;
        project: mongoose.Types.ObjectId | string;
        epic: mongoose.Types.ObjectId | string;
        status?: 'pending' | 'in-progress' | 'completed' | 'blocked';
        assignedAgent?: string;
        estimatedTime?: number;
    }): Promise<ITask>;
    listByProject(projectId: string): Promise<ITask[]>;
    listByEpic(epicId: string): Promise<ITask[]>;
    get(taskId: string): Promise<ITask | null>;
    update(taskId: string, updates: Partial<ITask>): Promise<ITask | null>;
    delete(taskId: string): Promise<ITask | null>;
    private updateEpicCounts;
}
declare const _default: TaskService;
export default _default;
//# sourceMappingURL=taskService.d.ts.map