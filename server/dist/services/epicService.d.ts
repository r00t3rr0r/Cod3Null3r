import { IEpic } from '../models/Epic';
import mongoose from 'mongoose';
declare class EpicService {
    create(epicData: {
        title: string;
        description: string;
        project: mongoose.Types.ObjectId | string;
        status?: 'not-started' | 'in-progress' | 'completed';
    }): Promise<IEpic>;
    listByProject(projectId: string): Promise<IEpic[]>;
    get(epicId: string): Promise<IEpic | null>;
    update(epicId: string, updates: Partial<IEpic>): Promise<IEpic | null>;
    delete(epicId: string): Promise<IEpic | null>;
}
declare const _default: EpicService;
export default _default;
//# sourceMappingURL=epicService.d.ts.map