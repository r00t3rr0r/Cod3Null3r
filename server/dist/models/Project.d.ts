import mongoose, { Document } from 'mongoose';
export interface IProject extends Document {
    name: string;
    description: string;
    status: 'not-started' | 'in-progress' | 'completed' | 'archived';
    owner: mongoose.Types.ObjectId;
    type: 'new' | 'imported';
    technologies: string[];
    filesCount: number;
    linesOfCode: number;
    createdAt: Date;
    lastModified: Date;
}
declare const _default: mongoose.Model<IProject, {}, {}, {}, mongoose.Document<unknown, {}, IProject, {}, {}> & IProject & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Project.d.ts.map