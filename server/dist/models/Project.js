import mongoose, { Schema } from 'mongoose';
const ProjectSchema = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ['not-started', 'in-progress', 'completed', 'archived'],
        default: 'not-started'
    },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
        type: String,
        required: true,
        enum: ['new', 'imported'],
        default: 'new'
    },
    technologies: { type: [String], default: [] },
    filesCount: { type: Number, default: 0 },
    linesOfCode: { type: Number, default: 0 },
    lastModified: { type: Date, default: Date.now }
}, {
    timestamps: true
});
// Update lastModified on every save
ProjectSchema.pre('save', function (next) {
    this.lastModified = new Date();
    next();
});
export default mongoose.model('Project', ProjectSchema);
//# sourceMappingURL=Project.js.map