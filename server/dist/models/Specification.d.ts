import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<ISpecification, {}, {}, {}, mongoose.Document<unknown, {}, ISpecification, {}, {}> & ISpecification & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Specification.d.ts.map