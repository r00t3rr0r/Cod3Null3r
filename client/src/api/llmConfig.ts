import api from './api';

export type LLMProvider = 'anthropic' | 'openai' | 'ollama' | 'lmstudio';

export interface LLMConfig {
  id: string;
  name: string;
  provider: LLMProvider;
  baseUrl: string;
  apiKey?: string;
  model: string;
  maxTokens: number;
  maxContentLength: number;
  temperature: number;
  topP: number;
  topK?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  systemPrompt?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LLMConfigResponse {
  success: boolean;
  config?: LLMConfig;
  configs?: LLMConfig[];
  message?: string;
}

// Description: Get all LLM configurations
// Endpoint: GET /api/llm-config
// Request: {}
// Response: { configs: Array<LLMConfig> }
export const getLLMConfigs = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        configs: [
          {
            id: 'claude-config',
            name: 'Claude Sonnet (Anthropic)',
            provider: 'anthropic',
            baseUrl: 'https://api.anthropic.com/v1',
            model: 'claude-3-5-sonnet-20241022',
            maxTokens: 8000,
            maxContentLength: 200000,
            temperature: 0.7,
            topP: 1.0,
            systemPrompt: 'You are a helpful AI assistant for code generation.',
            isDefault: true,
            createdAt: '2024-01-20T10:00:00Z',
            updatedAt: '2024-01-20T10:00:00Z',
          },
          {
            id: 'gpt4-config',
            name: 'GPT-4 Turbo (OpenAI)',
            provider: 'openai',
            baseUrl: 'https://api.openai.com/v1',
            model: 'gpt-4-turbo',
            maxTokens: 4096,
            maxContentLength: 128000,
            temperature: 0.8,
            topP: 1.0,
            frequencyPenalty: 0,
            presencePenalty: 0,
            isDefault: false,
            createdAt: '2024-01-20T10:00:00Z',
            updatedAt: '2024-01-20T10:00:00Z',
          },
          {
            id: 'ollama-config',
            name: 'Local Ollama Model',
            provider: 'ollama',
            baseUrl: 'http://localhost:11434/api',
            model: 'mistral',
            maxTokens: 2048,
            maxContentLength: 32000,
            temperature: 0.7,
            topP: 0.95,
            topK: 40,
            isDefault: false,
            createdAt: '2024-01-20T10:00:00Z',
            updatedAt: '2024-01-20T10:00:00Z',
          },
        ],
      });
    }, 400);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.get('/api/llm-config');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Get default LLM configuration
// Endpoint: GET /api/llm-config/default
// Request: {}
// Response: { config: LLMConfig }
export const getDefaultLLMConfig = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        config: {
          id: 'claude-config',
          name: 'Claude Sonnet (Anthropic)',
          provider: 'anthropic',
          baseUrl: 'https://api.anthropic.com/v1',
          model: 'claude-3-5-sonnet-20241022',
          maxTokens: 8000,
          maxContentLength: 200000,
          temperature: 0.7,
          topP: 1.0,
          systemPrompt: 'You are a helpful AI assistant for code generation.',
          isDefault: true,
          createdAt: '2024-01-20T10:00:00Z',
          updatedAt: '2024-01-20T10:00:00Z',
        },
      });
    }, 200);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.get('/api/llm-config/default');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Create or update LLM configuration
// Endpoint: POST /api/llm-config
// Request: LLMConfig (without id, createdAt, updatedAt)
// Response: { success: boolean, config: LLMConfig }
export const saveLLMConfig = (config: Omit<LLMConfig, 'id' | 'createdAt' | 'updatedAt'>) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        config: {
          ...config,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }, 300);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.post('/api/llm-config', config);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Update existing LLM configuration
// Endpoint: PUT /api/llm-config/:configId
// Request: Partial<LLMConfig>
// Response: { success: boolean, config: LLMConfig }
export const updateLLMConfig = (configId: string, config: Partial<LLMConfig>) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        config: {
          ...config,
          updatedAt: new Date().toISOString(),
        },
      });
    }, 300);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.put(`/api/llm-config/${configId}`, config);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Delete LLM configuration
// Endpoint: DELETE /api/llm-config/:configId
// Request: {}
// Response: { success: boolean }
export const deleteLLMConfig = (configId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 200);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.delete(`/api/llm-config/${configId}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Set default LLM configuration
// Endpoint: PUT /api/llm-config/:configId/default
// Request: {}
// Response: { success: boolean }
export const setDefaultLLMConfig = (configId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 200);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.put(`/api/llm-config/${configId}/default`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Test LLM configuration connection
// Endpoint: POST /api/llm-config/test
// Request: LLMConfig
// Response: { success: boolean, message: string }
export const testLLMConfig = (config: Omit<LLMConfig, 'id' | 'createdAt' | 'updatedAt'>) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `Successfully connected to ${config.provider} - ${config.model}`,
      });
    }, 1000);
  });

  // Uncomment to make actual API call
  // try {
  //   return await api.post('/api/llm-config/test', config);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};
