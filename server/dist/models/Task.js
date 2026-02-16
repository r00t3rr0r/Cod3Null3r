import mongoose, { Schema } from 'mongoose';
const TaskSchema = new Schema({
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
}, {
    timestamps: true
});
export default mongoose.model('Task', TaskSchema);
//# sourceMappingURL=Task.js.map