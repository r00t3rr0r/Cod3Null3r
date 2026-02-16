import mongoose, { Document } from 'mongoose';
export interface IEpic extends Document {
    title: string;
    description: string;
    status: 'not-started' | 'in-progress' | 'completed';
    project: mongoose.Types.ObjectId;
    progress: number;
    taskCount: number;
    completedTaskCount: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IEpic, {}, {}, {}, mongoose.Document<unknown, {}, IEpic, {}, {}> & IEpic & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Epic.d.ts.map