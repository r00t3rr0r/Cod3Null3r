import api from './api';

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  contextWindow: number;
  costPer1kTokens: number;
}

// Description: Get available AI models
// Endpoint: GET /api/ai-models
// Request: {}
// Response: { models: Array<AIModel> }
export const getAIModels = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        models: [
          {
            id: 'claude-sonnet-4',
            name: 'Claude Sonnet 4',
            provider: 'Anthropic',
            description: 'Most capable model for complex tasks',
            contextWindow: 200000,
            costPer1kTokens: 0.015,
          },
          {
            id: 'claude-sonnet-3.5',
            name: 'Claude Sonnet 3.5',
            provider: 'Anthropic',
            description: 'Balanced performance and speed',
            contextWindow: 200000,
            costPer1kTokens: 0.008,
          },
          {
            id: 'claude-haiku',
            name: 'Claude Haiku',
            provider: 'Anthropic',
            description: 'Fast and efficient for simple tasks',
            contextWindow: 200000,
            costPer1kTokens: 0.0008,
          },
          {
            id: 'gpt-4-turbo',
            name: 'GPT-4 Turbo',
            provider: 'OpenAI',
            description: 'Advanced reasoning capabilities',
            contextWindow: 128000,
            costPer1kTokens: 0.01,
          },
          {
            id: 'gpt-3.5-turbo',
            name: 'GPT-3.5 Turbo',
            provider: 'OpenAI',
            description: 'Fast and cost-effective',
            contextWindow: 16000,
            costPer1kTokens: 0.0005,
          },
        ],
      });
    }, 300);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.get('/api/ai-models');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Get default AI model for project
// Endpoint: GET /api/projects/:projectId/ai-model
// Request: {}
// Response: { modelId: string }
export const getProjectAIModel = (projectId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        modelId: 'claude-sonnet-3.5',
      });
    }, 200);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.get(`/api/projects/${projectId}/ai-model`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Set AI model for project
// Endpoint: PUT /api/projects/:projectId/ai-model
// Request: { modelId: string }
// Response: { success: boolean }
export const setProjectAIModel = (projectId: string, modelId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
      });
    }, 200);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.put(`/api/projects/${projectId}/ai-model`, { modelId });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};
