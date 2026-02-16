import mongoose, { Schema, Document } from 'mongoose';

export interface ISpecification extends Document {
  project: mongoose.Types.ObjectId;
  projectName: string;
  projectDescription: string;
  targetAudience: string;
  objectives: string[];
  functionalRequirements: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: 'core' | 'feature' | 'enhancement';
  }>;
  technicalRequirements: Array<{
    layer: 'frontend' | 'backend' | 'database' | 'infrastructure';
    technology: string;
    version?: string;
    rationale: string;
  }>;
  apiEndpoints: Array<{
    id: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    path: string;
    description: string;
    authentication: boolean;
    requestSchema?: Record<string, unknown>;
    responseSchema?: Record<string, unknown>;
  }>;
  dataModels: Array<{
    id: string;
    name: string;
    description: string;
    fields: Array<{
      name: string;
      type: string;
      required: boolean;
      description?: string;
    }>;
    relationships?: string[];
  }>;
  architecture: string;
  securityConsiderations: string[];
  performanceRequirements: string[];
  scalabilityPlan: string;
  deploymentStrategy: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

const SpecificationSchema: Schema = new Schema(
  {
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
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ISpecification>('Specification', SpecificationSchema);
