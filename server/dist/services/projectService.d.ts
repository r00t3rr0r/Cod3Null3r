import { IProject } from '../models/Project';
import mongoose from 'mongoose';
declare class ProjectService {
    create(projectData: {
        name: string;
        description: string;
        owner: mongoose.Types.ObjectId | string;
        type?: 'new' | 'imported';
        technologies?: string[];
    }): Promise<IProject>;
    list(userId: mongoose.Types.ObjectId | string): Promise<IProject[]>;
    get(projectId: string): Promise<IProject | null>;
    update(projectId: string, updates: Partial<IProject>): Promise<IProject | null>;
    delete(projectId: string): Promise<IProject | null>;
    duplicate(projectId: string, userId: mongoose.Types.ObjectId | string): Promise<IProject | null>;
}
declare const _default: ProjectService;
export default _default;
//# sourceMappingURL=projectService.d.ts.map