import api from './api';

export interface FunctionalRequirement {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'core' | 'feature' | 'enhancement';
}

export interface TechRequirement {
  layer: 'frontend' | 'backend' | 'database' | 'infrastructure';
  technology: string;
  version?: string;
  rationale: string;
}

export interface APIEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  authentication: boolean;
  requestSchema?: Record<string, unknown>;
  responseSchema?: Record<string, unknown>;
}

export interface DataModel {
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
}

export interface AppSpecification {
  id: string;
  projectName: string;
  projectDescription: string;
  targetAudience: string;
  objectives: string[];
  functionalRequirements: FunctionalRequirement[];
  technicalRequirements: TechRequirement[];
  apiEndpoints: APIEndpoint[];
  dataModels: DataModel[];
  architecture: string;
  securityConsiderations: string[];
  performanceRequirements: string[];
  scalabilityPlan: string;
  deploymentStrategy: string;
  generatedAt: string;
  version: string;
}

// Description: Generate comprehensive app specification
// Endpoint: POST /api/specifications/generate
// Request: { projectName: string, description: string, requirements: any[] }
// Response: { specification: AppSpecification }
export const generateSpecification = (
  projectName: string,
  description: string,
  requirements: Record<string, unknown>[]
) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        specification: {
          id: Math.random().toString(36).substr(2, 9),
          projectName,
          projectDescription: description,
          targetAudience: 'All user types',
          objectives: [
            'Deliver a scalable and maintainable full-stack application',
            'Implement robust authentication and authorization',
            'Provide excellent user experience',
            'Ensure high performance and reliability',
          ],
          functionalRequirements: [
            {
              id: 'fr-1',
              title: 'User Authentication',
              description: 'Users can register, login, and manage their profiles with secure JWT-based authentication',
              priority: 'high',
              category: 'core',
            },
            {
              id: 'fr-2',
              title: 'Real-time Data Synchronization',
              description: 'Application supports real-time updates across multiple clients',
              priority: 'high',
              category: 'feature',
            },
            {
              id: 'fr-3',
              title: 'Role-Based Access Control',
              description: 'Different user roles with specific permissions and capabilities',
              priority: 'high',
              category: 'core',
            },
            {
              id: 'fr-4',
              title: 'Search and Filtering',
              description: 'Advanced search capabilities with multiple filter options',
              priority: 'medium',
              category: 'feature',
            },
            {
              id: 'fr-5',
              title: 'Data Export',
              description: 'Users can export data in multiple formats (CSV, PDF, JSON)',
              priority: 'medium',
              category: 'enhancement',
            },
            {
              id: 'fr-6',
              title: 'Audit Logging',
              description: 'Comprehensive audit trail for all user actions',
              priority: 'high',
              category: 'core',
            },
          ],
          technicalRequirements: [
            {
              layer: 'frontend',
              technology: 'React 18',
              version: '18.x',
              rationale: 'Modern UI framework with excellent ecosystem and performance',
            },
            {
              layer: 'frontend',
              technology: 'TypeScript',
              version: '5.x',
              rationale: 'Type safety and improved developer experience',
            },
            {
              layer: 'frontend',
              technology: 'Tailwind CSS',
              version: '3.x',
              rationale: 'Utility-first CSS for rapid UI development',
            },
            {
              layer: 'backend',
              technology: 'Node.js',
              version: '20.x LTS',
              rationale: 'JavaScript runtime for unified full-stack development',
            },
            {
              layer: 'backend',
              technology: 'Express.js',
              version: '4.x',
              rationale: 'Lightweight and flexible web framework',
            },
            {
              layer: 'backend',
              technology: 'JWT Authentication',
              rationale: 'Stateless authentication mechanism for scalability',
            },
            {
              layer: 'database',
              technology: 'MongoDB',
              rationale: 'Flexible document database for rapid development',
            },
            {
              layer: 'database',
              technology: 'Mongoose ODM',
              rationale: 'Object data modeling for MongoDB with schema validation',
            },
            {
              layer: 'infrastructure',
              technology: 'Docker',
              rationale: 'Containerization for consistent deployment',
            },
          ],
          apiEndpoints: [
            {
              id: 'api-auth-1',
              method: 'POST',
              path: '/api/auth/register',
              description: 'Register a new user account',
              authentication: false,
              requestSchema: {
                email: 'string',
                password: 'string',
                name: 'string',
              },
              responseSchema: {
                success: 'boolean',
                user: 'User',
                token: 'string',
              },
            },
            {
              id: 'api-auth-2',
              method: 'POST',
              path: '/api/auth/login',
              description: 'Authenticate user and get JWT token',
              authentication: false,
              requestSchema: {
                email: 'string',
                password: 'string',
              },
              responseSchema: {
                success: 'boolean',
                user: 'User',
                token: 'string',
              },
            },
            {
              id: 'api-users-1',
              method: 'GET',
              path: '/api/users/:id',
              description: 'Get user profile information',
              authentication: true,
              responseSchema: {
                user: 'User',
              },
            },
            {
              id: 'api-users-2',
              method: 'PUT',
              path: '/api/users/:id',
              description: 'Update user profile',
              authentication: true,
              requestSchema: {
                name: 'string',
                email: 'string',
              },
              responseSchema: {
                success: 'boolean',
                user: 'User',
              },
            },
          ],
          dataModels: [
            {
              id: 'model-user',
              name: 'User',
              description: 'Represents an application user',
              fields: [
                { name: '_id', type: 'ObjectId', required: true, description: 'Unique identifier' },
                { name: 'email', type: 'String', required: true, description: 'User email address' },
                { name: 'password', type: 'String', required: true, description: 'Hashed password' },
                { name: 'name', type: 'String', required: true, description: 'Full name' },
                { name: 'role', type: 'String', required: true, description: 'User role (admin, user)' },
                { name: 'isActive', type: 'Boolean', required: true, description: 'Account status' },
                { name: 'createdAt', type: 'Date', required: true, description: 'Account creation time' },
                { name: 'updatedAt', type: 'Date', required: true, description: 'Last update time' },
              ],
            },
            {
              id: 'model-project',
              name: 'Project',
              description: 'Represents a user project',
              fields: [
                { name: '_id', type: 'ObjectId', required: true, description: 'Unique identifier' },
                { name: 'name', type: 'String', required: true, description: 'Project name' },
                { name: 'description', type: 'String', required: true, description: 'Project description' },
                { name: 'owner', type: 'ObjectId', required: true, description: 'Project owner user ID' },
                { name: 'status', type: 'String', required: true, description: 'Project status' },
                { name: 'createdAt', type: 'Date', required: true, description: 'Project creation time' },
              ],
              relationships: ['User._id'],
            },
          ],
          architecture:
            'Microservices-inspired monolithic architecture with clear separation of concerns. Frontend decoupled from backend via REST API. Database normalized with appropriate indexing.',
          securityConsiderations: [
            'Password hashing using bcrypt with salt rounds of 10',
            'JWT tokens with 24-hour expiration',
            'HTTPS/TLS for all communications',
            'CORS properly configured for frontend origin',
            'Input validation and sanitization on all endpoints',
            'SQL injection prevention through parameterized queries and ODM',
            'XSS protection through content security policies',
            'Rate limiting on authentication endpoints',
            'Secure session management',
            'Regular security audits and dependency updates',
          ],
          performanceRequirements: [
            'Page load time < 2 seconds',
            'API response time < 500ms for 95% of requests',
            'Database queries optimized with proper indexing',
            'CDN for static assets',
            'Caching strategy for frequently accessed data',
            'Lazy loading for large datasets',
          ],
          scalabilityPlan:
            'Horizontal scaling through load balancing. Database replication for read-heavy operations. Caching layer (Redis) for session management and frequently accessed data. Microservices migration path for future scaling.',
          deploymentStrategy:
            'Docker containerization for both frontend and backend. Kubernetes orchestration for production. CI/CD pipeline with GitHub Actions. Automated testing on every commit. Blue-green deployments for zero-downtime updates.',
          generatedAt: new Date().toISOString(),
          version: '1.0.0',
        },
      });
    }, 2000);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.post('/api/specifications/generate', {
  //     projectName,
  //     description,
  //     requirements,
  //   });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Get specification by ID
// Endpoint: GET /api/specifications/:specId
// Request: {}
// Response: { specification: AppSpecification }
export const getSpecification = (specId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        specification: {
          id: specId,
          projectName: 'Sample Project',
          projectDescription: 'A full-stack application',
          targetAudience: 'All users',
          objectives: ['Deliver quality application'],
          functionalRequirements: [],
          technicalRequirements: [],
          apiEndpoints: [],
          dataModels: [],
          architecture: 'Monolithic with microservices path',
          securityConsiderations: [],
          performanceRequirements: [],
          scalabilityPlan: 'Horizontal scaling with load balancing',
          deploymentStrategy: 'Docker and Kubernetes',
          generatedAt: new Date().toISOString(),
          version: '1.0.0',
        },
      });
    }, 500);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.get(`/api/specifications/${specId}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Export specification as PDF or Markdown
// Endpoint: GET /api/specifications/:specId/export
// Request: { format: 'pdf' | 'markdown' }
// Response: { url: string }
export const exportSpecification = (specId: string, format: 'pdf' | 'markdown') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        url: `/downloads/specification-${specId}.${format === 'pdf' ? 'pdf' : 'md'}`,
      });
    }, 500);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.get(`/api/specifications/${specId}/export`, {
  //     params: { format },
  //   });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};
