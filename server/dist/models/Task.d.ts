import mongoose, { Document } from 'mongoose';
export interface ITask extends Document {
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed' | 'blocked';
    project: mongoose.Types.ObjectId;
    epic: mongoose.Types.ObjectId;
    assignedAgent?: string;
    progress: number;
    estimatedTime?: number;
    actualTime?: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ITask, {}, {}, {}, mongoose.Document<unknown, {}, ITask, {}, {}> & ITask & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Task.d.ts.map