import mongoose, { Schema, Document } from 'mongoose';

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

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    status: { 
      type: String, 
      required: true, 
      enum: ['pending', 'in-progress', 'completed', 'blocked'],
      default: 'pending'
    },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    epic: { type: Schema.Types.ObjectId, ref: 'Epic', required: true, index: true },
    assignedAgent: { type: String },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    estimatedTime: { type: Number },
    actualTime: { type: Number }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ITask>('Task', TaskSchema);
