import mongoose, { Schema } from 'mongoose';
const EpicSchema = new Schema({
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
}, {
    timestamps: true
});
export default mongoose.model('Epic', EpicSchema);
//# sourceMappingURL=Epic.js.map