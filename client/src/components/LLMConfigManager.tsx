import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Plus, Trash2, Edit, Check, X, Zap, Network, Settings2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import {
  getLLMConfigs,
  getDefaultLLMConfig,
  saveLLMConfig,
  updateLLMConfig,
  deleteLLMConfig,
  setDefaultLLMConfig,
  testLLMConfig,
} from '@/api/llmConfig';
import type { LLMConfig, LLMProvider } from '@/api/llmConfig';

export const LLMConfigManager: React.FC = () => {
  const { toast } = useToast();
  const [configs, setConfigs] = useState<LLMConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<LLMConfig | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    provider: 'anthropic' as LLMProvider,
    baseUrl: '',
    apiKey: '',
    model: '',
    maxTokens: 8000,
    maxContentLength: 200000,
    temperature: 0.7,
    topP: 1.0,
    topK: undefined as number | undefined,
    frequencyPenalty: undefined as number | undefined,
    presencePenalty: undefined as number | undefined,
    systemPrompt: '',
  });

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const response = await getLLMConfigs();
      setConfigs(response.configs);
    } catch (error) {
      console.error('Failed to load LLM configs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load LLM configurations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfigs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenDialog = (config?: LLMConfig) => {
    if (config) {
      setEditingConfig(config);
      setFormData({
        name: config.name,
        provider: config.provider,
        baseUrl: config.baseUrl,
        apiKey: config.apiKey || '',
        model: config.model,
        maxTokens: config.maxTokens,
        maxContentLength: config.maxContentLength,
        temperature: config.temperature,
        topP: config.topP,
        topK: config.topK,
        frequencyPenalty: config.frequencyPenalty,
        presencePenalty: config.presencePenalty,
        systemPrompt: config.systemPrompt || '',
      });
    } else {
      setEditingConfig(null);
      setFormData({
        name: '',
        provider: 'anthropic',
        baseUrl: '',
        apiKey: '',
        model: '',
        maxTokens: 8000,
        maxContentLength: 200000,
        temperature: 0.7,
        topP: 1.0,
        topK: undefined,
        frequencyPenalty: undefined,
        presencePenalty: undefined,
        systemPrompt: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingConfig(null);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.baseUrl.trim() || !formData.model.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Name, Base URL, and Model are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      const configData = {
        name: formData.name,
        provider: formData.provider,
        baseUrl: formData.baseUrl,
        apiKey: formData.apiKey || undefined,
        model: formData.model,
        maxTokens: formData.maxTokens,
        maxContentLength: formData.maxContentLength,
        temperature: formData.temperature,
        topP: formData.topP,
        topK: formData.topK,
        frequencyPenalty: formData.frequencyPenalty,
        presencePenalty: formData.presencePenalty,
        systemPrompt: formData.systemPrompt || undefined,
        isDefault: editingConfig?.isDefault || false,
      };

      if (editingConfig) {
        await updateLLMConfig(editingConfig.id, configData);
        toast({
          title: 'Success',
          description: 'LLM configuration updated successfully',
        });
      } else {
        await saveLLMConfig(configData);
        toast({
          title: 'Success',
          description: 'LLM configuration created successfully',
        });
      }

      handleCloseDialog();
      loadConfigs();
    } catch (error) {
      console.error('Failed to save LLM config:', error);
      toast({
        title: 'Error',
        description: 'Failed to save LLM configuration',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLLMConfig(id);
      toast({
        title: 'Success',
        description: 'LLM configuration deleted successfully',
      });
      setDeleteConfirmId(null);
      loadConfigs();
    } catch (error) {
      console.error('Failed to delete config:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete LLM configuration',
        variant: 'destructive',
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultLLMConfig(id);
      toast({
        title: 'Success',
        description: 'Default LLM configuration updated',
      });
      loadConfigs();
    } catch (error) {
      console.error('Failed to set default:', error);
      toast({
        title: 'Error',
        description: 'Failed to set default configuration',
        variant: 'destructive',
      });
    }
  };

  const handleTest = async (config: LLMConfig) => {
    try {
      setTestingId(config.id);
      await testLLMConfig({
        name: config.name,
        provider: config.provider,
        baseUrl: config.baseUrl,
        model: config.model,
        maxTokens: config.maxTokens,
        maxContentLength: config.maxContentLength,
        temperature: config.temperature,
        topP: config.topP,
        isDefault: config.isDefault,
      });
      toast({
        title: 'Success',
        description: `Successfully connected to ${config.provider} - ${config.model}`,
      });
    } catch (error) {
      console.error('Failed to test config:', error);
      toast({
        title: 'Error',
        description: 'Failed to connect to LLM provider',
        variant: 'destructive',
      });
    } finally {
      setTestingId(null);
    }
  };

  const getProviderColor = (provider: LLMProvider) => {
    switch (provider) {
      case 'anthropic':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'openai':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ollama':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'lmstudio':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading LLM configurations...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                LLM Configuration
              </CardTitle>
              <CardDescription>
                Configure and manage AI language models for your projects
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => handleOpenDialog()}
                  className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600"
                >
                  <Plus className="h-4 w-4" />
                  Add Configuration
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingConfig ? 'Edit LLM Configuration' : 'Add LLM Configuration'}
                  </DialogTitle>
                  <DialogDescription>
                    Configure a new LLM provider or update existing settings
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    <TabsTrigger value="prompt">System</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Configuration Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Claude Sonnet Production"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="provider">Provider</Label>
                      <Select value={formData.provider} onValueChange={(value) =>
                        setFormData({ ...formData, provider: value as LLMProvider })
                      }>
                        <SelectTrigger id="provider">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                          <SelectItem value="openai">OpenAI (GPT)</SelectItem>
                          <SelectItem value="ollama">Ollama (Local)</SelectItem>
                          <SelectItem value="lmstudio">LMStudio (Local)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="baseUrl">Base URL</Label>
                      <Input
                        id="baseUrl"
                        placeholder="https://api.anthropic.com/v1 or http://localhost:11434/api"
                        value={formData.baseUrl}
                        onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="apiKey">API Key (Optional for local models)</Label>
                      <Input
                        id="apiKey"
                        type="password"
                        placeholder="Your API key"
                        value={formData.apiKey}
                        onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="model">Model Name</Label>
                      <Input
                        id="model"
                        placeholder="e.g., claude-3-5-sonnet-20241022"
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="maxTokens">Max Tokens</Label>
                        <Input
                          id="maxTokens"
                          type="number"
                          value={formData.maxTokens}
                          onChange={(e) =>
                            setFormData({ ...formData, maxTokens: parseInt(e.target.value) })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maxContentLength">Max Content Length</Label>
                        <Input
                          id="maxContentLength"
                          type="number"
                          value={formData.maxContentLength}
                          onChange={(e) =>
                            setFormData({ ...formData, maxContentLength: parseInt(e.target.value) })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="temperature">Temperature (0-2)</Label>
                        <Input
                          id="temperature"
                          type="number"
                          step="0.1"
                          min="0"
                          max="2"
                          value={formData.temperature}
                          onChange={(e) =>
                            setFormData({ ...formData, temperature: parseFloat(e.target.value) })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="topP">Top P (0-1)</Label>
                        <Input
                          id="topP"
                          type="number"
                          step="0.01"
                          min="0"
                          max="1"
                          value={formData.topP}
                          onChange={(e) =>
                            setFormData({ ...formData, topP: parseFloat(e.target.value) })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="topK">Top K (Optional)</Label>
                        <Input
                          id="topK"
                          type="number"
                          placeholder="e.g., 40"
                          value={formData.topK || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              topK: e.target.value ? parseInt(e.target.value) : undefined,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="frequencyPenalty">Frequency Penalty (Optional)</Label>
                        <Input
                          id="frequencyPenalty"
                          type="number"
                          step="0.1"
                          placeholder="e.g., 0"
                          value={formData.frequencyPenalty || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              frequencyPenalty: e.target.value ? parseFloat(e.target.value) : undefined,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="presencePenalty">Presence Penalty (Optional)</Label>
                        <Input
                          id="presencePenalty"
                          type="number"
                          step="0.1"
                          placeholder="e.g., 0"
                          value={formData.presencePenalty || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              presencePenalty: e.target.value ? parseFloat(e.target.value) : undefined,
                            })
                          }
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="prompt" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="systemPrompt">System Prompt (Optional)</Label>
                      <Textarea
                        id="systemPrompt"
                        placeholder="Define the system prompt for consistent behavior..."
                        value={formData.systemPrompt}
                        onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                        className="h-32"
                      />
                      <p className="text-xs text-muted-foreground">
                        This sets the behavior and context for the AI model
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                <DialogFooter>
                  <Button variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>
                    {editingConfig ? 'Update' : 'Create'} Configuration
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          {configs.length === 0 ? (
            <div className="text-center py-12">
              <Network className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No configurations</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first LLM configuration to get started
              </p>
              <Button
                onClick={() => handleOpenDialog()}
                className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600"
              >
                <Plus className="h-4 w-4" />
                Add Configuration
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {configs.map((config) => (
                <div
                  key={config.id}
                  className="p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{config.name}</h4>
                        <Badge className={getProviderColor(config.provider)}>
                          {config.provider.toUpperCase()}
                        </Badge>
                        {config.isDefault && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Default
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-2">
                        <div>
                          <span className="font-medium">Model:</span> {config.model}
                        </div>
                        <div>
                          <span className="font-medium">Max Tokens:</span> {config.maxTokens}
                        </div>
                        <div>
                          <span className="font-medium">Temperature:</span> {config.temperature}
                        </div>
                        <div>
                          <span className="font-medium">Context:</span> {config.maxContentLength.toLocaleString()} tokens
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        Base URL: {config.baseUrl}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTest(config)}
                        disabled={testingId === config.id}
                        className="gap-1"
                      >
                        {testingId === config.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                            Testing...
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4" />
                            Test
                          </>
                        )}
                      </Button>

                      {!config.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(config.id)}
                          title="Set as default"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(config)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirmId(config.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteConfirmId !== null} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent className="bg-white dark:bg-slate-900">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Configuration?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this LLM configuration. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
