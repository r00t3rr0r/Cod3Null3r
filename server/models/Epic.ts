import mongoose, { Schema, Document } from 'mongoose';

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

const EpicSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    status: { 
      type: String, 
      required: true, 
      enum: ['not-started', 'in-progress', 'completed'],
      default: 'not-started'
    },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    taskCount: { type: Number, default: 0 },
    completedTaskCount: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IEpic>('Epic', EpicSchema);
