import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { FileTree } from '@/components/FileTree';
import { CodeEditor } from '@/components/CodeEditor';
import { AgentActivityFeed } from '@/components/AgentActivityFeed';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Loader } from 'lucide-react';
import { getProjectFiles } from '@/api/codeFiles';
import { getActivityFeed, sendAgentFeedback } from '@/api/agents';
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
      toast({
        title: 'Error',
        description: 'Failed to load project data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectData();
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

  const handleSendFeedback = async () => {
    if (!feedback.trim()) return;

    try {
      setFeedbackLoading(true);
      await sendAgentFeedback({
        projectId: id,
        agentId: 'code-monkey',
        feedback,
      });
      setFeedback('');
      toast({
        title: 'Success',
        description: 'Feedback sent to agents',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send feedback',
        variant: 'destructive',
      });
    } finally {
      setFeedbackLoading(false);
    }
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

          {/* Right Panel - Activity Feed & Feedback */}
          <div className="w-96 flex flex-col gap-4 overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <AgentActivityFeed activities={activities} />
            </div>

            <Card className="flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Provide Feedback</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-3">
                <Textarea
                  placeholder="Tell agents what to improve or change..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="flex-1 resize-none"
                />
                <Button
                  onClick={handleSendFeedback}
                  disabled={feedbackLoading || !feedback.trim()}
                  className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600"
                >
                  {feedbackLoading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Sending...
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
    </div>
  );
};