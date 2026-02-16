import mongoose, { Schema } from 'mongoose';
const SpecificationSchema = new Schema({
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    projectName: { type: String, required: true },
    projectDescription: { type: String, required: true },
    targetAudience: { type: String, default: 'General users' },
    objectives: { type: [String], default: [] },
    functionalRequirements: { type: Schema.Types.Mixed, default: [] },
    technicalRequirements: { type: Schema.Types.Mixed, default: [] },
    apiEndpoints: { type: Schema.Types.Mixed, default: [] },
    dataModels: { type: Schema.Types.Mixed, default: [] },
    architecture: { type: String, default: '' },
    securityConsiderations: { type: [String], default: [] },
    performanceRequirements: { type: [String], default: [] },
    scalabilityPlan: { type: String, default: '' },
    deploymentStrategy: { type: String, default: '' },
    version: { type: String, default: '1.0.0' }
}, {
    timestamps: true
});
export default mongoose.model('Specification', SpecificationSchema);
//# sourceMappingURL=Specification.js.map