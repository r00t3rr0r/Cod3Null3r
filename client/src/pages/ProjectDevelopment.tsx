import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { FileTree } from '@/components/FileTree';
import { CodeEditor } from '@/components/CodeEditor';
import { AgentActivityFeed } from '@/components/AgentActivityFeed';
import { TasksOverview } from '@/components/TasksOverview';
import { FeedbackAnalysisDialog } from '@/components/FeedbackAnalysisDialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Loader, Bot } from 'lucide-react';
import { getProjectFiles } from '@/api/codeFiles';
import { getActivityFeed, sendAgentFeedback } from '@/api/agents';
import { getAIModels, getProjectAIModel, setProjectAIModel } from '@/api/aiModels';
import { analyzeFeedback } from '@/api/feedbackAnalysis';
import type { AIModel } from '@/api/aiModels';
import type { FeedbackSummary, ImplementationPlan } from '@/api/feedbackAnalysis';
import { useToast } from '@/hooks/useToast';

interface ProjectFile {
  path: string;
  content: string;
  language?: string;
}

interface ProjectActivity {
  id: string;
  agentId: string;
  agentName: string;
  task: string;
  status: string;
  filesModified: string[];
  timeSpent: number;
  timestamp: string;
}

export const ProjectDevelopment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [selectedFileContent, setSelectedFileContent] = useState<string>('');
  const [activities, setActivities] = useState<ProjectActivity[]>([]);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [aiModels, setAiModels] = useState<AIModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [modelLoading, setModelLoading] = useState(false);
  const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);
  const [feedbackSummary, setFeedbackSummary] = useState<FeedbackSummary | null>(null);
  const [implementationPlan, setImplementationPlan] = useState<ImplementationPlan | null>(null);
  const [analyzingFeedback, setAnalyzingFeedback] = useState(false);
  const [pendingFeedback, setPendingFeedback] = useState('');

  const loadProjectData = async () => {
    try {
      if (!id) return;
      const filesResponse = await getProjectFiles(id);
      setFiles(filesResponse.files);

      if (!selectedFile && filesResponse.files.length > 0) {
        setSelectedFile(filesResponse.files[0].path);
        setSelectedFileContent(filesResponse.files[0].content);
      }

      const activitiesResponse = await getActivityFeed(id);
      setActivities(activitiesResponse.activities);
    } catch (error) {
      console.error('Failed to load project data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load project data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAIModels = async () => {
    try {
      const [modelsResponse, projectModelResponse] = await Promise.all([
        getAIModels(),
        id ? getProjectAIModel(id) : Promise.resolve({ modelId: 'claude-sonnet-3.5' }),
      ]);
      setAiModels(modelsResponse.models);
      setSelectedModel(projectModelResponse.modelId);
    } catch (error) {
      console.error('Failed to load AI models:', error);
    }
  };

  useEffect(() => {
    loadProjectData();
    loadAIModels();
    const interval = setInterval(loadProjectData, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleFileSelect = (path: string) => {
    const file = files.find((f) => f.path === path);
    if (file) {
      setSelectedFile(path);
      setSelectedFileContent(file.content);
    }
  };

  const handleModelChange = async (modelId: string) => {
    if (!id) return;

    try {
      setModelLoading(true);
      await setProjectAIModel(id, modelId);
      setSelectedModel(modelId);
      toast({
        title: 'Success',
        description: 'AI model updated successfully',
      });
    } catch (error) {
      console.error('Failed to update AI model:', error);
      toast({
        title: 'Error',
        description: 'Failed to update AI model',
        variant: 'destructive',
      });
    } finally {
      setModelLoading(false);
    }
  };

  const handleSendFeedback = async () => {
    if (!feedback.trim()) return;

    try {
      setAnalyzingFeedback(true);
      setPendingFeedback(feedback);

      // Analyze the feedback
      console.log('Analyzing feedback:', feedback);
      const analysis = await analyzeFeedback(feedback, id || '');

      setFeedbackSummary(analysis.summary);
      setImplementationPlan(analysis.implementationPlan);
      setAnalysisDialogOpen(true);

      console.log('Feedback analysis completed successfully');
    } catch (error) {
      console.error('Failed to analyze feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to analyze feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setAnalyzingFeedback(false);
    }
  };

  const handleConfirmFeedback = async () => {
    try {
      setFeedbackLoading(true);
      console.log('Proceeding with implementation of feedback');

      await sendAgentFeedback({
        projectId: id || '',
        agentId: 'code-monkey',
        feedback: pendingFeedback,
      });

      setFeedback('');
      setPendingFeedback('');
      setFeedbackSummary(null);
      setImplementationPlan(null);

      toast({
        title: 'Success',
        description: 'Feedback sent to agents. Implementation is starting...',
      });

      console.log('Feedback submitted to agents successfully');
    } catch (error) {
      console.error('Failed to send feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to send feedback to agents',
        variant: 'destructive',
      });
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleCancelFeedback = () => {
    console.log('User cancelled feedback implementation');
    setFeedbackSummary(null);
    setImplementationPlan(null);
    setPendingFeedback('');
    // Keep the feedback in the textarea for user to edit
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex overflow-hidden gap-4 p-4">
          {/* Left Panel - File Tree */}
          <div className="w-64 overflow-hidden">
            <FileTree
              files={files}
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
            />
          </div>

          {/* Center Panel - Code Editor */}
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              filePath={selectedFile}
              content={selectedFileContent}
              language={selectedFile?.split('.').pop() || 'typescript'}
              readOnly={true}
            />
          </div>

          {/* Right Panel - Activity, Tasks & Feedback */}
          <div className="w-96 flex flex-col gap-4 overflow-hidden">
            {/* Tabs for Activity and Tasks */}
            <div className="flex-1 overflow-hidden">
              <Tabs defaultValue="activity" className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                </TabsList>
                <TabsContent value="activity" className="flex-1 overflow-hidden mt-2">
                  <AgentActivityFeed activities={activities} />
                </TabsContent>
                <TabsContent value="tasks" className="flex-1 overflow-hidden mt-2">
                  {id && <TasksOverview projectId={id} />}
                </TabsContent>
              </Tabs>
            </div>

            {/* AI Model Selection & Feedback */}
            <Card className="flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Agent Feedback</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-3">
                {/* AI Model Selection */}
                <div className="space-y-2">
                  <Label htmlFor="ai-model" className="text-sm flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    AI Model
                  </Label>
                  <Select
                    value={selectedModel}
                    onValueChange={handleModelChange}
                    disabled={modelLoading}
                  >
                    <SelectTrigger id="ai-model">
                      <SelectValue placeholder="Select AI model" />
                    </SelectTrigger>
                    <SelectContent>
                      {aiModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{model.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {model.provider} • {model.contextWindow.toLocaleString()} tokens
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedModel && (
                    <p className="text-xs text-muted-foreground">
                      {aiModels.find(m => m.id === selectedModel)?.description}
                    </p>
                  )}
                </div>

                {/* Feedback Textarea */}
                <div className="space-y-2">
                  <Label htmlFor="feedback" className="text-sm">
                    Your Feedback
                  </Label>
                  <Textarea
                    id="feedback"
                    placeholder="Tell agents what to improve or change..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="resize-none h-24"
                  />
                </div>

                <Button
                  onClick={handleSendFeedback}
                  disabled={feedbackLoading || analyzingFeedback || !feedback.trim()}
                  className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600"
                >
                  {feedbackLoading || analyzingFeedback ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      {analyzingFeedback ? 'Analyzing...' : 'Sending...'}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Feedback
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Feedback Analysis Dialog */}
      <FeedbackAnalysisDialog
        open={analysisDialogOpen}
        onOpenChange={setAnalysisDialogOpen}
        summary={feedbackSummary}
        implementationPlan={implementationPlan}
        isLoading={analyzingFeedback}
        onConfirm={handleConfirmFeedback}
        onCancel={handleCancelFeedback}
      />
    </div>
  );
};
