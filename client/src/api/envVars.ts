import api from './api';

export interface EnvVar {
  id: string;
  key: string;
  value: string;
  description?: string;
  isSecret: boolean;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

// Description: Get all environment variables for a project
// Endpoint: GET /api/projects/:projectId/env-vars
// Request: {}
// Response: { envVars: Array<EnvVar> }
export const getProjectEnvVars = (projectId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        envVars: [
          {
            id: 'env-1',
            key: 'DATABASE_URL',
            value: 'mongodb://localhost:27017/myapp',
            description: 'MongoDB connection string',
            isSecret: true,
            projectId,
            createdAt: '2024-01-22T10:00:00Z',
            updatedAt: '2024-01-22T10:00:00Z',
          },
          {
            id: 'env-2',
            key: 'JWT_SECRET',
            value: '*********************',
            description: 'Secret key for JWT token signing',
            isSecret: true,
            projectId,
            createdAt: '2024-01-22T10:00:00Z',
            updatedAt: '2024-01-22T10:00:00Z',
          },
          {
            id: 'env-3',
            key: 'PORT',
            value: '3000',
            description: 'Server port number',
            isSecret: false,
            projectId,
            createdAt: '2024-01-22T10:00:00Z',
            updatedAt: '2024-01-22T10:00:00Z',
          },
          {
            id: 'env-4',
            key: 'NODE_ENV',
            value: 'development',
            description: 'Application environment',
            isSecret: false,
            projectId,
            createdAt: '2024-01-22T10:00:00Z',
            updatedAt: '2024-01-22T10:00:00Z',
          },
          {
            id: 'env-5',
            key: 'API_KEY',
            value: '*********************',
            description: 'External API key',
            isSecret: true,
            projectId,
            createdAt: '2024-01-22T10:00:00Z',
            updatedAt: '2024-01-22T10:00:00Z',
          },
        ],
      });
    }, 400);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.get(`/api/projects/${projectId}/env-vars`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Create new environment variable
// Endpoint: POST /api/projects/:projectId/env-vars
// Request: { key: string, value: string, description?: string, isSecret: boolean }
// Response: { success: boolean, envVar: EnvVar }
export const createEnvVar = (projectId: string, data: Omit<EnvVar, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        envVar: {
          id: Math.random().toString(36).substr(2, 9),
          projectId,
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }, 300);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.post(`/api/projects/${projectId}/env-vars`, data);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Update environment variable
// Endpoint: PUT /api/env-vars/:envVarId
// Request: { key?: string, value?: string, description?: string, isSecret?: boolean }
// Response: { success: boolean, envVar: EnvVar }
export const updateEnvVar = (envVarId: string, data: Partial<Omit<EnvVar, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>>) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        envVar: {
          id: envVarId,
          ...data,
          updatedAt: new Date().toISOString(),
        },
      });
    }, 300);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.put(`/api/env-vars/${envVarId}`, data);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Delete environment variable
// Endpoint: DELETE /api/env-vars/:envVarId
// Request: {}
// Response: { success: boolean }
export const deleteEnvVar = (envVarId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
      });
    }, 300);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.delete(`/api/env-vars/${envVarId}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Get decrypted value of secret environment variable
// Endpoint: GET /api/env-vars/:envVarId/reveal
// Request: {}
// Response: { value: string }
export const revealEnvVarValue = (envVarId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        value: 'sk-1234567890abcdefghijklmnopqrstuvwxyz',
      });
    }, 200);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.get(`/api/env-vars/${envVarId}/reveal`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};
